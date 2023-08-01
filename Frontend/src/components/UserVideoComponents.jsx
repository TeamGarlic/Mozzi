import PropTypes from "prop-types";
import UserVideoSubComponent from "./UserVideoSubComponent";
// import { useEffect } from "react";

export default function UserVideoComponent(sub) {
  function getNicknameTag() {
    return JSON.parse(sub.sub.stream.connection.data).clientData;
  }

  return (
    <div>
      {sub && (
        <div>
          <UserVideoSubComponent sub={sub.sub} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.object,
};
