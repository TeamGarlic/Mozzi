import { Card } from "@material-tailwind/react";
import TextInput from "./TextInput";
import UserVideoComponent from "./UserVideoComponents";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';

export default function UserSideBar({ leaveSession }) {

  const pubCanvas = useSelector((state) => state.canvasReducer.pubCanvas);
  const subCanvases = useSelector((state) => state.canvasReducer.subCanvases);

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
          <UserVideoComponent canvas={pubCanvas} />
          <hr />
        </div>

        {subCanvases &&
          subCanvases.map((sub) => (
            <div key={sub.key} className="stream-container col-md-6 col-xs-6">
              <UserVideoComponent canvas={sub.canvas} />
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
  leaveSession: PropTypes.func,
};
