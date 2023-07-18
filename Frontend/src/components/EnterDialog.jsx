import PropTypes from "prop-types";
import SmallCam from "@/components/SmallCam";
import { MicrophoneIcon as SolidMic } from "@heroicons/react/24/solid";
import { MicrophoneIcon as OutlineMic } from "@heroicons/react/24/outline";

function EnterDialog({ visibility, onClick, toggleVoice, setVoice }) {
  return (
    visibility && (
      <div className=" z-10 absolute top-0 left-0 w-full min-h-screen bg-blend-darken justify-center items-center text-center bg-slate-400 bg-opacity-60">
        <div className=" w-[calc(45rem)] flex-col rounded-xl border-2 mx-auto my-32 bg-white bg-opacity-70">
          <div className="h-14 p-4">
            <div className="float-left text-2xl overflow-hidden">입장하기</div>
          </div>
          <div className="p-4 flex">
            <div className="w-1/2 flex-col overflow-hidden">
              <span>camera</span>
              <SmallCam />
              <select className="cam" value={"1"}>
                <option value="1">cam1</option>
                <option value="2">cam2</option>
                <option value="3">cam3</option>
              </select>
            </div>
            <div className="w-1/2 flex-col">
              <span>voice</span>
              <div className="relative top-0 w-32 h-32 text-center justify-center items-center mx-auto">
                {toggleVoice ? (
                  <SolidMic
                    onClick={setVoice}
                    className="rounded-3xl hover:ring-2 scale-50"
                  />
                ) : (
                  <OutlineMic
                    onClick={setVoice}
                    className="rounded-3xl hover:ring-2 scale-50"
                  />
                )}
              </div>
              <select className="mic" value={"1"}>
                <option value="1">mic1</option>
                <option value="2">mic2</option>
                <option value="3">mic3</option>
              </select>
            </div>
          </div>
          <button type="button" className="h-10 mb-10" onClick={onClick}>
            enter
          </button>
        </div>
      </div>
    )
  );
}

export default EnterDialog;

EnterDialog.propTypes = {
  visibility: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  toggleVoice: PropTypes.bool.isRequired,
  setVoice: PropTypes.func.isRequired,
};
