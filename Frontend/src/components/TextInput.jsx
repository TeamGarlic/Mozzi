import PropTypes from "prop-types";

function TextInput({ type, change }) {
  return (
    <input
      type={type}
      onChange={change}
      className="w-full h-6 border-2 rounded-md my-2"
    />
  );
}

export default TextInput;

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
};
