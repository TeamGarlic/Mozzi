import PropTypes from "prop-types";
import { useState } from 'react';

function DownloadDropDown({src, types, download}) {
  const [dropdown, setDropdown] = useState(false);
  return (
    <div>
      <button
        className="text-sm items-center align-middle w-full h-8 rounded-t-2xl bg-orange-100 border-x border-t border-orange-500"
        onClick={()=>{setDropdown(prev=>!prev)}}
      >
        다운로드
      </button>
      <div className="">
        {dropdown&&types.map(item=>(
          <button key={`${item.format}`} className="w-1/2 right-0 my-0"
          onClick={()=>{download(src,item.format,item.type,item.srcFormat)}}>
            {`${item.format}`}
          </button>
        ))}
      </div>
    <div
      className=" w-full h-full bg-slate-100 border border-orange-500 rounded-b-2xl mb-3"
    >
      <video
        src={src}
        className="w-full h-full rounded-b-2xl"
        autoPlay
        type="video/webm"
        loop
        crossOrigin="anonymous"
      ></video>
    </div>
    </div>
  )
}

export default DownloadDropDown;

DownloadDropDown.propTypes = {
  src : PropTypes.string,
  types : PropTypes.array,
  download : PropTypes.func,
}