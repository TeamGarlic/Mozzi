import { Card } from "@material-tailwind/react";
import TextInput from "./TextInput";
import UserVideoComponent from "./UserVideoComponents";
import PropTypes from "prop-types";

export default function UserSideBar({ subscribers, publisher, leaveSession }) {

  return (
    <Card
      id="sideMenu"
      className="fixed top-0 right-0 w-64 h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-transparent"
    >
      <div className="p-4">
        <span className=" text-xl">사용자</span>
      </div>
      <ul className="gap-4 overflow-y-scroll scrollbar-hide">


        <div className="stream-container col-md-6 col-xs-6">
          <UserVideoComponent sub={publisher} />
          <hr />
        </div>

        {subscribers &&
          subscribers.map((sub) => (
            <div key={JSON.parse(sub.stream.connection.data).uid} className="stream-container col-md-6 col-xs-6">
              <UserVideoComponent sub={sub} />
              <hr />
            </div>
          ))}
      </ul>
      <div className="px-4">
        <TextInput type="text" placeholder="이름 변경..." className="" />
      </div>
      <button type="button" className="w-full h-10">
        이름 변경
      </button>
      <button className="w-full h-10 text-center leading-10" onClick={leaveSession}>
        나가기
      </button>
    </Card>
  );
}

UserSideBar.propTypes = {
  subscribers: PropTypes.array,
  publisher: PropTypes.object,
  leaveSession: PropTypes.func,
};
