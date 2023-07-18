import { useEffect, useRef } from "react";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

function SmallCam() {
  const webcamRef = useRef();
  const bgremoveRef = useRef();
  const bgremoveContextRef = useRef();
  function drawMyVid(canvas, context, result) {
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
    context.current.globalCompositeOperation = "source-out";
    // context.current.fillStyle = '#000000';
    context.current.fillRect(0, 0, canvas.current.width, canvas.current.height);
    // Only overwrite missing pixels.
    context.current.globalCompositeOperation = "source-out";
    context.current.drawImage(
      result.image,
      0,
      0,
      canvas.current.width,
      canvas.current.height
    );
    context.current.restore();
  }

  const onResults = (results) => {
    drawMyVid(bgremoveRef, bgremoveContextRef, results);
  };

  useEffect(() => {
    console.log(bgremoveRef.current);
    bgremoveContextRef.current = bgremoveRef.current.getContext("2d");
    const constraints = {
      video: { width: { max: 480 }, height: { max: 480 } },
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
        console.log(webcamRef.current.videoWidth);
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: webcamRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
    };
  }, []);

  return (
    <div
      className="bg-slate-300 mx-auto my-10"
      style={{ width: "192px", height: "108px" }}
    >
      {/* <span className="z-10">name</span> */}
      <video autoPlay ref={webcamRef} style={{ display: "none" }} />
      <canvas
        // autoPlay
        ref={bgremoveRef}
        width="1920"
        height="1080"
        className={"h-full w-full"}
      />
    </div>
  );
}

export default SmallCam;
