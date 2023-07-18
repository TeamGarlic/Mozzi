import {useEffect, useRef, useState} from "react";
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import {Rnd} from "react-rnd";

function BigCam() {
  const W = 880, H = 495;
  // 영상 위치 조절 컴포넌트
  const rndRef = useRef();
  // 소스 웹캠 video
  const webcamRef = useRef();
  // 배경 제거된 영상 그리는 canvas, context, layer 정보
  const bgremoveRef = useRef();
  const bgremoveContextRef = useRef();
  const bgremoveLayer = {
    image : null,
    dx:0,
    dy:0,
    w:0.5,
    h:0.5
  }

  const bgImg = new Image();

  const canvasRef = useRef();
  const canvasContextRef = useRef();

  // 캔버스에 그릴 레이어들
  const layers = [bgremoveLayer];

  // 로컬 웹캠에서 누끼딴거 캔버스에 그리는 함수
  function drawMyVid(canvas, context, result){
    context.current.save();
    context.current.clearRect(
        0,
        0,
        canvas.current.width,
        canvas.current.height
    );
    context.current.drawImage(
        result.segmentationMask,
        0,
        0,
        canvas.current.width,
        canvas.current.height
    );
    // Only overwrite existing pixels.
    context.current.globalCompositeOperation = 'source-out';
    context.current.fillStyle = '#00FF00';
    context.current.fillRect(
        0,
        0,
        canvas.current.width,
        canvas.current.height
    );
    // Only overwrite missing pixels.
    context.current.globalCompositeOperation = 'source-out';
    context.current.drawImage(
        result.image,
        0,
        0,
        canvas.current.width,
        canvas.current.height
    );
    context.current.restore();
  }
  // 합성 캔버스에 그리는 함수
  function drawCanvas(canvas, context){
    context.current.save();
    // TODO : 배경사진 변경 기능 추가
    context.current.drawImage(
        bgImg,
        0,
        0,
        canvas.current.width,
        canvas.current.height
    );
    context.current.globalCompositeOperation = 'source-over';
    layers.forEach(item=>{
      context.current.drawImage(
          item.image,
          canvas.current.width*item.dx,
          canvas.current.height*item.dy,
          canvas.current.width*item.w,
          canvas.current.height*item.h
      );
    })
    context.current.restore();
  }

  // 로컬 웹캠의 한 프레임이 처리될 때 마다 실행되는 함수들
  const onResults = (results) => {
    // 내 웹캠을 담을 canvas (화면에 표시 x)
    drawMyVid(bgremoveRef,bgremoveContextRef,results);
    drawCanvas(canvasRef,canvasContextRef);
  };

  const moveWebcam = () =>{
    bgremoveLayer.dx = (rndRef.current.draggable.state.x - canvasRef.current.offsetLeft)/W
    bgremoveLayer.dy = (rndRef.current.draggable.state.y - canvasRef.current.offsetTop)/H
  }

  const resizeWebcam = () =>{
    bgremoveLayer.dx = (rndRef.current.draggable.state.x - canvasRef.current.offsetLeft)/W
    bgremoveLayer.dy = (rndRef.current.draggable.state.y - canvasRef.current.offsetTop)/H
    bgremoveLayer.w = rndRef.current.resizable.state.width/W;
    bgremoveLayer.h = rndRef.current.resizable.state.height/H;
  }

  useEffect(() => {
    // TODO : bgImg 리스트에서 선택
    bgImg.src = "https://picsum.photos/880/495";
    bgremoveContextRef.current = bgremoveRef.current.getContext('2d');
    canvasContextRef.current = canvasRef.current.getContext('2d');
    bgremoveLayer.image = bgremoveRef.current;
    const constraints = {
      video: { width: { max: 640 }, height: { max: 480 } },
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
  }, []);

  return (
    <div
      className="bg-slate-300 m-auto my-10"
      style={{ width: "880px", height: "495px" }}
    >
      <canvas ref={canvasRef} width="1920" height="1080" style={{"width" : `${W}px`, "height" : `${H}px`}}></canvas>
      <Rnd
          onDrag={moveWebcam}
          onResize={resizeWebcam}
          default={{
            x: 0,
            y: 0,
            width: W/2,
            height: H/2,
          }}
          minWidth={W/10}
          minHeight={H/10}
          ref={rndRef}
          bounds="parent"
      >
        <div className={"w-full h-full"} style={{'border':'dashed 1px white'}}></div>
      </Rnd>
      <video autoPlay ref={webcamRef} style={{"display":"none"}}/>
      <canvas ref={bgremoveRef} style={{"display":"none"}}/>
    </div>
  );
}

export default BigCam;
