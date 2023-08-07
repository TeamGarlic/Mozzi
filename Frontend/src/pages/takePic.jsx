import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PicSideBar from "../components/PicSideBar";
import Layout from "../components/Layout";
import BigCam from "../components/BigCam";
import Chat from "@/components/Chat";
import PropTypes from "prop-types";
import MyRadioGroup from "@/components/MyRadioGroup";
import { useSelector, useDispatch } from "react-redux";
import { AddClipAction } from "@/modules/clipAction";
import { checkHost } from "@/utils/DecoratorUtil.js";

function TakePic({ shareCode, sendMessage, chatLists, user, bgList, goNext, sendBlob, timer, taken, timeChange, startTaking, finishTaking, nowTaking, changeBg }) {
  const timers = [3, 5, 10];
  const [count, setCount] = useState(3);
  const [timerVisible, setTimerVisible] = useState(false);
  var interval;
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  let mediaRecorder = null;
  const arrClipData = [];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const clipList = useSelector(state => state.clipReducer.clipList);
  function recordClip(idx) {
    const mediaStream = mainCanvas.canvas.current.captureStream();
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      arrClipData.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(arrClipData);
      const file = new File([blob], "clip.webm", {type: "video/webm"})
      const fileToBase64 = file => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise(resolve => {
          reader.onloadend = () => {
            resolve(reader.result);
          };
        });
      };
      fileToBase64(file).then(res => {
        // console.log(res);
        // sendBlob(idx, res);
        dispatch(AddClipAction({ idx, src: res }));
      });
      arrClipData.splice(0);
    };

    // 녹화 시작
    mediaRecorder.start();
    console.log("촬영시작");
    // Todo: 현재는 시간에 dependent => 프레임 단위로 전환 필요함
    setTimeout(() => {
      // 녹화 종료
      mediaRecorder.stop();
      if (taken == 4) {
        goNext();
      } else {
        finishTaking();
      }
    }, 5000);
  }
  function setTime(e) {
    timeChange(e.target.value)
  }

  function take() {
    startTaking();
    // startCount();
  }

  function startCount() {
    let isTaking = 0;
    setTimerVisible(true);
    // console.log(timer + "초 후 촬영");
    interval = setInterval(() => {
      // console.log(interval);
      setCount((prev) => {
        let next = prev - 1;
        if (isTaking === 0 && next === 0) {
          // 대기 시간 후 촬영 시작(next 초 만큼)
          next = 5;
          isTaking = 1;
          recordClip(taken);
        } else if (isTaking === 1 && next === 0) {
          clearInterval(interval);
          setTimerVisible(false);
          isTaking = 0;
          return timer;
        }
        return next;
      });
    }, 1000);
  }
  take = checkHost(take, user.isHost);
  recordClip = checkHost(recordClip, user.isHost);

  useEffect(() => {
    if (nowTaking) startCount();
  }, [nowTaking])

  useEffect(() => {
    setCount(timer);
  }, [timer]);
  return (
    <Layout>
      <>
        <Chat sendMessage={sendMessage} chatLists={chatLists} user={user} />
        <div className="w-full pt-4 ps-4">
          <div>
            <div className=" text-sm text-gray-500">
              초대 코드 : {shareCode}
            </div>
            <div className="text-2xl">MOZZI</div>
          </div>
          <PicSideBar bgList={bgList} user={user} changeBg={changeBg}/>
          {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
        </div>
        <BigCam />
        {/* <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link> */}
        <div className="flex justify-center items-center gap-20 fixed bottom-10 ms-[calc(25%)] w-1/2">
          {!timerVisible && (
            <MyRadioGroup
              arr={timers}
              name="timer"
              onChange={setTime}
              nowState={Number(timer)}
              text={"⏲️"}
            />
          )}
          <div className="flex rounded-2xl bg-yellow-200 leading-10">
            <span className=" px-5 ">{taken}/4</span>
            <button
              className={`w-full leading-10  px-5  bg-red-300 rounded-r-2xl`}
              onClick={take}
              disabled={timerVisible}
            >
              {timerVisible ? <span>{count}</span> : <span>📷</span>}
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default TakePic;

TakePic.propTypes = {
  startTake: PropTypes.func,
  shareCode: PropTypes.string,
  sendMessage: PropTypes.func,
  chatLists: PropTypes.array,
  bgList: PropTypes.array,
  goNext: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  sendBlob: PropTypes.func,
  timer: PropTypes.number,
  taken: PropTypes.number,
  timeChange: PropTypes.func,
  startTaking: PropTypes.func,
  finishTaking: PropTypes.func,
  nowTaking: PropTypes.bool,
  changeBg: PropTypes.func,
};
