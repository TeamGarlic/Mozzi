import PropTypes from "prop-types";

function TextInput({ type, placeholder,value, onChange}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full h-10"
    />
  );
}

export default TextInput;

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value:PropTypes.string,
  onChange:PropTypes.func
};
