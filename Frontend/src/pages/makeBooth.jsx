import Layout from "@/components/Layout";
import UserSideBar from "@/components/UserSideBar";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFrameAction } from "@/modules/clipAction.js";
import { checkHost } from "@/utils/DecoratorUtil.js";
import ScriptModal from "@/components/ScriptModal.jsx";
import baseURL from "@/api/BaseURL.js";

function MakeBooth({ startTake, shareCode, leaveSession, setFrame, frameList, user, setAlertModal }) {
  const pickedFrame = useSelector((state) => state.clipReducer.frame);
  const [onScript, setOnScript] = useState(true);
  const [scriptArray] = useState([
    "왼쪽 상단의 초대코드를 복사해 친구들에게 공유하세요",
    "왼쪽 하단의 설정창에서 마이크와 카메라를 설정할 수 있어요",
    "오른쪽 하단의 채팅창에서 채팅이 가능해요",
    "방장은 프레임을 선택하고 촬영 시작 버튼을 눌러주세요"
  ]);

  const dispatch = useDispatch();

  function closeScriptModal() {
    setOnScript(false);
  }


  function copyCode() {
    navigator.clipboard.writeText(shareCode).then(() => {
      alert("복사되었습니다.");
    });
  }

  function clickFrame(event, frame) {
    const res = {
      id: frame.id,
      title: frame.title,
      n: frame.rects.length,
      src: `${baseURL}/files/object/${frame.objectName}`,
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
  clickFrame = checkHost(clickFrame, user.isHost, setAlertModal);
  function leave(){
    confirm("정말로 나가시겠습니까?")?leaveSession():"";
  }

  return (
    <>
      <Layout>
        <div className="flex">
          <div className="w-full h-screen p-4 flex-col">
            { onScript && (
              <div className="justify-center">
                <ScriptModal scriptArray={scriptArray} closeScriptModal={closeScriptModal}/>
              </div>
            )}
            <div>
              <div className="text-2xl flex text-center" onClick={copyCode}>
                <span className="text mx-1">초대 코드 : </span>
                <span className="text text-blue-500"> {shareCode}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#3b82f6"
                  className="w-6 h-6 my-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                  />
                </svg>
              </div>
              <div className="m-1 text-sm text-slate-600">프레임을 선택하고 촬영 시작 버튼을 눌러주세요</div>
            </div>
            <div className="p-4 mr-[calc(17rem)] overflow-scroll scrollbar-hide">
                <div className="flex flex-wrap w-full items-center gap-4 p-4">
                {frameList.map((frame) => (
                  <div onClick={(e) => clickFrame(e, frame)} key={frame.id} className={`border-8 ${pickedFrame.id === frame.id ? "border-blue-500" : ""}`}>
                    <img src={`${baseURL}/files/object/${frame.objectName}`} alt={frame.objectName} className={`max-w-[calc(40rem)] max-h-[calc(20rem)]`} crossOrigin="anonymous"></img>
                  </div>
                )
                )}
              </div>
            </div>
            <div className="flex justify-center items-center gap-5 fixed bottom-10 ms-[calc(25%)] w-1/2">
              <button
                  onClick={startTake}
                  className="flex justify-center items-center px-5 rounded-3xl bg-blue-300 leading-10 border border-blue-500"
              >
                촬영 시작
              </button>
              <button
                  onClick={leave}
                  className="flex justify-center items-center px-5 rounded-3xl bg-red-300 leading-10 border border-red-500"
              >
                나가기
              </button>
            </div>
          </div>
          <UserSideBar
            user={user}
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
  gotoTakePic: PropTypes.func,
  frameList: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  setFrame: PropTypes.func,
  setAlertModal: PropTypes.func,
};
