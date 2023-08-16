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
const ffmpeg = createFFmpeg({log : true});
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
  const [scriptArray] = useState([
    "방장은 좌측에 표시되는 촬영된 클립을 클릭하거나 드래그하여 프레임에 넣을 영상을 선택할 수 있습니다",
    "동시 재생 버튼을 누르면 편집된 영상을 미리 확인할 수 있습니다",
    "방장은 프레임에 사용될 클립을 모두 선택하고 제목을 입력하여야합니다",
    "방장은 공유하기 버튼을 이용하여 촬영 결과 페이지로 이동할 수 있습니다"
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
      await ffmpeg.load();
      ffmpeg.FS("writeFile","temp.webm",new Uint8Array(await blob.arrayBuffer()));
      await ffmpeg.run("-i","temp.webm","-filter:v", "fps=30","download.mp4");
      const mp4Unit8 = ffmpeg.FS("readFile","download.mp4");
      const mp4Blob = new Blob([mp4Unit8.buffer], {type:"video/mp4"});
      const mp4File = new File([mp4Blob], "download.mp4", { type: "video/mp4" });
      // Todo: webm file url => 백엔드와 통신해서 url 주소를 재설정 해야함
      arrClipData.splice(0);
      saveClip(mp4File, mozziTitle.value);
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
      alert("제목을 입력해주세요");
    } else {
      alert("프레임을 전부 채워주세요");
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
          <ScriptModal scriptArray={scriptArray} closeScriptModal={closeScriptModal}/>
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
                공유하기
              </button>
            </div>
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
