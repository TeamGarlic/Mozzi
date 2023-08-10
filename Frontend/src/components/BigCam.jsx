import {useEffect, useRef} from "react";
import { useDispatch } from 'react-redux';
import {Rnd} from "react-rnd";
import {
  resizeLayerAction,
  setMainCanvasAction,
} from '@/modules/canvasAction.js';
import PropTypes from 'prop-types';

export default function BigCam({myId, updatePosition, setPosition}) {
  const W = 1440, H = 960, ratio = 1080/1440;
  const rndRef = useRef();
  const dispatch = useDispatch();

  const canvasRef = useRef();
  const canvasContextRef = useRef();


  const updateLocalPos = (npos) =>{
    setPosition((prev)=>{
      const newPosition = [];
      for(let pos of prev){
        newPosition.push((pos.id===myId)?npos:pos);
      }
      return newPosition;
    });
    updatePosition(npos);
  }

  const updateSize = () =>{
    console.log(myId);
    const npos= {
      id : myId,
      x : (rndRef.current.draggable.state.x - canvasRef.current.offsetLeft)/(ratio*W),
      y : (rndRef.current.draggable.state.y - canvasRef.current.offsetTop)/(ratio*H),
      width : rndRef.current.resizable.state.width/(ratio*W),
      height : rndRef.current.resizable.state.height/(ratio*H),
    };
    dispatch(resizeLayerAction(npos));
    updateLocalPos(npos);
    updatePosition(npos);
  }

  useEffect(() => {
    canvasContextRef.current = canvasRef.current.getContext('2d');
    dispatch(setMainCanvasAction({
      canvas:canvasRef,
      context:canvasContextRef,
    }));
  }, []);

  return (
    <div
      className="bg-slate-300 m-auto my-10"
      style={{"width" : `${W*ratio}px`, "height" : `${H*ratio}px`}}
    >
      <canvas ref={canvasRef} width={W} height={H} style={{"width" : `${W*ratio}px`, "height" : `${H*ratio}px`}}></canvas>
      <Rnd
          onDrag={updateSize}
          onResize={updateSize}
          default={{
            x: 0,
            y: 0,
            width: W*ratio*0.4,
            height: H*ratio*0.4,
          }}
          minWidth={W*ratio/15}
          minHeight={H*ratio/15}
          ref={rndRef}
          // bounds="parent"
          className={"w-full h-full"} style={{'border':'dashed 1px white'}}
      >
      </Rnd>
    </div>
  );
}

BigCam.propTypes = {
  myId: PropTypes.string,
  updatePosition: PropTypes.func,
  setPosition: PropTypes.func,
};
