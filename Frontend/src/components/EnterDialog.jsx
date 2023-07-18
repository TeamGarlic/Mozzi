import PropTypes from "prop-types";

function EnterDialog({ visibility, onClick }) {
  return (
    visibility && (
      <div className=" z-10 absolute w-full min-h-screen bg-blend-darken justify-center items-center text-center bg-slate-200 bg-opacity-50">
        <div className=" w-[calc(45rem)] flex-col border-2 border-black mx-auto my-32">
          <div className="p-4">
            <span className=" float-left text-2xl">Enter</span>
          </div>
          <div className="h-96 p-4 flex">
            <div className="w-1/2">camera</div>
            <div className="w-1/2">voice</div>
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
};
