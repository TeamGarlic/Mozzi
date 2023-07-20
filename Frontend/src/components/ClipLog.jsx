import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {AddClipAction, Clip2FrameAction, DragStartAction, DragClearAction, DragEndAction } from "@/modules/clipAction"


function ClipLog(){
  const clipNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const clipList = useSelector(state => state.clipReducer.clipList);
  const drag = useSelector(state => state.clipReducer.drag);
  const dispatch = useDispatch();

  // clip 추가를 위한 연습용 이벤트
  const [idx, setIdx] = useState(3);
  function addVideo(event){
    dispatch(AddClipAction({idx: idx, src: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"}))
    setIdx(idx+1)
  }
  // clip 추가를 위한 연습용 이벤트

  function clickVideo(event){
    console.log("click")
    dispatch(Clip2FrameAction({
      clipIdx: event.target.id[4],
      src: event.target.src,
      frameIdx: 0
    }))
  }

  function onDragStart(event){
    dispatch(DragStartAction({start:event.target.id.slice(0, 4), startIdx:event.target.id[4]}));
  };

  function onDragEnd(event){
    if (drag['end'] === 'frame'){
      dispatch(Clip2FrameAction({
        clipIdx: drag['startIdx'],
        src: event.target.src,
        frameIdx: drag['endIdx']
      }))
    }
    dispatch(DragClearAction());
  }

  function onDragOver(event){
    event.preventDefault();
  }

  function onDragEnter(event){
    event.preventDefault();
  }

  function onDrop(event){
    dispatch(DragEndAction({end:event.target.id.slice(0, 4)}));
  }

  return (
    <>
      <span onClick={addVideo} className="text-3xl">Select</span>
      <div className=" overflow-y-scroll scrollbar-hide h-[calc(100%-2.5rem)]"
        onDragOver={onDragOver}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
        id="clip"
        >
        <div className=" flex flex-wrap w-full p-8 overflow-y-scroll scrollbar-hide items-center text-center gap-4">
          {clipNum.map((i) => {
            if (clipList[i]){
              return (
                <div key={`clip${i}`} className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                  <video draggable id={`clip${i}`} src={clipList[i]}
                    onClick={clickVideo}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                  ></video>
                </div>
              )
            }
          })}
        </div>
      </div>
    </>
  )
}

export default ClipLog;