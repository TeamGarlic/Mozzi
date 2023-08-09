import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updatePositionAction, updatePubVideoMapAction, updateSubVideoMapAction,
} from '@/modules/canvasAction.js';
import MakeBooth from "./makeBooth";
import TakePic from "./takePic";
import AfterTake from "./afterfTake";
import Finish from "./finish";
import { useParams, useLocation } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { drawCanvas, drawMask, chromaKey } from "@/utils/videoUtil.js";
import useSession from "@/hooks/useSession.js";
import { changeBgAction } from "@/modules/bgAction.js";
import { checkHost } from "@/utils/DecoratorUtil.js";
import itemApi from "@/api/itemApi.js";
import {usePreventGoBack} from "@/hooks/usePreventGoBack.js";
import userApi from "@/api/userApi.js";
import {AppStore} from "@/store/AppStore.js";
import Spinner from "@/components/Spinner.jsx"

function Booth() {
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  // console.log(sessionID);
  const location = useLocation();
  let userConfig={};
  try{
  userConfig = {isHost : location.state.isHost};
  }catch{
  alert("잘못된 접근입니다.");
      window.location.replace("/");
  }
  const [user,setUser] = useState(userConfig);
  const [bgList, setBgList] = useState([]);
  const [frameList, setFrameList] = useState([]);
  const pickedFrame = useSelector((state) => state.clipReducer.frame);

  const preventgoBack = usePreventGoBack();

  const {
    session,
    subscribers,
    joinSession,
    sendMessage,
    chatLists,
    publisher,
    leaveSession,
    gotoTakePic,
    gotoModifing,
    gotoFinish,
    nowTaking,
    now,
    setNow,
    setFrame,
    sendBlob,
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
  } = useSession(shareCode);

  // 소스 웹캠 video
  const webcamRef = useRef();
  // 배경 제거된 영상 그리는 canvas, context, layer 정보
  const bgRemovedRef = useRef();
  const bgRemovedContextRef = useRef();

  const camCanvases = useSelector((state) => state.canvasReducer.camCanvases);
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  const myLayer = useSelector((state) => state.canvasReducer.myLayer);
  const pubVideoMap = useSelector((state) => state.canvasReducer.pubVideoMap);
  const subVideoMap = useSelector((state) => state.canvasReducer.subVideoMap);
  const localPosition = useSelector((state) => state.canvasReducer.position);

  const bgNow = useSelector((state) => state.bgReducer.bgNow);

  const pubVideoRef = useRef();
  const pubCanvasRef = useRef();

  const subVideoRefs = useRef({});
  const subCanvasRefs = useRef({});
  const localVideoMap = {};
  const [delay, setDelay] = useState(true);

  function startTake() {
    if (pickedFrame.id === 0) return;
    sendPosition(position);
    setFrame(pickedFrame);
    gotoTakePic();
  }
  startTake = checkHost(startTake, user.isHost);

  const onResults = (results) => {
    drawMask(bgRemovedRef.current, bgRemovedContextRef.current, results);
    // console.log(pubVideoMap)
    chromaKey(pubVideoMap.canvasRef, pubVideoMap.canvasContextRef, pubVideoMap.vidRef);

    // console.log(subVideoMap);
    for (let key in subVideoMap) {
      chromaKey(subVideoMap[key].canvasRef, subVideoMap[key].canvasContextRef, subVideoMap[key].vidRef);
    }

    // console.log(localPosition)

    // TODO : 캔버스에 그리기
    if (mainCanvas.canvas){
      // console.log(localPosition);
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

  async function getBgList(pageNum, pageSize) {
    try {
      let res = await itemApi.getBgList(pageNum, pageSize);
      if (res.status === 200) {
        setBgList(res.data.data.backgrounds);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getFrameList() {
    try {
      let res = await itemApi.getFrameList();
      if (res.status === 200) {
        setFrameList(res.data.data.frames);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    AppStore.setRunningSpinner();
    console.log(user);
    async function userJoin(initialState, ref){
      let res = await userApi.getUser();
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
  // checkUser();
     getFrameList();

    // TODO : bgImg를 Redux에서 관리
    const bgImg = new Image();
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

    userJoin(userConfig,  bgRemovedRef.current.captureStream(30).getVideoTracks()[0])
     // joinSession(user.userNickname, bgRemovedRef.current.captureStream(30).getVideoTracks()[0]);
    getBgList(1, 10);


  }, []);

  useEffect(() => {
    // console.log(subscribers);
    // console.log(subVideoRefs);
    // console.log(subCanvasRefs);
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


  useEffect(() => {
    if (publisher){
      AppStore.setStopSpinner();
      setDelay(false);
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


  useEffect(() => {
    dispatch(updatePositionAction(position));
  }, [position]);

  const preventClose = (e) => {
    e.preventDefault();
    e.returnValue = ""; //Chrome에서 동작하도록; deprecated
  };


  return (
    <>
      <video autoPlay ref={webcamRef} className="collapse absolute" />
      <canvas ref={bgRemovedRef}  width={1280} height={720} className="collapse absolute" />

      <video ref={pubVideoRef} className="collapse absolute" ></video>
      <canvas ref={pubCanvasRef}  width={1280} height={720} className="collapse absolute" />
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
              sendBlob={sendBlob}
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
          {now === "FINISH" && <Finish mozzi={mozzi}/>}
        </>
      )}
    </>
  );
}

export default Booth;
