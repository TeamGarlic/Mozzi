import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PicSideBar from "@/components/PicSideBar";
import Layout from "@/components/Layout";
import BigCam from "@/components/BigCam";
import Chat from "@/components/Chat";
import PropTypes from "prop-types";
import MyRadioGroup from "@/components/MyRadioGroup";
import { useSelector, useDispatch } from "react-redux";
import { checkHost } from "@/utils/DecoratorUtil.js";
import boothApi from "@/api/boothApi.js";
import CamSetting from '@/components/CamSetting.jsx';

function TakePic({ shareCode, sendMessage, chatLists, user, bgList, goNext, timer, taken, timeChange, startTaking, finishTaking, nowTaking, myId, updatePosition, changeBg, position, sendPosition, setPosition, sendFileName, shareSecret, publisher, subscribers }) {
  const timers = [3, 5, 10];
  const [count, setCount] = useState(3);
  const [timerVisible, setTimerVisible] = useState(false);
  const [isTaking, setIsTaking] = useState(false);
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
      const fileName = `clip${taken}.webm`;
      const file = new File([blob], fileName, { type: "video/webm" })
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
        uploadClip(res, fileName, taken)
      });
      // uploadClip(file, fileName, taken)
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

  async function uploadClip(file, fileName, idx) {
    try {
      let res = await boothApi.uploadClip(fileName, shareCode, file);
      if (res.status === 200) {
        sendFileName(idx, fileName, shareSecret)
      }
    } catch (e) {
      console.log(e);
    }
  }

  function setTime(e) {
    timeChange(e.target.value)
  }

  function take() {
    startTaking();
    // startCount();
  }

  function startCount() {
    setTimerVisible(true);
    // console.log(timer + "초 후 촬영");
    interval = setInterval(() => {
      // console.log(interval);
      setCount((prev) => {
        let next = prev - 1;
        if (isTaking === false && next === 0) {
          // 대기 시간 후 촬영 시작(next 초 만큼)
          next = 5;
          setIsTaking(true);
          recordClip(taken);
        } else if (isTaking === 1 && next === 0) {
          clearInterval(interval);
          setTimerVisible(false);
          setIsTaking(false);
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
        <CamSetting />
        <Chat sendMessage={sendMessage} chatLists={chatLists} user={user} publisher={publisher} />
        <div className="w-full pt-4 ps-4">
          <div className="text-2xl">촬영 부스</div>
          <PicSideBar
            bgList={bgList}
            user={user}
            changeBg={changeBg}
            position={position}
            sendPosition={sendPosition}
            setPosition={setPosition}
            subscribers={subscribers}
            publisher={publisher}
          />
          {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
        </div>
        <BigCam myId={myId} updatePosition={updatePosition} setPosition={setPosition} isTaking={isTaking} />
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
  publisher: PropTypes.any,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  timer: PropTypes.number,
  taken: PropTypes.number,
  timeChange: PropTypes.func,
  startTaking: PropTypes.func,
  finishTaking: PropTypes.func,
  nowTaking: PropTypes.bool,
  myId: PropTypes.string,
  updatePosition: PropTypes.func,
  changeBg: PropTypes.func,
  position: PropTypes.array,
  sendPosition: PropTypes.func,
  setPosition: PropTypes.func,
  sendFileName: PropTypes.func,
  shareSecret: PropTypes.string,
  subscribers: PropTypes.array,
};
