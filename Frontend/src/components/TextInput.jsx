import PropTypes from "prop-types";

function TextInput({ type, placeholder, value, onChange, onBlur }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className="w-full h-10"
    />
  );
}

export default TextInput;

TextInput.defaultProps = {
  onChange: function () {},
  onBlur: function () {},
};

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
};
