import PropTypes from "prop-types";
import { useEffect, useRef } from "react";

export default function UserVideoSubComponent(sub) {
  const subRef = useRef();
  useEffect(() => {
    if (sub) {
      //   sub.sub.addVideoElement(subRef.current);
      console.log(sub);
    }
  }, [sub]);
  return <video autoPlay={true} ref={subRef} />;
}

UserVideoSubComponent.propTypes = {
  sub: PropTypes.any,
};
