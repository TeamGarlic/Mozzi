import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AddClipAction,
  Clip2FrameAction,
  DragStartAction,
  DragClearAction,
  DragEndAction,
} from "@/modules/clipAction";
import PropTypes from "prop-types";
import {checkHost} from "@/utils/DecoratorUtil.js";

function ClipLog({user, setAlertModal}) {
  const clipList = useSelector((state) => state.clipReducer.clipList);
  const drag = useSelector((state) => state.clipReducer.drag);
  const dispatch = useDispatch();
  const clipNum = Array.from({length: clipList['n']}, (v, i) => i+1);
  const [idx, setIdx] = useState(0);
  const frame = useSelector((state) => state.clipReducer.frame);

  function clickVideo(event) {
    dispatch(
      Clip2FrameAction({
        clipIdx: event.target.id[4],
        src: event.target.src,
        frameIdx: 0,
      })
    );
  }

  function onDragStart(event) {
    dispatch(
      DragStartAction({
        start: event.target.id.slice(0, 4),
        startIdx: event.target.id[4],
      })
    );
  }

  function onDragEnd(event) {
    if (drag["end"] === "frame") {
      dispatch(
        Clip2FrameAction({
          clipIdx: drag["startIdx"],
          src: event.target.src,
          frameIdx: drag["endIdx"],
        })
      );
    }
    dispatch(DragClearAction());
  }

  function onDragOver(event) {
    event.preventDefault();
  }

  function onDragEnter(event) {
    event.preventDefault();
  }

  function onDrop(event) {
    dispatch(DragEndAction({ end: event.target.id.slice(0, 4) }));
  }

  clickVideo = checkHost(clickVideo, user.isHost, setAlertModal);
  onDragStart = checkHost(onDragStart, user.isHost, setAlertModal);
  onDragEnd = checkHost(onDragEnd, user.isHost, setAlertModal);
  onDragOver = checkHost(onDragOver, user.isHost, setAlertModal);
  onDragEnter = checkHost(onDragEnter, user.isHost, setAlertModal);
  onDrop = checkHost(onDrop, user.isHost, setAlertModal);

  return (
    <>
      <span className="text-3xl">
        클립을 클릭해 프레임에 추가하세요
      </span>
      <div
        className=" overflow-y-scroll scrollbar-hide h-[calc(100%-2.5rem)]"
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        id="clip"
      >
        <div className=" flex flex-wrap w-full p-8 overflow-y-scroll scrollbar-hide items-center text-center gap-4">
          {clipNum.map((i) => {
            if (clipList[i]) {
              return (
                <div
                  key={`clip${i}`}
                  className=" w-96 h-[calc(16rem)] bg-slate-300 mx-auto border border-blue-900 rounded-2xl"
                >
                  <video
                    draggable
                    id={`clip${i}`}
                    src={clipList[i]}
                    onClick={clickVideo}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    className="rounded-2xl"
                  ></video>
                </div>
              );
            }
          })}
        </div>
      </div>
    </>
  );
}

export default ClipLog;

ClipLog.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
    setAlertModal: PropTypes.func,
  }),
};
