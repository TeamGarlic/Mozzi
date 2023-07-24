import { useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { addCamCanvasAction } from '@/modules/canvasAction.js';
function SmallCam() {
  const camCanvasRef = useRef();
  const camCanvasContextRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    camCanvasContextRef.current = camCanvasRef.current.getContext('2d');
    dispatch(
      addCamCanvasAction({
        canvas : camCanvasRef,
        context : camCanvasContextRef,
      })
    );
  }, []);

  return (
    <div
      className="bg-slate-300 m-auto my-10"
      style={{ width: "176px", height: "99px" }}
    >
      <canvas autoPlay ref={camCanvasRef} className={"h-full w-full"} />
    </div>
  );
}

export default SmallCam;
