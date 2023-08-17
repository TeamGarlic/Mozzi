import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

export default function UserVideoComponent(canvas) {
  const vidRef = useRef();

  useEffect(() => {
    if(canvas&&canvas.canvas){
      // console.log(canvas);
      vidRef.current.srcObject = canvas.canvas.captureStream();
    }
  }, [canvas]);

  return(
      <div className={"p-1 h-32 w-full"}>
      <video autoPlay={true} ref={vidRef} className={"h-full rounded-2xl bg-white border border-blue-200 object-fill"}/>
      </div>
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
