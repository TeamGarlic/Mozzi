import PropTypes from "prop-types";

function MyRadioButton({ name, value, onChange, nowState }) {
  return (
    <input
      type="radio"
      id={value}
      name={name}
      value={value}
      onChange={onChange}
      checked={value == nowState}
      className=" hidden"
    />
  );
}

export default MyRadioButton;

MyRadioButton.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  nowState: PropTypes.string.isRequired,
};
