import { useEffect, useState } from 'react';
import {
  Cog8ToothIcon,
  MicrophoneIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
} from '@heroicons/react/20/solid/index.js';
import { useDispatch } from 'react-redux';
import { setDegreeAction, setScaleAction, setVisibilityAction } from '@/modules/canvasAction.js';
import useInterval from '@/hooks/useInterval.js';
import PropTypes from "prop-types";

function CamSetting({toggleMic, onMic, position, setPosition, visibleCamSetting, sendPosition}) {
  const [visible, setVisible] = useState(false);
  const [camVisibility, setCamVisibility] = useState(true);
  const [count, setCount] = useState(0);
  const [degreeValue, setDegreeValue] = useState(360);
  const [scaleValue, setScaleValue] = useState(100);
  const [degreeChecked, setDegreeChecked] = useState(false);
  const [scaleChecked, setScaleChecked] = useState(false);
  const dispatch = useDispatch();

  const setCamVisible = (state) =>{
    dispatch(setVisibilityAction(state));
    setCamVisibility(state);
  }

  const setMute = () =>{
    const _position = position;
    toggleMic();
    setPosition(_position);
    sendPosition(_position);
  }

  const setDegree = (val)=>{
    dispatch(setDegreeAction(val));
    setDegreeValue(val);
  }
  useInterval(()=>{
    setDegree((degreeValue+17)%720);
  },degreeChecked?1:null);

  const setScale = (val)=>{
    dispatch(setScaleAction(val));
    setScaleValue(val);
  }
  useInterval(()=>{
    setCount(count+1);
    setScale(115+parseInt(85*Math.sin(count/4)));
  },scaleChecked?1:null);

  useEffect(() => {
    if(!visibleCamSetting){
      setDegreeChecked(false);
      setScaleChecked(false);
    }
  }, [visibleCamSetting]);


  return (
    <div className={`fixed bottom-5 left-5 z-50 ${visibleCamSetting?"":"invisible"}`}>
      <div className={`flex-col w-80 h-fit rounded-xl bg-white my-3 border border-blue-300 ${visible?"":"hidden"}`}>
        <div className="columns-2 relative content-center">
          <div className="text-lg p-3">카메라 설정</div>
          <div className="w-10 h-10 float-right my-1.5 mr-1">
            {
              camVisibility ? (
                <svg onClick={() => {setCamVisible(!camVisibility);}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                </svg>
              ):(
                <svg onClick={() => {setCamVisible(!camVisibility);}} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
                </svg>
              )
            }
          </div>
          <div className="w-10 h-10 float-right my-1.5 mr-2">
            {
              onMic ? (
                <svg onClick={setMute} className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                  <path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0v5zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"/>
                </svg>
              ):(
                <svg onClick={setMute} className="w-6 h-6" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4.02 4.02 0 0 0 12 8V7a.5.5 0 0 1 1 0v1zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a4.973 4.973 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4zm3-9v4.879l-1-1V3a2 2 0 0 0-3.997-.118l-.845-.845A3.001 3.001 0 0 1 11 3z"/>
                  <path d="m9.486 10.607-.748-.748A2 2 0 0 1 6 8v-.878l-1-1V8a3 3 0 0 0 4.486 2.607zm-7.84-9.253 12 12 .708-.708-12-12-.708.708z"/>
                </svg>
              )
            }
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
                   className="block text-sm font-medium text-gray-900">계속 회전</label>
            </div>
          </div>
          <input type="range" min="0" max="720" value={degreeValue} onChange={(e)=>{setDegree(e.target.value)}}
                 className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
          <hr  className="my-2"/>
          <div className="columns-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">카메라 크기 : {`${scaleValue}%`}</label>
            <div className="flex">
              <input id="scaleCheckbox" type="checkbox" onChange={(e)=>{setScaleChecked(e.target.checked)}}
                     className="w-4 h-4 mr-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
              <label htmlFor="scaleCheckbox"
                     className="block text-sm font-medium text-gray-900">계속 확대</label>
            </div>
          </div>
          <input type="range" min="30" max="200" value={scaleValue} onChange={(e)=>{setScale(e.target.value)}}
                 className="w-full h-2 mb-10 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
        </div>
      </div>
      <div className=" w-14 h-14 float-left p-1 rounded-full bg-[#ffffff] border-2 border-blue-500">
        <Cog8ToothIcon
          onClick={() => {
            setVisible(!visible);
          }}
        />
      </div>
    </div>
  );
}

export default CamSetting;

CamSetting.propTypes = {
  toggleMic: PropTypes.func,
  onMic: PropTypes.bool,
  position: PropTypes.array,
  setPosition: PropTypes.func,
  sendPosition: PropTypes.func,
  visibleCamSetting: PropTypes.bool,
}