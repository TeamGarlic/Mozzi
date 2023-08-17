import PropTypes from "prop-types";
import {useState} from "react";
import {
  ChevronRightIcon,
  ChevronLeftIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid/index.js';
import {Rnd} from "react-rnd";

function ScriptModal({scriptArray, closeScriptModal}) {
  const [idx, setIdx] = useState(0)
  const [nowScript, setNowScript] = useState(scriptArray[0])

  function nextScript(){
    setNowScript(scriptArray[(idx+1)%scriptArray.length])
    setIdx((prev) => ((prev+1)%scriptArray.length))
  }

  function beforeScript(){
    setNowScript(scriptArray[(idx-1+scriptArray.length)%scriptArray.length])
    setIdx((prev) => ((prev+scriptArray.length-1)%scriptArray.length))
  }

  return (
      <Rnd
          default={{
            x: 5,
            y: 60,
            width: 500,
            height: 20,
          }}
          minWidth="500"
          minHeight="40"
          maxWidth="500"
          maxHeight="40"
          bounds="window"
          className="z-40"
          enableResizing="false"
      >
      <div
          className="w-[calc(50rem)] px-3 py-1 grid grid-cols-12 items-center align-middle content-center justify-center bg-yellow-100 bg-opacity-90 border border-yellow-500 text-yellow-700 rounded-xl z-40"
      >
        <div className="pr-5 text font-bold whitespace-nowrap col-span-9">
        ({`${idx+1}/${scriptArray.length}`}) {nowScript}
      </div>
        <ChevronLeftIcon className={`w-8 h-8 z-50 col-span-1 `} onClick={beforeScript}/>
        <ChevronRightIcon className={`w-8 h-8 z-50 col-span-1 `} onClick={nextScript}/>
        <XMarkIcon className="w-8 h-8 z-50 col-span-1" onClick={closeScriptModal}/>
      </div>
      </Rnd>
  )
}

export default ScriptModal;

ScriptModal.propTypes = {
  closeScriptModal: PropTypes.func,
  scriptArray: PropTypes.array,
}
