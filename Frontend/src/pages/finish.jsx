import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
import mozziRollApi from "@/api/mozziRollApi.js";
import useUser from "@/hooks/useUser.js";
import useInput from "@/hooks/useInput.js";
import {useDispatch, useSelector} from 'react-redux';
import { useEffect, useState } from 'react';
import DownloadableVideo from '@/components/DownloadableVideo.jsx';
import ScriptModal from "@/components/ScriptModal.jsx";
import {setFFMpegStatusAction} from "@/modules/clipAction.js";

function Finish({ mozzi, subscribers, publisher, shareCode, isHost }) {
  const user = useUser();
  const dispatch = useDispatch();
  const mozziTitle = useInput("우리들의 추억")
  const clipList = useSelector((state) => state.clipReducer.clipList);
  const FFMpegStatus = useSelector((state) => state.clipReducer.FFMpegStatus);
  const clipNum = Array.from({length: clipList['n']}, (v, i) => i+1);
  const clipTypes = [{format:'webm',type:'', srcFormat:"webm"},{format:'mp4',type:'video/mp4', srcFormat:"webm"},{format:'gif',type:'image/gif', srcFormat:"webm"}]
  const frameTypes = [{format:'webm',type:'', srcFormat:"mp4"},{format:'mp4',type:'video/mp4', srcFormat:"mp4"},{format:'gif',type:'image/gif', srcFormat:"mp4"}]
  const [onScript, setOnScript] = useState(true);
  const [scriptArray] = useState([
    "다운로드 버튼을 눌러 원하는 형식으로 다운로드할 수 있습니다",
    "방장을 제외한 로그인한 유저는 입력창에 이름을 설정하여 내 클립에 등록할 수 있습니다"
  ])
  const [linked, setLinked] = useState(isHost>0)

  function closeScriptModal() {
    setOnScript(false);
  }


  const goHome = () => {
    window.location.href = "/";
  }


  const names = [];

  for (let item of subscribers) {
    const name = JSON.parse(item.stream.connection.data).clientData;
    names.push(name);
  }

  const ffmpeg = createFFmpeg({log : false});
  const handleDownload = async (src, format, type, srcFormat) => {
    if(!FFMpegStatus){
      alert("이미 다른 파일을 다운로드 중입니다. 잠시 후에 다시 시도해주세요");
      return;
    }
    dispatch(setFFMpegStatusAction(false));
    let recUrl = src;
    if(srcFormat!=format){
      if(!ffmpeg.isLoaded()) await ffmpeg.load();
      // TODO : download 파일명 바꿔야됨
      ffmpeg.FS("writeFile","download."+srcFormat,await fetchFile(src));
      await ffmpeg.run("-i","download."+srcFormat,"-filter:v", "fps=30","download."+format);
      const recFile = ffmpeg.FS("readFile","download."+format);
      const recBlob = new Blob([recFile.buffer], {type:type});
      recUrl = URL.createObjectURL(recBlob);
    }
    const a = document.createElement("a");
    a.href = recUrl;
    document.body.appendChild(a);
    a.download = "download."+format;
    a.target="_blank";
    a.click();
    dispatch(setFFMpegStatusAction(true));
  }

  // function handleDownload(src, format, type, srcFormat){
  //   if(FFMpegStatus) ffmpegDownload(src, format, type, srcFormat);
  //   else{
  //     alert("이미 다른 파일을 다운로드 중입니다. 잠시 후에 다시 시도해주세요");
  //     return;
  //   }
  // }
  // useEffect(() => {
  //   handleDownload = (src, format, type, srcFormat)=>{
  //     if(FFMpegStatus) ffmpegDownload(src, format, type, srcFormat);
  //     else{
  //       alert("이미 다른 파일을 다운로드 중입니다. 잠시 후에 다시 시도해주세요");
  //       return;
  //     }
  //   };
  // }, [FFMpegStatus]);




  const linkMozzi = async () => {
    if(!user.user){
      alert("회원가입 이후 이용 가능한 기능입니다.");
      return;
    }
    try {
      let res = await mozziRollApi.link(mozzi, mozziTitle.value, shareCode);
      if (res.status === 200) {
        setLinked(true)
      }
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
  }, []);


  return (
    <Layout>
      <div className="w-full h-screen p-4 flex-row text-center">
        {onScript && ( <ScriptModal scriptArray={scriptArray} closeScriptModal={closeScriptModal}/> )}
        <div className="text-3xl my-3">촬영이 완료되었습니다</div>
        <div className="grid grid-cols-5 gap-4 h-[calc(100%-5rem)] mx-3">
          <div className="w-full row-auto h-[calc(100%-2rem)] bg-amber-50 border border-amber-500 rounded-2xl my-auto p-3 overflow-y-scroll scrollbar-hide col-span-2">
            <div className="text-2xl">촬영된 클립들</div>
            <div className=" flex flex-wrap w-full p-8 overflow-y-scroll scrollbar-hide items-center text-center content-center gap-x-4">
              {clipNum.map((i) => {
                if (clipList[i]) {
                  return (
                    <DownloadableVideo key={`clip${i}`} src={clipList[i]} types={clipTypes} download={handleDownload}/>
                  );
                }
              })}
            </div>
          </div>

          <div className="w-full flex-wrap justify-center text-center items-center h-[calc(100%-2rem)] bg-amber-50 border border-amber-500 rounded-2xl my-auto p-3 overflow-y-scroll scrollbar-hide col-span-3">
            <div className="w-full justify-center text-center items-center">
              <div className="w-4/5 mx-auto bg-orange-100 border border-orange-500 rounded-2xl p-1">
                <div className="w-full bg-orange-50 border border-orange-500 rounded-2xl p-1">
                <div className={`text-2xl ${mozziTitle.value.length>0?"text-black":"text-slate-700"}`}>{`${mozziTitle.value.length>0?mozziTitle.value:"우리들의 추억"}`}</div>
                  <div className="text-sm">
                 {new Date().toLocaleDateString()}
                  </div>
                  <div className="text">
                    with
                    {publisher && " "+ JSON.parse(publisher.stream.connection.data).clientData}
                    {names.map((userName) => {
                      return (
                        <>
                          {", "+userName}
                        </>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center text-center items-center">
              {!linked ? (
                  <>
                    <div
                      className="w-1/4 h-10 rounded-l-2xl bg-blue-100 border border-blue-500 ml-2 justify-center text-center items-center">
                      <input
                        type="text"
                        placeholder="제목을 입력하세요"
                        className={`w-[calc(100%-0.5rem)] h-8 rounded-l-2xl my-1 ml-1 px-1  whitespace-nowrap`}
                        {...mozziTitle}
                      />
                    </div>
                    <button
                      className="w-1/4 h-10 rounded-r-2xl bg-blue-100 border border-blue-500 mr-2  whitespace-nowrap"
                      onClick={linkMozzi}
                    >
                      마이페이지에 등록
                    </button>
                  </>
                ):(
                  <button
                    className="w-1/4 h-10 rounded-3xl bg-green-100 border border-green-500 m-2"
                  >
                    마이페이지에 저장됨
                  </button>
                )}
              <button
                className="w-1/4 h-10 rounded-3xl bg-red-100 border border-red-500 m-2"
                onClick={goHome}
              >
                홈으로
              </button>
            </div>


            <div className="w-full justify-center text-center items-center">
              <div className="w-4/5 mx-auto">
                <DownloadableVideo src={`${mozzi?('https://api.mozzi.lol/files/mozziroll/'+mozzi):""}`} download={handleDownload} types={frameTypes}></DownloadableVideo>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Finish;

Finish.propTypes = {
  mozzi: PropTypes.string,
  subscribers: PropTypes.array,
  publisher: PropTypes.any,
  shareCode: PropTypes.string,
  isHost: PropTypes.number,
}
