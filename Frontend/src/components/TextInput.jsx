import PropTypes from "prop-types";

function TextInput({
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  className,
  onKeyDown,
  readOnly = false,
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={`w-full h-10 rounded-lg my-2 ${className}`}
      readOnly={readOnly}
    />
  );
}

export default TextInput;

TextInput.defaultProps = {
  onChange: function () {},
  onBlur: function () {},
  className: "",
};

TextInput.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  onKeyDown: PropTypes.func,
};
