import { Card } from "@material-tailwind/react";
import TextInput from "./TextInput";
import UserVideoComponent from "./UserVideoComponents";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux';
import {useEffect} from "react";

export default function UserSideBar({ leaveSession ,user }) {

  const pubCanvas = useSelector((state) => state.canvasReducer.pubCanvas);
  const subCanvases = useSelector((state) => state.canvasReducer.subCanvases);
  useEffect(()=>{
    console.log(subCanvases)
  },[subCanvases])
  return (
    <Card
      id="sideMenu"
      className="fixed top-0 right-0 w-64 h-screen p-4 pb-0 shadow-xl shadow-blue-gray-900/5 bg-transparent"
    >
      <div className="p-4">
        <span className=" text-xl">사용자</span>
      </div>
      <ul className="gap-4 overflow-y-scroll scrollbar-hide">

        {pubCanvas &&
        <div className="stream-container col-md-6 col-xs-6">
          <UserVideoComponent canvas={pubCanvas.canvasRef} />
          {pubCanvas.nickname}
          <hr />
        </div>
        }
        {subCanvases &&
          Object.keys(subCanvases).map(key=>(
            <div key={key} className="stream-container col-md-6 col-xs-6">
              <UserVideoComponent canvas={subCanvases[key].ref} />
              {/*추가 코드*/}
              {subCanvases[key].nickName}
              {/*추가 코드*/}
              <hr />
            </div>
          ))}
      </ul>

      <button className="mx-auto mt-4 w-full h-10 text-center leading-10 " onClick={leaveSession}>
        나가기
      </button>
    </Card>
  );
}

UserSideBar.propTypes = {
  leaveSession: PropTypes.func,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
};
