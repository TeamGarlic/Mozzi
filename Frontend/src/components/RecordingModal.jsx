import PropTypes from "prop-types";
import { Rnd } from 'react-rnd';

function RecordingModal({count, closeRecordingModal}) {
  return (

    <Rnd
      default={{
        x: 5,
        y: 120,
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
      <div className="w-64 px-3 py-1 grid grid-cols-10 items-center align-middle content-center justify-center bg-green-100 bg-opacity-90 border border-green-500 text-green-700 rounded-xl z-40">
        <div className="pr-5 text font-bold whitespace-nowrap col-span-9">촬영중입니다 ({count}초 남았습니다)</div>
        <svg onClick={closeRecordingModal} className="fill-current w-8 h-8 z-50 col-span-1 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
      </div>
    </Rnd>
  )
}

export default RecordingModal;

RecordingModal.propTypes = {
  closeRecordingModal: PropTypes.func,
}