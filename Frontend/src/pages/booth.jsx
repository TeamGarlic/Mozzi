import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePositionAction, updatePubVideoMapAction, updateSubVideoMapAction,
} from '@/modules/canvasAction.js';
import MakeBooth from "@/pages/makeBooth";
import TakePic from "@/pages/takePic";
import AfterTake from "@/pages/afterfTake";
import Finish from "@/pages/finish";
import { useParams, useLocation } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { drawCanvas, drawMask, chromaKey } from "@/utils/videoUtil.js";
import useSession from "@/hooks/useSession.js";
import { changeBgAction } from "@/modules/bgAction.js";
import { checkHost } from "@/utils/DecoratorUtil.js";
import itemApi from "@/api/itemApi.js";
import userApi from "@/api/userApi.js";
import { AppStore } from "@/store/AppStore.js";
import Spinner from "@/components/Spinner.jsx"
import { usePreventGoBack } from "@/hooks/usePreventGoBack.js";

function Booth() {
  // hooks
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    joinSession,
    leaveSession,
    publisher,
    subscribers,
    sendMessage,
    chatLists,
    gotoTakePic,
    gotoModifing,
    gotoFinish,
    nowTaking,
    now,
    setFrame,
    timer,
    taken,
    timeChange,
    startTaking,
    finishTaking,
    position,
    setPosition,
    sendPosition,
    updatePosition,
    changeBg,
    mozzi,
    sendMozzi,
    updateMozzi,
    shareSecret,
    setShareSecret,
    sendFileName,
  } = useSession(shareCode);


  // global variables
  let localVideoMap = {};
  const userConfig = location.state ? { isHost: location.state.isHost } : undefined;

  usePreventGoBack();

  // useState
  const [user, setUser] = useState(userConfig);
  const [bgList, setBgList] = useState([]);
  const [delay, setDelay] = useState(true);
  const [frameList, setFrameList] = useState([]);

  // useSelector
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  const pubVideoMap = useSelector((state) => state.canvasReducer.pubVideoMap);
  const subVideoMap = useSelector((state) => state.canvasReducer.subVideoMap);
  const localPosition = useSelector((state) => state.canvasReducer.position);
  const canvasConfig = useSelector((state) => state.canvasReducer.canvasConfig);
  const bgNow = useSelector((state) => state.bgReducer.bgNow);
  const pickedFrame = useSelector((state) => state.clipReducer.frame);

  // useRef
  const webcamRef = useRef();
  const bgRemovedRef = useRef();
  const bgRemovedContextRef = useRef();
  const pubVideoRef = useRef();
  const pubCanvasRef = useRef();
  const subVideoRefs = useRef({});
  const subCanvasRefs = useRef({});


  let startTake = () => {
    if (pickedFrame.id === 0) return;
    sendPosition(position);
    setFrame(pickedFrame);
    gotoTakePic();
    setShareSecret(location.state.shareSecret);
  }
  startTake = checkHost(startTake, user ? user.isHost : undefined);

  const onResults = (results) => {
    drawMask(bgRemovedRef.current, bgRemovedContextRef.current, results, canvasConfig.visibility, canvasConfig.degree*Math.PI/180, canvasConfig.scale/100);
    chromaKey(pubVideoMap.canvasRef, pubVideoMap.canvasContextRef, pubVideoMap.vidRef);
    for (let key in subVideoMap) {
      chromaKey(subVideoMap[key].canvasRef, subVideoMap[key].canvasContextRef, subVideoMap[key].vidRef);
    }

    if (mainCanvas.canvas){
      drawCanvas(mainCanvas.canvas.current, mainCanvas.context.current, bgNow.img, localPosition);
    }
  };

  const initPosition = () => {
    if(publisher&&(now === "MAKING")){
      const newPosition = [];
      newPosition.push({
        id : publisher.stream.connection.connectionId,
        x:0,
        y:0,
        width:0.4,
        height:0.4,
      })
      let d = 0.1;
      subscribers.forEach((sub) =>{
        newPosition.push({
          id : sub.stream.connection.connectionId,
          x:d,
          y:d,
          width:0.4,
          height:0.4,
        })
        d+=0.1
      });
      setPosition(newPosition);
    }
  }

  const getBgList = async (pageNum, pageSize) => {
    try {
      let res = await itemApi.getBgList(pageNum, pageSize);
      if (res.status === 200) {
        setBgList(res.data.data.backgrounds);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getFrameList = async () => {
    try {
      let res = await itemApi.getFrameList();
      if (res.status === 200) {
        setFrameList(res.data.data.frames);
      }
    } catch (e) {
      console.log(e);
    }
  }

  const userJoin = async (initialState, ref)=> {
    console.log(userConfig);
    if(userConfig === undefined) {
      alert("잘못된 접근입니다.");
      window.location.href="/";
      return;
    }

    let res = await userApi.getUser();
    res = res ? res : {status:404};
    if(res.status ===200){
      const userData = res.data.data
      setUser((prev)=>{
        joinSession(userData.userNickname, ref);
        return {...prev, userData}
      });
    }else{
      let guest = prompt("이름을 입력하세요", "GUEST");
      if (!guest) {
        alert("메인 화면으로 돌아갑니다.");
        window.location.href="/";
      }
      setUser((prev)=>{
        joinSession(guest, ref);
        return {...prev, userNickname:guest}
      });
    }
  }


  // useEffect : []
  useEffect(() => {
    AppStore.setRunningSpinner();

    getFrameList();
    const bgImg = new Image();
    // TODO : 배경이미지 API로 받아오기
    getBgList(1, 100);
    bgImg.src = "https://api.mozzi.lol/files/object/1691022079984_bg2.jpg";
    bgImg.crossOrigin = "anonymous";
    dispatch(changeBgAction({ img: bgImg }));
    bgRemovedContextRef.current = bgRemovedRef.current.getContext("2d");
    const constraints = {
      video: { width: { max: 1280 }, height: { max: 720 } },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      webcamRef.current.srcObject = stream;
      sendToMediaPipe();
    });
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({
      modelSelection: 0,
      selfieMode: true,
    });
    selfieSegmentation.onResults(onResults);
    const sendToMediaPipe = async () => {
      if (!webcamRef.current.videoWidth) {
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: webcamRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
    };
    // initiateUser();
    userJoin(userConfig,  bgRemovedRef.current.captureStream(30).getVideoTracks()[0])
  }, []);


  // useEffect : [leaveSession]
  useEffect(() => {
    window.addEventListener("beforeunload", leaveSession);
    return () => {
      window.removeEventListener("beforeunload", leaveSession);
    };
  }, [leaveSession]);


  // useEffect : [subscribers]
  useEffect(() => {
    for (let key in localVideoMap) {
      delete localVideoMap[key];
    }
    if (subscribers) {
      subscribers.forEach((sub) => {
        localVideoMap[sub.stream.connection.connectionId] = {
          ...localVideoMap[sub.stream.connection.connectionId],
          vidRef:
            subVideoRefs.current[sub.stream.connection.connectionId],
          canvasRef:
            subCanvasRefs.current[sub.stream.connection.connectionId],
          canvasContextRef:
            subCanvasRefs.current[
              sub.stream.connection.connectionId
              ].getContext("2d", { willReadFrequently: true }),
        };
        sub.addVideoElement(
          subVideoRefs.current[sub.stream.connection.connectionId]
        );
      });
    }
    // console.log(localVideoMap);
    dispatch(updateSubVideoMapAction(localVideoMap));
    // console.log(subVideoMap);
    initPosition();
  }, [subscribers]);


  // useEffect : [publisher]
  useEffect(() => {
    if (publisher){
      setDelay(false);
      AppStore.setStopSpinner();
      // console.log(publisher.session.connection.data);
      publisher.addVideoElement(pubVideoRef.current);
      dispatch(updatePubVideoMapAction({
        vidRef:pubVideoRef.current,
        canvasRef:pubCanvasRef.current,
        canvasContextRef:pubCanvasRef.current.getContext("2d", { willReadFrequently: true }),
        nickname : JSON.parse(publisher.stream.connection.data).clientData
      }));
    }
    initPosition();

  }, [publisher]);


  // useEffect : [position]
  useEffect(() => {
    dispatch(updatePositionAction(position));
  }, [position]);

  return (
    <>
      <video autoPlay ref={webcamRef} className="collapse absolute" />
      {/*<canvas ref={bgRemovedRef}  width={1280} height={720} className="collapse absolute" />*/}
      <canvas ref={bgRemovedRef}  width={1280} height={720} className="collapse fixed" />

      <video ref={pubVideoRef} className="collapse absolute" ></video>
      {/*<canvas ref={pubCanvasRef}  width={1280} height={720} className="collapse absolute" />*/}
      <canvas ref={pubCanvasRef}  width={1280} height={720} className="collapse fixed" />

      {subscribers &&
        subscribers.map((sub) => {
          return (
            <div key={sub.stream.connection.connectionId}>
              <video
                ref={(elem) =>
                  (subVideoRefs.current[sub.stream.connection.connectionId] = elem)
                }
                className="collapse absolute"
              ></video>
              <canvas
                ref={(elem) =>
                  (subCanvasRefs.current[sub.stream.connection.connectionId] = elem)
                }
                className="collapse absolute"
              ></canvas>
            </div>
          );
        })}
      {delay ? (
        <Spinner/>
      ): (
        <>
          {now === "MAKING" && (
            <MakeBooth
              startTake={startTake}
              shareCode={shareCode}
              leaveSession={leaveSession}
              frameList={frameList}
              user={user}
              setFrame={setFrame}
            />
          )}
          {now === "TAKING" && (
            <TakePic
              shareCode={shareCode}
              sendMessage={sendMessage}
              chatLists={chatLists}
              user={user}
              bgList={bgList}
              goNext={gotoModifing}
              timer={timer}
              timeChange={timeChange}
              taken={taken}
              startTaking={startTaking}
              finishTaking={finishTaking}
              nowTaking={nowTaking}
              myId={publisher.stream.connection.connectionId}
              updatePosition={updatePosition}
              changeBg={changeBg}
              position={position}
              sendPosition={sendPosition}
              setPosition={setPosition}
              sendFileName={sendFileName}
              shareSecret={shareSecret}
              publisher={publisher}
              subscribers={subscribers}
            />
          )}
          {now === "MODIFING" && (
            <AfterTake
              goNext={gotoFinish}
              user={user}
              sendMozzi={sendMozzi}
              updateMozzi={updateMozzi}
            />
          )}
          {now === "FINISH" && (
              <Finish
              mozzi={mozzi}
              subscribers ={subscribers}
              publisher={publisher}
          />)}
        </>
      )}
    </>
  );
}

export default Booth;
