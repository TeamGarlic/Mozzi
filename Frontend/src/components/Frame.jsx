import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Frame2ClipAction,
  DragEndAction,
  DragStartAction,
  Frame2FrameAction,
} from "@/modules/clipAction";
import frame1 from "@/assets/img/frame6.jpg"

function Frame() {
  const frame = useSelector((state) => state.clipReducer.frame);
  const dispatch = useDispatch();
  const drag = useSelector((state) => state.clipReducer.drag);
  const imgRef = useRef();
  const frameRef = useRef({});
  const frameNum = Array.from({length: frame['n']}, (v, i) => i+1);


  useEffect(() => {
    frameNum.forEach((i) => {
      frameRef.current[i].style.height = `${imgRef.current.height*frame[i]['height']}px`;
      frameRef.current[i].style.width = `${imgRef.current.width*frame[i]['width']}px`;
      frameRef.current[i].style.top = `${frame[i]['y']*imgRef.current.height}px`;
      frameRef.current[i].style.left = `${frame[i]['x']*imgRef.current.width}px`;
    })
  }, [frame])

  function clickVideo(event) {
    dispatch(
      Frame2ClipAction({ frameIdx: event.target.id[5], src: event.target.src })
    );
  }

  function onDragStart(event) {
    dispatch(
      DragStartAction({
        start: event.target.id.slice(0, 5),
        startIdx: event.target.id[5],
      })
    );
  }

  function onDragEnd(event) {
    if (drag["end"] === "clip") {
      dispatch(
        Frame2ClipAction({
          frameIdx: drag["startIdx"],
        })
      );
    } else if (drag["end"] === "frame") {
      dispatch(Frame2FrameAction());
      console.log(event);
    }
  }

  function onDrop(event) {
    console.log(event.target.id.slice(0, 5));
    dispatch(
      DragEndAction({
        end: event.target.id.slice(0, 5),
        endIdx: event.target.id[5],
      })
    );
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  function onDragEnter(event) {
    event.preventDefault();
  }

  return (
    <div>
      <div className="relative">
        <img src={frame1} alt="frame" ref={imgRef}></img>
        {frameNum.map((i) => {
          if (frame[i]["src"]) {
            return (
              <div key={`frame${i}`} className="absolute z-50" ref={(el) => frameRef.current[i] = el}>
                <video
                  src={frame[i]["src"]}
                  onClick={clickVideo}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragEnter={onDragEnter}
                  draggable
                  id={`frame${i}`}
                ></video>
              </div>
            );
          }
          return (
            <div
              key={`frame${i}`}
              className="absolute z-50"
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              id={`frame${i}`}
              ref={(el) => frameRef.current[i] = el}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default Frame;
