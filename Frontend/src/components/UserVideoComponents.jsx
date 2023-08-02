import PropTypes from "prop-types";
import UserVideoSubComponent from "./UserVideoSubComponent";
import { useEffect } from 'react';
// import { useEffect } from "react";

export default function UserVideoComponent(sub) {

  useEffect(() => {
    // console.log(JSON.parse(sub.sub.stream.connection.data));
  }, []);


  return (
    <div>
      {sub && (
        <UserVideoSubComponent sub={sub.sub} />
      )}
    </div>
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
