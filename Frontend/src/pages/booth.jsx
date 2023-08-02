import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetCamCanvasesAction,
  setMyLayerSourceAction,
} from "@/modules/canvasAction.js";
import MakeBooth from "./makeBooth";
import TakePic from "./takePic";
import { useParams, useLocation } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { drawCanvas, drawMask } from '@/utils/videoUtil.js';
import useSession from "@/hooks/useSession.js";
import { changeBgAction } from "@/modules/bgAction.js";
import useUser from "@/hooks/useUser";
import {checkHost} from "@/utils/DecoratorUtil.js";

function Booth() {
  const [taking, setTaking] = useState(false);
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  // console.log(sessionID);
  const location = useLocation();
  const { user, checkUser } = useUser({isHost: location.state?location.state.isHost:0});

  const {
    mainSession,
    maskSession,
    subscribers,
    joinSession,
    sendMessage,
    chatLists,
    mainPublisher,
  } = useSession(user, shareCode);

  // 소스 웹캠 video
  const webcamRef = useRef();
  // 배경 제거된 영상 그리는 canvas, context, layer 정보
  const bgRemovedRef = useRef();
  // 배경 마스크 그리는 canvas, context, layer 정보
  const bgMaskRef = useRef();
  const bgMaskContextRef = useRef();

  const camCanvases = useSelector((state) => state.canvasReducer.camCanvases);
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  const myLayer = useSelector((state) => state.canvasReducer.myLayer);
  // TODO : bgImg를 Redux에서 관리
  const bgNow = useSelector((state) => state.bgReducer.bgNow);
  const subCanvasRefs = useRef();

  function startTake() {
    dispatch(resetCamCanvasesAction());
    setTaking(true);
  }
  startTake = checkHost(startTake, user.isHost);

  const onResults = (results) => {
    drawMask(bgMaskRef, bgMaskContextRef, results)

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

  useEffect(() => {
    checkUser();
    // TODO : bgImg를 Redux에서 관리
    const bgImg = new Image();
    bgImg.src = "/src/assets/img/bg1.jpg";
    bgImg.crossOrigin = "anonymous";
    dispatch(changeBgAction({ img: bgImg }));

    bgMaskContextRef.current = bgMaskRef.current.getContext("2d");
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
    joinSession([bgRemovedRef, bgMaskRef]);
  }, []);

  useEffect(() => {
    console.log(subscribers);
  }, [subscribers]);

  return (
    <>
      {!taking ? (
        <MakeBooth
          startTake={startTake}
          shareCode={shareCode}
          subscribers={subscribers}
          mainPublisher={mainPublisher}
        />
      ) : (
        <TakePic
          shareCode={shareCode}
          sendMessage={sendMessage}
          chatLists={chatLists}
          user={user}
        />
      )}
      <video autoPlay ref={webcamRef} className="hidden" />
      <canvas ref={bgMaskRef} className="hidden" />
    {/*  {subscribers&&*/}
    {/*  subscribers.map((sub) => {*/}
    {/*    return (*/}
    {/*      <video key={JSON.parse(sub.stream.connection.data).uid} ref={(elem) =>*/}
    {/*        subCanvasRefs.current[JSON.parse(sub.stream.connection.data).uid] = elem}></video>*/}
    {/*    )*/}
    {/*  })*/}
    {/*}*/}
    </>
  );
}

export default Booth;
