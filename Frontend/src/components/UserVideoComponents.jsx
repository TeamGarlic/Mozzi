import PropTypes from "prop-types";
import UserVideoSubComponent from "./UserVideoSubComponent";
import { useEffect } from "react";

export default function UserVideoComponent(sub) {
  function getNicknameTag() {
    return "hello";
  }

  useEffect(() => {
    if (sub) console.log(sub.sub);
  }, [sub]);

  return (
    <div>
      {sub && (
        <div className="streamcomponent">
          <UserVideoSubComponent sub={sub} />
          <div>
            <p>{getNicknameTag()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

UserVideoComponent.propTypes = {
  sub: PropTypes.any,
};
