import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetCamCanvasesAction,
  setMyLayerSourceAction,
} from "@/modules/canvasAction.js";
import MakeBooth from "./makeBooth";
import TakePic from "./takePic";
import { useParams } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { drawCanvas, drawMyVid } from "@/utils/videoUtil.js";
import useSession from "@/hooks/useSession.js";
import { changeBgAction } from "@/modules/bgAction.js";
import useUser from "@/hooks/useUser";

function Booth() {
  const [taking, setTaking] = useState(false);
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  // console.log(sessionID);
  const { user, checkUser } = useUser();
  console.log(user);
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
  const bgRemovedContextRef = useRef();
  // 배경 마스크 그리는 canvas, context, layer 정보
  const bgMaskRef = useRef();
  const bgMaskContextRef = useRef();

  const camCanvases = useSelector((state) => state.canvasReducer.camCanvases);
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  const myLayer = useSelector((state) => state.canvasReducer.myLayer);
  // TODO : bgImg를 Redux에서 관리
  const bgNow = useSelector((state) => state.bgReducer.bgNow);

  // const testRef = useRef();
  // const testRef2 = useRef();
  // const testRef3 = useRef();

  function startTake() {
    dispatch(resetCamCanvasesAction());
    setTaking(true);
  }

  const onResults = (results) => {
    // 로컬 웹캠의 한 프레임이 처리될 때 마다 실행되는 함수들

    // 내 웹캠을 담을 canvas (화면에 표시 x)
    drawMyVid(
      bgRemovedRef,
      bgRemovedContextRef,
      results,
      bgMaskRef,
      bgMaskContextRef
    );
    // console.log(camCanvases)
    // TODO : camCanvases 리렌더링 안되는 오류 수정
    camCanvases.forEach((e) => {
      drawMyVid(e.canvas, e.context, results);
    });

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

    bgRemovedContextRef.current = bgRemovedRef.current.getContext("2d");
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

  // useEffect(() => {
  //   console.log(subscribers);
  //   if (subscribers.length > 0) subscribers[0].addVideoElement(testRef.current);
  //   if (subscribers.length > 1)
  //     subscribers[1].addVideoElement(testRef2.current);
  //   if (subscribers.length > 2)
  //     subscribers[2].addVideoElement(testRef3.current);
  // }, [subscribers]);

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
      <canvas ref={bgRemovedRef} className="hidden" />
      <canvas ref={bgMaskRef} className="hidden" />
      {/* <video autoPlay ref={testRef} className="" />
      <video autoPlay ref={testRef2} className="" />
      <video autoPlay ref={testRef3} className="" /> */}
    </>
  );
}

export default Booth;
