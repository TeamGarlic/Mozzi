import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import mozzilogo from "@/assets/img/mozzi.png";
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';
import mozziRollApi from "@/api/mozziRollApi.js";
import useUser from "@/hooks/useUser.js";
import TextInput from "@/components/TextInput.jsx";
import useInput from "@/hooks/useInput.js";
import {useState} from "react";
import ScriptModal from "@/components/ScriptModal.jsx";

function Finish({ mozzi, subscribers, publisher, shareCode, isHost }) {
  const user = useUser();
  const mozziTitle = useInput();
  const [onScript, setOnScript] = useState(true);
  const [scriptArray] = useState([
    "mp4 다운받기, gif 다운받기를 통해 원하는 형식으로 다운로드할 수 있습니다",
    "방장을 제외한 로그인한 유저는 입력창에 이름을 설정하여 내 모찌롤에 등록할 수 있습니다"
  ])

  function closeScriptModal() {
    setOnScript(false);
  }

  const goHome = () => {
    window.location.href = "/";
  }

  // console.log(isHost);

  const names = [];

  for (let item of subscribers) {
    const name = JSON.parse(item.stream.connection.data).clientData;
    names.push(name);
  }

  const ffmpeg = createFFmpeg({log : true})

  const handleDownload = async () => {
    await ffmpeg.load();
    ffmpeg.FS("writeFile","download.mp4",await fetchFile(`https://api.mozzi.lol/files/mozziroll/${mozzi}`));
    await ffmpeg.run("-i","download.mp4","download.gif");
    const gifFile = ffmpeg.FS("readFile","download.gif");
    const gifBlob = new Blob([gifFile.buffer], {type:"image/gif"});
    const gifUrl = URL.createObjectURL(gifBlob);
    console.log(gifUrl);
    const a = document.createElement("a");
    a.href = gifUrl;
    document.body.appendChild(a);
    a.download = "download.gif";
    a.click();
  }

  const linkMozzi = async () => {
    try {
      let res = await mozziRollApi.link(mozzi, mozziTitle.value, shareCode);
      if (res.status === 200) {
      }
    } catch (e) {
      console.log(e)
    }
  }

  const linkComponent = () => {
    if (user.user && isHost === 0) {
      return (
        <>
          <li className="w-32">
            <TextInput type="text" placeholder="제목 입력" {...mozziTitle} />
            <button onClick={linkMozzi}>내 모찌롤에 등록하기</button>
          </li>
        </>
      )
    }
  }

  return (
    <Layout>
      <div className="w-full h-screen p-4 flex-col">
        {onScript && ( <ScriptModal scriptArray={scriptArray} closeScriptModal={closeScriptModal}/> )}
        <div className="text-3xl">사진 공유</div>
        <div className="flex h-[calc(100%-5rem)]">
          <div className="w-1/2 flex my-auto max-h-[calc(100%-5rem)] overflow-scroll scrollbar-hide">
            <div className="w-full justify-center text-center items-center">
              <video className="w-3/4 mx-auto" autoPlay src={mozzi && `https://api.mozzi.lol/files/mozziroll/${mozzi}`} poster={mozzilogo} controls crossOrigin="anonymous"></video>
            </div>
          </div>
          <div className=" w-1/2 flex-col justify-center items-center text-center m-auto">
            <div>
              {new Date().toLocaleDateString()}의 추억
              <br />
              with
              <br />
              {publisher && JSON.parse(publisher.stream.connection.data).clientData}
              <br />
              {names.map((userName) => {
                return (
                  <>
                    <br />
                    {userName}
                  </>
                )
              })}
            </div>
            <ul className="flex gap-5 text-center justify-center mt-20">
              <li><a href={`https://api.mozzi.lol/files/mozziroll/${mozzi}`} target="_blanck">mp4 다운받기</a></li>
              <li><button onClick={handleDownload}>gif 다운받기</button></li>
              {linkComponent()}
              <li>
                <button onClick={goHome}>홈으로</button>
              </li>
            </ul>
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
