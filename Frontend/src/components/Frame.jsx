import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Frame2ClipAction,
  DragEndAction,
  DragStartAction,
  Frame2FrameAction,
} from "@/modules/clipAction";
import PropTypes from "prop-types";
import {checkHost} from "@/utils/DecoratorUtil.js";

function Frame({user, updateMozzi, setPlayTogether, setAlertModal}) {
  const frame = useSelector((state) => state.clipReducer.frame);
  const dispatch = useDispatch();
  const drag = useSelector((state) => state.clipReducer.drag);
  const imgRef = useRef();
  const frameRef = useRef({});
  const frameNum = Array.from({length: frame['n']}, (v, i) => i+1);
  const videoRef = useRef({});


  useEffect(() => {
    UpdateMozzi(frame)
    frameNum.forEach((i) => {
      frameRef.current[i].style.height = `${imgRef.current.height*frame[i]['height']}px`;
      frameRef.current[i].style.width = `${imgRef.current.width*frame[i]['width']}px`;
      frameRef.current[i].style.top = `${frame[i]['y']*imgRef.current.height}px`;
      frameRef.current[i].style.left = `${frame[i]['x']*imgRef.current.width}px`;
    })
    setPlayTogether(()=>{
      frameNum.forEach((i) => {
        if (videoRef.current[i]){
          videoRef.current[i].load();
        }
      })
    });
  }, [frame])

  function UpdateMozzi(){
    updateMozzi(frame)
  }
  UpdateMozzi = checkHost(UpdateMozzi, user.isHost, ()=>{})

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

  function onDragEnd() {
    if (drag["end"] === "clip") {
      dispatch(
        Frame2ClipAction({
          frameIdx: drag["startIdx"],
        })
      );
    } else if (drag["end"] === "frame") {
      dispatch(Frame2FrameAction());
    }
  }

  function onDrop(event) {
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


  clickVideo = checkHost(clickVideo, user.isHost, setAlertModal);
  onDragStart = checkHost(onDragStart, user.isHost, setAlertModal);
  onDragEnd = checkHost(onDragEnd, user.isHost, setAlertModal);
  onDrop = checkHost(onDrop, user.isHost, setAlertModal);
  onDragOver = checkHost(onDragOver, user.isHost, setAlertModal);
  onDragEnter = checkHost(onDragEnter, user.isHost, setAlertModal);


  return (
    <div>
      <div className="relative m-2">
        <img src={frame.src} alt="frame" ref={imgRef} crossOrigin="anonymous"></img>
        {frameNum.map((i) => {
          if (frame[i]["src"]) {
            return (
              <div key={`frame${i}`} className="absolute z-10" ref={(el) => frameRef.current[i] = el}>
                <video
                  autoPlay
                  ref={(el) => videoRef.current[i] = el}
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
              className="absolute z-10"
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


Frame.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  updateMozzi: PropTypes.func,
  setPlayTogether: PropTypes.func,
  setAlertModal: PropTypes.func,
};
