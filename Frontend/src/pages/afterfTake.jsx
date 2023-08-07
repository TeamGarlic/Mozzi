import Layout from "../components/Layout";
import ClipLog from "@/components/ClipLog";
import Frame from "@/components/Frame";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {useEffect, useRef, useState} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { checkHost } from "@/utils/DecoratorUtil.js";
import fileApi from "@/api/fileApi.js";

function AfterTake({ goNext, user }) {
  const [delay, setDelay] = useState(false);
  const { code: shareCode } = useParams();
  const frame = useSelector((state) => state.clipReducer.frame);
  const frameNum = Array.from({ length: frame["n"] }, (v, i) => i + 1);
  const completeClipRef = useRef();
  const completeClipContextRef = useRef();
  const videoRef = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const bg = new Image();
  bg.src = frame.src;
  bg.crossOrigin = "anonymous";

  let mediaRecorder = null;
  const arrClipData = [];

  function recordClip() {
    setDelay(true);
    const mediaStream = completeClipRef.current.captureStream();
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event) => {
      arrClipData.push(event.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(arrClipData);

      // blob 데이터를 활용해 webm 파일로 변환
      const ClipFile = new File([blob], "clip.webm", { type: "video/webm" });
      // Todo: webm file url => 백엔드와 통신해서 url 주소를 재설정 해야함
      const fileURL = window.URL.createObjectURL(ClipFile);
      arrClipData.splice(0);
      saveClip(ClipFile, "test");
      console.log(location.state);
      // navigate(`/${shareCode}/finish`, {state: {clip: fileURL}});
      location.state = {state : {clip : fileURL}};
      console.log(location.state);
      goNext();
    };

    // 녹화 시작
    mediaRecorder.start();
    // Todo: 현재는 시간에 dependent => 프레임 단위로 전환 필요함
    setTimeout(() => {
      // 녹화 종료
      mediaRecorder.stop();
      // console.log("stop")
    }, 5000);
  }

  async function saveClip(file, title) {
    try {
      let res = await fileApi.saveClip(file, title);
      if (res.status === 201) {
        // Todo: res.data.data.id 소켓으로 넘기기
        console.log(res);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function makeClip() {
    if (
      frameNum.every((el) => {
        return frame[el].src !== "";
      })
    ) {
      frameNum.forEach((i) => {
        if (videoRef.current[i]) {
          videoRef.current[i].play();
        }
      });
      recordClip();
    }
  }
  // makeClip = checkHost(makeClip, location.state.user.isHost);
  makeClip = checkHost(makeClip, user.isHost);

  function drawVid() {
    frameNum.forEach((idx) => {
      if (frame[idx].src !== "") {
        completeClipContextRef.current.drawImage(
          videoRef.current[idx],
          completeClipRef.current.width * frame[idx]["x"],
          completeClipRef.current.height * frame[idx]["y"],
          completeClipRef.current.width * frame[idx]["width"],
          completeClipRef.current.height * frame[idx]["height"]
        );
      }
    });
    requestAnimationFrame(drawVid);
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
    drawVid();
  });

  return (
    <Layout>
      <>
      <div className={`flex ${delay ? "":"invisible" }`}>Loading...</div>
      <div className={`flex ${delay ? "invisible":"" }`}>
        <div className="w-full h-screen p-4 flex-col">
          {/* <ClipLog user={location.state.user} /> */}
          <ClipLog user={user} />
        </div>
        <div className="float-right min-w-[calc(32rem)] w-[calc(32rem)] h-screen bg-white flex-col rounded-s-xl p-4 justify-center items-center text-center overflow-y-scroll scrollbar-hide">
          프레임
          <div className="mx-auto bottom-5 justify-center items-center text-center">
            {/* <Frame user={location.state.user} /> */}
            <Frame user={user} />
            <button
              className="w-1/2 h-10 rounded-3xl bg-yellow-100 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.5)]"
              onClick={makeClip}
            >
              공유하기
            </button>
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
};
