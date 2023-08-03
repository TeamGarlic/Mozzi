import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';

export default function UserVideoComponent(sub) {
  const vidRef = useRef();

  useEffect(() => {
    if (sub.sub) {
      sub.sub.addVideoElement(vidRef.current);
    }
  }, [sub]);

  return(
      <video autoPlay={true} ref={vidRef} />
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
