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
    sendRecordingSignal,
    recordingMozzi,
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
  const [alertModal, setAlertModal] = useState(false);
  const [recordingModal, setRecordingModal] = useState(false);

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
  startTake = checkHost(startTake, user ? user.isHost : undefined, setAlertModal);

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
        joinSession(userData.userNickname, ref, user.isHost);
        return {...prev, userData}
      });
    }else{
      let guest = prompt("이름을 입력하세요", "GUEST");
      if (!guest) {
        alert("메인 화면으로 돌아갑니다.");
        window.location.href="/";
      }
      setUser((prev)=>{
        joinSession(guest, ref, 0);
        return {...prev, userNickname:guest}
      });
    }
  }

  function closeAlertModal(){
    setAlertModal(false)
  }

  function closeRecordingModal(){
    setRecordingModal(false)
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
          nickName: JSON.parse(sub.stream.connection.data).clientData
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
    <div className="w-full h-full">
      <video autoPlay ref={webcamRef} className="collapse fixed" />
      <canvas ref={bgRemovedRef}  width={1280} height={720} className="collapse fixed" />

      <video ref={pubVideoRef} className="collapse fixed" ></video>
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
          {alertModal && (
            <div className="w-64 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed left-1/4 top-8" role="alert">
              <strong className="font-bold">방장만 가능한 기능입니다.</strong>
              {/* <span class="block sm:inline">Something seriously bad happened.</span> */}
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={closeAlertModal} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          )}
          {recordingModal && (
            <div className="w-64 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded fixed left-1/4 top-16" role="alert">
              <strong className="font-bold">촬영중입니다.</strong>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={closeRecordingModal} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
              </span>
            </div>
          )}
          {now === "MAKING" && (
            <MakeBooth
              startTake={startTake}
              shareCode={shareCode}
              leaveSession={leaveSession}
              frameList={frameList}
              user={user}
              setFrame={setFrame}
              setAlertModal={setAlertModal}
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
              setAlertModal={setAlertModal}
              setRecordingModal={setRecordingModal}
            />
          )}
          {now === "MODIFING" && (
            <AfterTake
              goNext={gotoFinish}
              user={user}
              sendMozzi={sendMozzi}
              updateMozzi={updateMozzi}
              setAlertModal={setAlertModal}
              sendRecordingSignal={sendRecordingSignal}
              recordingMozzi={recordingMozzi}
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
    </div>
  );
}

export default Booth;
