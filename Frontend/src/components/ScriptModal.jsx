import PropTypes from "prop-types";
import {useState} from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid/index.js';

function ScriptModal({scriptArray, closeScriptModal}) {
  const [idx, setIdx] = useState(0)
  const [nowScript, setNowScript] = useState(scriptArray[0])

  function nextScript(){
    setNowScript(scriptArray[idx+1])
    setIdx((prev) => prev+1)
  }

  function beforeScript(){
    setNowScript(scriptArray[idx-1])
    setIdx((prev) => prev-1)
  }

  return (
    <div className="w-auto bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded inset-x-32 fixed top-16 z-50" role="alert">
      <div className="float-left pr-5">
        <strong className="font-bold">{nowScript}</strong>
      </div>
      <div className="w-8 h-8 float-right" onClick={closeScriptModal}>
        <XMarkIcon className="text-red-500"/>
      </div>
      {
        idx < scriptArray.length-1 && (
          <div className="w-8 h-8 float-right" onClick={nextScript}>
            <ChevronRightIcon/>
          </div>
        )
      }
      {
        idx > 0 && (
          <div className="w-8 h-8 float-right" onClick={beforeScript}>
            <ChevronLeftIcon/>
          </div>
        )
      }
    </div>
  )
}

export default ScriptModal;

ScriptModal.propTypes = {
  closeScriptModal: PropTypes.func,
  scriptArray: PropTypes.array,
}