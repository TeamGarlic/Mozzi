import { useState } from "react";
import { AdjustmentsHorizontalIcon } from '@heroicons/react/20/solid/index.js';
import { useDispatch } from 'react-redux';
import { setDegreeAction, setScaleAction } from '@/modules/canvasAction.js';

function CamSetting() {
  const [visible, setVisible] = useState(false);
  const [degreeValue, setDegreeValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(100);
  const dispatch = useDispatch();
  const setDegree = (e)=>{
    dispatch(setDegreeAction(e.target.value));
    setDegreeValue(e.target.value);
  }

  const setScale = (e)=>{
    dispatch(setScaleAction(e.target.value));
    setScaleValue(e.target.value);
  }
  return (
    <div className="fixed bottom-5 left-5 z-30">
      {visible && (
        <div className="flex-col w-80 h-fit rounded-xl bg-white my-3">
          <div className=" text-lg p-3">카메라 설정</div>
          <hr />
          <div
            className="overflow-scroll p-3 scrollbar-hide"
          >
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">영상 회전 : {`${degreeValue}°`}</label>
            <input type="range" min="0" max="360" value={degreeValue} onChange={(e)=>{setDegree(e)}}
                   className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">영상 크기 : {`${scaleValue}%`}</label>
            <input type="range" min="30" max="200" value={scaleValue} onChange={(e)=>{setScale(e)}}
                   className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          </div>
        </div>
      )}
      <div className=" w-12 h-12 float-left p-1 rounded-full bg-[#ffffff] border-2 border-blue-500">
        <AdjustmentsHorizontalIcon
          onClick={() => {
            setVisible(!visible);
          }}
        />
      </div>
    </div>
  );
}

export default CamSetting;
