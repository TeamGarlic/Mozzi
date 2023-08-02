import { Link } from "react-router-dom";
import { Card } from "@material-tailwind/react";
// import UserCard from "./UserCard";
import TextInput from "./TextInput";
import UserVideoComponent from "./UserVideoComponents";
import PropTypes from "prop-types";

export default function UserSideBar({ subscribers, mainPublisher }) {

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
          <UserVideoComponent sub={mainPublisher} />
          <hr />
        </div>

        {subscribers &&
          subscribers.map((sub) => (
            <>
              {!JSON.parse(sub.stream.connection.data).isMask?(
              <div key={JSON.parse(sub.stream.connection.data).uid} className="stream-container col-md-6 col-xs-6">
                <UserVideoComponent sub={sub} />
                <hr />
              </div>
              ):null}
            </>
          ))}
      </ul>
      <div className="px-4">
        <TextInput type="text" placeholder="이름 변경..." className="" />
      </div>
      <button type="button" className="w-full h-10">
        이름 변경
      </button>
      <Link className="w-full h-10 text-center leading-10" to="/">
        나가기
      </Link>
    </Card>
  );
}

UserSideBar.propTypes = {
  subscribers: PropTypes.array,
  mainPublisher: PropTypes.object,
};
