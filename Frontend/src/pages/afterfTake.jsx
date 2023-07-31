// import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ClipLog from "@/components/ClipLog";
import Frame from "@/components/Frame";
import {useSelector} from "react-redux";
import {useEffect, useRef} from "react";
import {useNavigate} from "react-router-dom";
import frame1 from "@/assets/img/frame6.jpg"

function AfterTake() {
  const frame = useSelector((state) => state.clipReducer.frame);
  const frameNum = Array.from({length: frame['n']}, (v, i) => i+1);
  const completeClipRef = useRef();
  const completeClipContextRef = useRef();
  const videoRef = useRef({});
  const navigate = useNavigate();
  const bg = new Image();
  bg.src = frame1;

  let mediaRecorder = null;
  const arrClipData = [];

  function recordClip(){
    const mediaStream = completeClipRef.current.captureStream();
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.ondataavailable = (event)=>{
      arrClipData.push(event.data);
    }
    mediaRecorder.onstop = ()=>{
      const blob = new Blob(arrClipData);

      // blob 데이터를 활용해 webm 파일로 변환
      const ClipFile = new File(
        [blob],
        "clip.webm",
        {type: 'video/webm'}
      )
      // Todo: webm file url => 백엔드와 통신해서 url 주소를 재설정 해야함
      const fileURL = window.URL.createObjectURL(ClipFile);
      arrClipData.splice(0);
      navigate("/0/finish", {state: {clip: fileURL}});
    }

    // 녹화 시작
    mediaRecorder.start();
    // Todo: 현재는 시간에 dependent => 프레임 단위로 전환 필요함
    setTimeout(()=>{
      // 녹화 종료
      mediaRecorder.stop();
      // console.log("stop")
    }, 5000)
  }

  function makeClip(){
    if(frameNum.every((el) => {
      return frame[el].src !== ""
    })){
      frameNum.forEach((i) => {
        if (videoRef.current[i]){
          videoRef.current[i].play();
        }
      })
      recordClip();
    }
  }

  function drawVid(){
    frameNum.forEach((idx) => {
      if (frame[idx].src !== ""){
        completeClipContextRef.current.drawImage(
          videoRef.current[idx],
          completeClipRef.current.width*frame[idx]['x'],
          completeClipRef.current.height*frame[idx]['y'],
          completeClipRef.current.width*frame[idx]['width'],
          completeClipRef.current.height*frame[idx]['height'],
        )
      }
    })
    requestAnimationFrame(drawVid);
  }

  useEffect(() => {
    completeClipContextRef.current = completeClipRef.current.getContext('2d');
    completeClipContextRef.current.drawImage(
      bg,
      0,
      0,
      completeClipRef.current.width,
      completeClipRef.current.height,
    );
    drawVid();
  });

  return (
    <Layout>
      <div className="flex">
        <div className="w-full h-screen p-4 flex-col">
          <ClipLog />
        </div>
        <div className="float-right min-w-[calc(32rem)] w-[calc(32rem)] h-screen bg-white flex-col rounded-s-xl p-4 justify-center items-center text-center overflow-y-scroll scrollbar-hide">
          프레임
          <div className="mx-auto bottom-5 justify-center items-center text-center">
            <Frame />
            <button
              className="w-1/2 h-10 rounded-3xl bg-yellow-100 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.5)]"
              onClick={makeClip}
            >
              공유하기
            </button>
          </div>
        </div>
        <canvas ref={completeClipRef} width={bg.width} height={bg.height} className="hidden"></canvas>
        {
          frameNum.map((i) => {
            if (frame[i]["src"]) {
              return (
                <video
                  key={`hidden${i}`}
                  ref={(el) => videoRef.current[i] = el}
                  id={`hidden${i}`}
                  className="hidden"
                  src={frame[i]["src"]}
                ></video>
              );
            }
          })
        }
      </div>
    </Layout>
  );
}

export default AfterTake;
