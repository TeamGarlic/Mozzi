import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetCamCanvasesAction,
  setMyLayerSourceAction, updatePubVideoMapAction, updateSubVideoMapAction,
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
import useUser from "@/hooks/useUser";
import { checkHost } from "@/utils/DecoratorUtil.js";
import itemApi from "@/api/itemApi.js";
import {usePreventGoBack} from "@/hooks/usePreventGoBack.js";

function Booth() {
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  // console.log(sessionID);
  const location = useLocation();
  const { user, checkUser } = useUser({
    isHost: location.state ? location.state.isHost : 1,
  });
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

  const bgNow = useSelector((state) => state.bgReducer.bgNow);

  const pubVideoRef = useRef();
  const pubCanvasRef = useRef();

  const subVideoRefs = useRef({});
  const subCanvasRefs = useRef({});
  const localVideoMap = {};

  function startTake() {
    if (pickedFrame.id === 0) return;
    dispatch(resetCamCanvasesAction());
    gotoTakePic();
  }
  startTake = checkHost(startTake, user.isHost);

  const onResults = (results) => {
    drawMask(bgRemovedRef.current, bgRemovedContextRef.current, results);
    // console.log(pubVideoMap)
    chromaKey(pubVideoMap.canvasRef, pubVideoMap.canvasContextRef, pubVideoMap.vidRef);

    // console.log(videoMap);
    // for (var key in videoMap) {
    //   drawSubscriber(
    //     videoMap[key].canvasRef,
    //     videoMap[key].canvasContextRef,
    //     "vidRef" in videoMap[key] ? videoMap[key].vidRef : webcamRef.current,
    //     videoMap[key].maskRef
    //   );
    // }

    // // 내 웹캠을 담을 canvas (화면에 표시 x)
    // drawMyVid(
    //   bgRemovedRef,
    //   bgRemovedContextRef,
    //   results,
    // );

    // camCanvases.forEach((e) => {
    //   drawMyVid(e.canvas, e.context, results);
    // });

    // TODO : 한 레이어만 그리는 샘플 코드 지우기
    if (mainCanvas.canvas)
      drawCanvas(mainCanvas.canvas, mainCanvas.context, bgNow.img, [myLayer]);

    // TODO : 캔버스에 그리기
    // drawCanvas(canvasRef,canvasContextRef,bgImg,layers);
  };

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
    checkUser();
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
      modelSelection: 1,
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
    dispatch(
      setMyLayerSourceAction({
        canvas: bgRemovedRef,
      })
    );
    joinSession(user.userNickname, bgRemovedRef);
    getBgList(1, 10);

    (() => {
      window.addEventListener("beforeunload", preventClose);
    })();

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };

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
  }, [subscribers]);


  useEffect(() => {
    console.log(publisher)
    if (publisher){
      publisher.addVideoElement(pubVideoRef.current);
      dispatch(updatePubVideoMapAction({
        vidRef:pubVideoRef.current,
        canvasRef:pubCanvasRef.current,
        canvasContextRef:pubCanvasRef.current.getContext("2d", { willReadFrequently: true }),
      }));
    }
  }, [publisher]);

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
        />
      )}
      {now === "MODIFING" && (
        <AfterTake goNext={gotoFinish} user={user} />
      )}
      {now === "FINISH" && <Finish />}
    </>
  );
}

export default Booth;
