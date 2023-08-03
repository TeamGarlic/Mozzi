import { useState } from "react";

function useInput(initialState = "") {
  const [value, setValue] = useState(initialState);
  function onChange(e) {
    setValue(e.target.value);
  }
  function reset() {
    setValue(initialState);
  }
  return { value, onChange, reset };
}

export default useInput;
