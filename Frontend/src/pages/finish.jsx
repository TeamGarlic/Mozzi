import Layout from "@/components/Layout";
import PropTypes from "prop-types";
import mozzilogo from "@/assets/img/mozzi.png";
import {createFFmpeg, fetchFile} from '@ffmpeg/ffmpeg';

function Finish({ mozzi, subscribers, publisher }) {
  const goHome = () => {
    window.location.href = "/";
  }

  const names = [];

  for (let item of subscribers) {
    const name = JSON.parse(item.stream.connection.data).clientData;
    names.push(name);
  }

  const ffmpeg = createFFmpeg({log : true})

  const handleDownload = async () => {
    await ffmpeg.load();
    ffmpeg.FS("writeFile","download.webm",await fetchFile(`https://api.mozzi.lol/files/mozziroll/${mozzi}`));
    await ffmpeg.run("-i","download.webm","download.mp4");
    const mp4File = ffmpeg.FS("readFile","download.mp4");
    const mp4Blob = new Blob([mp4File.buffer], {type:"video/mp4"});
    const mp4Url = URL.createObjectURL(mp4Blob);
    console.log(mp4Url);
    const a = document.createElement("a");
    a.href = mp4Url;
    document.body.appendChild(a);
    a.download = "download.mp4";
    a.click();
  }

  return (
    <Layout>
      <div className="w-full h-screen p-4 flex-col">
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
              <li><a href={`https://api.mozzi.lol/files/mozziroll/${mozzi}`} target="_blanck">다운받기</a></li>
              <li><button onClick={handleDownload}>mp4다운받기</button></li>
              <li>카톡공유</li>
              <li>인스타공유</li>
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
  publisher: PropTypes.any
}
