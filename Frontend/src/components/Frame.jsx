import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Frame2ClipAction,
  DragEndAction,
  DragStartAction,
  Frame2FrameAction,
} from "@/modules/clipAction";
import frame1 from "@/assets/img/frame1.png"

function Frame() {
  const [frameNum] = useState([1, 2, 3, 4]);
  const frame = useSelector((state) => state.clipReducer.frame);
  const dispatch = useDispatch();
  const drag = useSelector((state) => state.clipReducer.drag);

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
        <img src={frame1} alt="frame"></img>
        {frameNum.map((i) => {
          const frameStyle = {
            height: "160px",
            width: "250px",
            top:`${frame[i]['top']}px`,
            left:`${frame[i]['left']}px`
          }
          if (frame[i]["src"]) {
            return (
              <div key={`frame${i}`} style={frameStyle} className="absolute z-50">
                <video
                  src={frame[i]["src"]}
                  width="250"
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
              style={frameStyle}
              className="absolute z-50"
              onDragOver={onDragOver}
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              id={`frame${i}`}
            ></div>
          );
        })}
      </div>
    </div>
  );
}

export default Frame;
