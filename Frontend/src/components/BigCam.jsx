import {useEffect, useRef} from "react";
import { useDispatch } from 'react-redux';
import {Rnd} from "react-rnd";
import {
  resizeMyLayerAction,
  setMainCanvasAction,
  setMyLayerAction,
} from '@/modules/canvasAction.js';

function BigCam() {
  const W = 1024, H = 560;
  // 영상 위치 조절 컴포넌트
  const rndRef = useRef();
  const dispatch = useDispatch();

  const canvasRef = useRef();
  const canvasContextRef = useRef();

  const updateSize = () =>{
    dispatch(resizeMyLayerAction({
      x : (rndRef.current.draggable.state.x - canvasRef.current.offsetLeft)/W,
      y : (rndRef.current.draggable.state.y - canvasRef.current.offsetTop)/H,
      width : rndRef.current.resizable.state.width/W,
      height : rndRef.current.resizable.state.height/H,
    }));
  }

  useEffect(() => {
    canvasContextRef.current = canvasRef.current.getContext('2d');
    dispatch(setMainCanvasAction({
      canvas:canvasRef,
      context:canvasContextRef,
    }));
    dispatch(setMyLayerAction({
      x:0,
      y: 0,
      width: 0.5,
      height: 0.5,
    }))
  }, []);

  return (
    <div
      className="bg-slate-300 m-auto my-10"
      style={{"width" : `${W}px`, "height" : `${H}px`}}
    >
      <canvas ref={canvasRef} width="1920" height="1080" style={{"width" : `${W}px`, "height" : `${H}px`}}></canvas>
      <Rnd
          onDrag={updateSize}
          onResize={updateSize}
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
          className={"w-full h-full"} style={{'border':'dashed 1px white'}}
      >
      </Rnd>
    </div>
  );
}

export default BigCam;
