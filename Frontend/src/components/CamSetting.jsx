import { useEffect, useState } from 'react';
import { AdjustmentsHorizontalIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid/index.js';
import { useDispatch } from 'react-redux';
import { setDegreeAction, setScaleAction, setVisibilityAction } from '@/modules/canvasAction.js';
import useInterval from '@/hooks/useInterval.js';

function CamSetting() {
  const [visible, setVisible] = useState(false);
  const [camVisibility, setCamVisibility] = useState(true);
  const [count, setCount] = useState(0);
  const [degreeValue, setDegreeValue] = useState(0);
  const [scaleValue, setScaleValue] = useState(100);
  const [degreeChecked, setDegreeChecked] = useState(false);
  const [scaleChecked, setScaleChecked] = useState(false);
  const dispatch = useDispatch();


  const setCamVisible = (state) =>{
    dispatch(setVisibilityAction(state));
    setCamVisibility(state);
  }

  const setDegree = (val)=>{
    dispatch(setDegreeAction(val));
    setDegreeValue(val);
  }
  useInterval(()=>{
    setDegree((degreeValue+20)%360);
  },degreeChecked?1:null);

  const setScale = (val)=>{
    dispatch(setScaleAction(val));
    setScaleValue(val);
  }
  useInterval(()=>{
    setCount(count+1);
    setScale(115+parseInt(85*Math.sin(count/4)));
  },scaleChecked?1:null);


  return (
    <div className="fixed bottom-5 left-5 z-30">
      <div className={`flex-col w-80 h-fit rounded-xl bg-white my-3 ${visible?"":"hidden"}`}>
        <div className="columns-2 relative">
          <div className=" text-lg p-3">카메라 설정</div>
          <div className="w-10 h-10 float-right self-center m-2">
            {camVisibility ? (
              <EyeIcon
                onClick={() => {
                  setCamVisible(!camVisibility);
                }}
              />
            ) : (
              <EyeSlashIcon
                onClick={() => {
                  setCamVisible(!camVisibility);
                }}
              />
            )}
          </div>
        </div>
        <hr />
        <div
          className="overflow-scroll p-3 scrollbar-hide"
        >
          <div className="columns-2">
            <label className="block text-sm font-medium text-gray-900">카메라 회전 : {`${degreeValue}°`}</label>
            <div className="flex">
            <input id="degreeCheckbox" type="checkbox" onChange={(e)=>{setDegreeChecked(e.target.checked)}}
                   className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <label htmlFor="degreeCheckbox"
                   className="block text-sm font-medium text-gray-900">저는 관종입니다</label>
            </div>
          </div>
          <input type="range" min="0" max="360" value={degreeValue} onChange={(e)=>{setDegree(e.target.value)}}
                 className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          <hr  className="my-2"/>
          <div className="columns-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">카메라 크기 : {`${scaleValue}%`}</label>
            <div className="flex">
              <input id="scaleCheckbox" type="checkbox" onChange={(e)=>{setScaleChecked(e.target.checked)}}
                     className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="scaleCheckbox"
                     className="block text-sm font-medium text-gray-900">저는 관종입니다</label>
            </div>
          </div>
          <input type="range" min="30" max="200" value={scaleValue} onChange={(e)=>{setScale(e.target.value)}}
                 className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        </div>
      </div>
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
