import PropTypes from "prop-types";
import { useEffect, useRef } from 'react';
// import { useEffect } from "react";

export default function UserVideoComponent(sub) {
  const vidRef = useRef();

  useEffect(() => {
    if (sub.sub) {
      sub.sub.addVideoElement(vidRef.current);
      // console.log(sub.sub);
      // console.log(sub.sub.stream);
      // console.log(JSON.parse(sub.sub.stream.connection.data));
    }
  }, [sub]);

  return(
    <>
      {/*<p style={{"position":"absolute","background":"rgba(255,255,255,0.51)"}}>{JSON.parse(sub.sub.stream.connection.data).clientData}</p>*/}
      <video autoPlay={true} ref={vidRef} />
    </>
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
