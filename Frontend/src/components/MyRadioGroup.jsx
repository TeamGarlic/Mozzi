import PropTypes from "prop-types";
import MyRadioButton from "./MyRadioButton";

function MyRadioGroup({ arr, name, onChange, nowState, text }) {
  return (
    <div className="flex rounded-3xl bg-slate-300 leading-10">
      <div className=" px-5">{text}</div>
      {arr.map((item) => {
        return (
          <label
            key={`${item}label`}
            className={`${
              item == nowState
                ? " bg-yellow-400 px-5 rounded-3xl"
                : "  px-5 rounded-3xl"
            }`}
          >
            {`${item}s`}
            <MyRadioButton
              name={name}
              value={item + ""}
              onChange={onChange}
              nowState={nowState + ""}
            />
          </label>
        );
      })}
    </div>
  );
}

export default MyRadioGroup;

MyRadioGroup.propTypes = {
  arr: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  nowState: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
};
