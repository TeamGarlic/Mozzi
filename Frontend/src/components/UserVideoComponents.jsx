import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

export default function UserVideoComponent(canvas) {
  const vidRef = useRef();

  useEffect(() => {
    if(canvas&&canvas.canvas){
      console.log(canvas);
      vidRef.current.srcObject = canvas.canvas.captureStream();
    }
  }, [canvas]);

  return(
      <video autoPlay={true} ref={vidRef} />
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
