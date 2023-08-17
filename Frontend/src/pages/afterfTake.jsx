import Layout from "@/components/Layout";
import ClipLog from "@/components/ClipLog";
import Frame from "@/components/Frame";
import PropTypes from "prop-types";
import useInput from "@/hooks/useInput.js";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { checkHost } from "@/utils/DecoratorUtil.js";
import fileApi from "@/api/fileApi.js";
import Spinner from "@/components/Spinner.jsx";
import { AppStore } from "@/store/AppStore.js";
import useInterval from '@/hooks/useInterval.js';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
const ffmpeg = createFFmpeg({log : false});
import TextInput from "@/components/TextInput.jsx";
import ScriptModal from "@/components/ScriptModal.jsx";
function AfterTake({ goNext, user, sendMozzi, updateMozzi, setAlertModal, recordingMozzi, sendRecordingSignal }) {
  const [recording, setRecording] = useState(false);
  const mozziTitle = useInput()
  const { code: shareCode } = useParams();
  const frame = useSelector((state) => state.clipReducer.frame);
  const frameNum = Array.from({ length: frame["n"] }, (v, i) => i + 1);
  const completeClipRef = useRef();
  const completeClipContextRef = useRef();
  const videoRef = useRef({});
  const playTogetherRef = useRef();
  const [onScript, setOnScript] = useState(true);
  const [warnMsg, setWarnMsg] = useState("");
  const [scriptArray] = useState([
    "방장이 좌측의 클립 중 원하는 클립을 클릭하거나 드래그해서 프레임에 추가하세요",
    "동시재생 버튼을 누르면 편집될 영상을 미리 확인할 수 있습니다",
    "프레임에 사용될 클립을 모두 선택하면 방장이 제목을 입력하세요",
    "방장이 만들기 버튼을 누르면 편집이 시작되고, 5~10초 정도 이후 결과를 확인할 수 있어요"
  ])
  const bg = new Image();
  bg.src = frame.src;
  bg.crossOrigin = "anonymous";

  let mediaRecorder = null;
  const arrClipData = [];

  function closeScriptModal() {
    setOnScript(false);
  }
  
  function recordClip() {
    sendRecordingSignal(true);
    const mediaStream = completeClipRef.current.captureStream();
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      arrClipData.push(event.data);
    };
    mediaRecorder.onstop = async () => {
      const blob = new Blob(arrClipData);
      const ClipFile = new File([blob], "clip.webm", { type: "video/webm" });
      arrClipData.splice(0);
      saveClip(ClipFile, mozziTitle.value);
      sendRecordingSignal(false);
      goNext();
    };

    // 녹화 시작
    mediaRecorder.start();
    setRecording(true);
    // Todo: 현재는 시간에 dependent => 프레임 단위로 전환 필요함

    setTimeout(() => {
      // 녹화 종료
      mediaRecorder.stop();
      setRecording(false);
    }, 5000);
  }

  useInterval(()=>{
    drawVid();
  },recording?30:null);

  async function saveClip(file, title) {
    try {
      let res = await fileApi.saveClip(file, title, bg.width, bg.height);
      if (res.status === 201) {
        sendMozzi(res.data.data.id);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function makeClip() {
    if (
      frameNum.every((el) => {
        return frame[el].src !== "";
      }) && mozziTitle.value !== ""
    ) {
      frameNum.forEach((i) => {
        if (videoRef.current[i]) {
          videoRef.current[i].play();
        }
      });
      drawVid();
      recordClip();
    } else if (mozziTitle.value === "") {
      setWarnMsg("클립 제목을 입력해주세요");
      // alert("제목을 입력해주세요");
    } else {
      setWarnMsg("프레임을 전부 채워주세요");
      // alert("프레임을 전부 채워주세요");
    }
  }
  makeClip = checkHost(makeClip, user.isHost, setAlertModal);

  function drawVid() {
    frameNum.forEach((idx) => {
      if (frame[idx].clipIdx > 0) {
        completeClipContextRef.current.drawImage(
          videoRef.current[idx],
          completeClipRef.current.width * frame[idx]["x"],
          completeClipRef.current.height * frame[idx]["y"],
          completeClipRef.current.width * frame[idx]["width"],
          completeClipRef.current.height * frame[idx]["height"]
        );
      }
    });
  }

  function setPlayTogether(func){
    playTogetherRef.current.onclick = func;
    // console.log(playTogetherRef)
  }

  useEffect(() => {
    completeClipContextRef.current = completeClipRef.current.getContext("2d");
    completeClipContextRef.current.drawImage(
      bg,
      0,
      0,
      completeClipRef.current.width,
      completeClipRef.current.height
    );
  },[]);

  // console.log(playTogetherRef);

  return (
    <Layout>
      <>
      <div className={`flex ${recordingMozzi ? "":"invisible" }`}>
        <Spinner></Spinner>
      </div>
      <div className={`flex ${recordingMozzi ? "invisible":"" }`}>
        <div className="w-full h-screen p-4 flex-col flex content-center justify-center items-center text-center">
          {onScript && ( <ScriptModal scriptArray={scriptArray} closeScriptModal={closeScriptModal}/> )}
          <ClipLog user={user} setAlertModal={setAlertModal}/>
        </div>
        <div className="float-right min-w-[calc(32rem)] w-[calc(32rem)] h-screen bg-white flex-col rounded-s-xl p-4 justify-center items-center text-center overflow-y-scroll scrollbar-hide">
          <div className="mx-auto bottom-5 justify-center items-center text-center">
            <div className="flex">
              <button
                  className="w-1/2 h-10 rounded-3xl bg-green-100 border border-green-500 m-2"
                  ref={playTogetherRef}
              >
                동시재생
              </button>
              <button
                  className="w-1/2 h-10 rounded-3xl bg-blue-100 border border-blue-500 m-2"
                  onClick={makeClip}
              >
                만들기
              </button>
            </div>
            <div className="text-rose-600">{warnMsg}</div>
            <div className="bg-amber-50 border border-amber-500 my-3 py-1 rounded-2xl">
            <div className="m-2 px-4 ">
              <TextInput type="text" placeholder="제목을 입력해주세요" className="border border-amber-500" {...mozziTitle}/>
            </div>

            <Frame user={user} updateMozzi={updateMozzi} setPlayTogether={setPlayTogether} setAlertModal={setAlertModal}/>

            <div className="text-sm text-slate-500 mb-1">
              드래그해서 클립 순서를 바꿀 수 있습니다
            </div>
            </div>
          </div>
        </div>

        <canvas
          ref={completeClipRef}
          width={bg.width}
          height={bg.height}
          className="hidden"
        ></canvas>
        {frameNum.map((i) => {
          if (frame[i]["src"]) {
            return (
              <video
                key={`hidden${i}`}
                ref={(el) => (videoRef.current[i] = el)}
                id={`hidden${i}`}
                className="hidden"
                src={frame[i]["src"]}
                autoPlay={true}
              ></video>
            );
          }
        })}
      </div>
        </>
    </Layout>
  );
}

export default AfterTake;

AfterTake.propTypes = {
  goNext: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  sendMozzi: PropTypes.func,
  updateMozzi: PropTypes.func,
  setAlertModal: PropTypes.func,
  sendRecordingSignal: PropTypes.func,
  recordingMozzi: PropTypes.bool,
};
