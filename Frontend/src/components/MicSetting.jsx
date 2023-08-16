import { useState, useEffect } from 'react';
import PropTypes from "prop-types";

function MicSetting({target, subVideoRefs}) {
  const [volume, setVolume] = useState(target.id?subVideoRefs[target.id].volume*100:100);
  useEffect(() => {
    if (!target.id) return
    subVideoRefs[target.id].volume = volume / 100;
  }, [volume])

  return (
    <div className="z-50">
      <div className={`flex-col w-full h-fit rounded-xl bg-white border border-blue-300 ${target.visible?"":"hidden"}`}>
        <div className="overflow-scroll p-3 scrollbar-hide">
          <div className="">
            <label className="block text-sm font-medium text-gray-900">{target.userName}님의 볼륨 : {`${volume}`}</label>
          </div>
          <hr />
          <input type="range" min="0" max="100" value={volume} onChange={(e)=>{setVolume(e.target.value)}}
                 className="w-full h-2 mb-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default MicSetting;

MicSetting.propTypes = {
  target: PropTypes.shape({
    visible: PropTypes.bool,
    id: PropTypes.string,
    userName: PropTypes.string,
  }),
  subVideoRefs: PropTypes.any,
}