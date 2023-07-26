import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  resetCamCanvasesAction,
  setCamStreamAction,
  setMaskStreamAction,
} from '@/modules/canvasAction.js';
import MakeBooth from './makeBooth';
import TakePic from './takePic';
import { useParams } from 'react-router-dom';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { drawCanvas, drawMyVid } from '@/utils/videoUtil.js';

function Booth() {
  const [taking, setTaking] = useState(false);
  const { code: sessionID } = useParams();
  const dispatch = useDispatch();
  console.log(sessionID);

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
  const bgImg = new Image();

  function startTake() {
    dispatch(resetCamCanvasesAction());
    console.log('take!');
    setTaking(true);
  }


  // 로컬 웹캠의 한 프레임이 처리될 때 마다 실행되는 함수들
  const onResults = (results) => {
    // 내 웹캠을 담을 canvas (화면에 표시 x)
    drawMyVid(bgRemovedRef, bgRemovedContextRef, results, bgMaskRef, bgMaskContextRef);
    // console.log(camCanvases)
    camCanvases.forEach((e) => {
      drawMyVid(e.canvas, e.context, results);
    });

    // TODO : 한 레이어만 그리는 샘플 코드 지우기
    // console.log(mainCanvas.canvas)
    // console.log(myLayer);
    if(mainCanvas.canvas) drawCanvas(mainCanvas.canvas,mainCanvas.context,bgImg,[myLayer]);

    // TODO : 캔버스에 그리기
    // drawCanvas(canvasRef,canvasContextRef,bgImg,layers);
  };


  useEffect(() => {
    // TODO : bgImg를 Redux에서 관리
    bgImg.src = 'https://picsum.photos/880/495';
    bgImg.crossOrigin = "anonymous"

    bgRemovedContextRef.current = bgRemovedRef.current.getContext('2d');
    bgMaskContextRef.current = bgMaskRef.current.getContext('2d');
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
      setCamStreamAction({
        canvas:bgRemovedRef,
        stream:bgRemovedRef.current.captureStream(30).getVideoTracks()[0],
      })
    );
    dispatch(
      setMaskStreamAction({
        canvas:bgMaskRef,
        stream:bgMaskRef.current.captureStream(30).getVideoTracks()[0],
      })
    );

  }, []);


  return (
    <>
      {!taking ? <MakeBooth startTake={startTake} /> : <TakePic />}
      <video autoPlay ref={webcamRef} className='hidden' />
      <canvas ref={bgRemovedRef} className='hidden' />
      <canvas ref={bgMaskRef} className='hidden' />
    </>
  );
}

export default Booth;
