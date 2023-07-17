import PropTypes from "prop-types";

function TextInput({ type, change, placeholder }) {
  return (
    <input
      type={type}
      onChange={change}
      placeholder={placeholder}
      className="w-full h-10"
    />
  );
}

export default TextInput;

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  change: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
};
