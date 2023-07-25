import PropTypes from "prop-types";

function Button({ word, userfunc }) {
  return (
    <button
      type="button"
      onClick={userfunc}
      className="w-12 h-6 hover:bg-yellow-400 hover:text-slate-700 bg-white text-slate-800 border-2 border-green-400 rounded text-center"
    >
      {word}
    </button>
  );
}

export default Button;

Button.defaultProps = {
  userfunc: () => {},
};

Button.propTypes = {
  word: PropTypes.string.isRequired,
  userfunc: PropTypes.func,
};
