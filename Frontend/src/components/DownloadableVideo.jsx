import PropTypes from "prop-types";
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid/index.js';

function DownloadableVideo({src, types, download}) {
  const [dropdown, setDropdown] = useState(false);
  return (
    <div>
      <div
        className="items-center flex align-middle content-center justify-center w-full h-8 rounded-t-2xl bg-orange-100 border-x border-t border-orange-500"
        onClick={()=>{setDropdown(prev=>!prev)}}
      >
        <div className="text">
        다운로드
        </div>
        {dropdown?(<ChevronUpIcon className="h-full"/>):(<ChevronDownIcon className="h-full"/>)}
      </div>
      <div className="relative w-full z-40">
        <div className="absolute flex-col border-t border-orange-500 rounded-2xl w-full">
        {dropdown&&types.map(item=>(
          <button key={`${item.format}`} className="w-full top-0 h-10  bg-orange-50 border-x border-b border-b-orange-300 border-x-orange-500"
          onClick={()=>{download(src,item.format,item.type,item.srcFormat)}}>
            {`.${item.format} 파일로 다운로드${item.format===item.srcFormat?" (원본)":""}`}
          </button>
        ))}
          {dropdown&&(<div className='rounded-b-2xl h-2 bg-orange-100 border-x border-b border-orange-500'></div>)}
        </div>
      </div>
    <div
      className=" w-full h-full bg-slate-100 border border-orange-500 rounded-b-2xl mb-3"
    >
      <video
        src={src}
        className="w-full h-full rounded-b-2xl"
        autoPlay
        type="video/webm"
        controls
        loop
        crossOrigin="anonymous"
      ></video>
    </div>
    </div>
  )
}

export default DownloadableVideo;

DownloadableVideo.propTypes = {
  src : PropTypes.string,
  types : PropTypes.array,
  download : PropTypes.func,
}
