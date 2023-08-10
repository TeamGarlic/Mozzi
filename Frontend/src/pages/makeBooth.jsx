import Layout from "../components/Layout";
import UserSideBar from "../components/UserSideBar";
import EnterDialog from "@/components/EnterDialog";
import PropTypes from "prop-types";
import { useState } from "react";
import {useDispatch, useSelector} from "react-redux";
import {setFrameAction} from "@/modules/clipAction.js";
import {checkHost} from "@/utils/DecoratorUtil.js";

function MakeBooth({ startTake, shareCode, leaveSession, setFrame, frameList, user }) {
  const [visibility, setVisibility] = useState(true);
  const [toggleVoice, setToggleVoice] = useState(true);
  const pickedFrame = useSelector((state) => state.clipReducer.frame);

  const dispatch = useDispatch();
  const closeDialog = () => {
    setVisibility(false);
  };
  function setVoice() {
    setToggleVoice(!toggleVoice);
  }
  function copyCode() {
    navigator.clipboard.writeText(shareCode).then(() => {
      alert("복사되었습니다.");
    });
  }

  function clickFrame(event, frame){
    const res = {
      id: frame.id,
      title: frame.title,
      n: frame.rects.length,
      src: `https://api.mozzi.lol/files/object/${frame.objectName}`,
    }
    for (let i = 0; i < frame.rects.length; i++) {
      res[i + 1] = {
        clipIdx: 0,
        src: "",
        ...frame.rects[i]
      };
    }
    dispatch(setFrameAction(res));
    setFrame(res);
  }
  clickFrame = checkHost(clickFrame, user.isHost);

  return (
    <>
      {/*<EnterDialog*/}
      {/*  visibility={visibility}*/}
      {/*  onClick={closeDialog}*/}
      {/*  toggleVoice={toggleVoice}*/}
      {/*  setVoice={setVoice}*/}
      {/*/>*/}
      <Layout>
        <div className="flex">
          <div className="w-full h-screen p-4 flex-col">
            <div>
              <div className=" text-sm text-gray-500 flex">
                <span>초대 코드 : {shareCode}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                  onClick={copyCode}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="text-2xl">MOZZI</div>
            </div>
            <div className=" text-2xl p-4">프레임 선택</div>
            <div className="gap-6 p-4 mr-[calc(17rem)]  overflow-x-scroll scrollbar-thumb-gray-900 scrollbar-track-gray-100">
              <div className=" inline-flex flex-nowrap h-[calc(25rem)]  items-center gap-4 p-4">
                {frameList.map((frame) => (
                    <div onClick={(e)=>clickFrame(e, frame)} key={frame.id} className={`border-8 ${pickedFrame.id === frame.id ? "border-blue-500" : ""}`}>
                      <img src={`https://api.mozzi.lol/files/object/${frame.objectName}`} alt={frame.objectName} className={"max-w-[calc(50rem)] max-h-[calc(22.75rem)]"}></img>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="w-full pt-20">
              <button
                onClick={startTake}
                className=" block relative mx-auto w-fit bg-yellow-400 p-3 rounded-3xl text-slate-600"
              >
                촬영 시작
              </button>
            </div>
          </div>
          <UserSideBar
            user={user}
            leaveSession={leaveSession}
          />
        </div>
      </Layout>
    </>
  );
}

export default MakeBooth;

MakeBooth.propTypes = {
  startTake: PropTypes.func,
  shareCode: PropTypes.string,
  leaveSession: PropTypes.func,
  gotoTakePic : PropTypes.func,
  frameList: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  setFrame: PropTypes.func,
};
