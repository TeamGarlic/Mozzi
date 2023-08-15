import { Card } from "@material-tailwind/react";
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
          className={"fixed h-screen top-0 right-0 w-64 shadow-xl shadow-blue-gray-900/5 p-4 overflow-y-scroll bg-white scrollbar-hide rounded-e-none"}
      >
        <div className="row-auto text-center">
          <div className="text-2xl">
            사용자 목록
          </div>
          <div className="text-sm text-slate-600">
            왼쪽 하단에 설정창이 있습니다
          </div>
          <ul className="gap-4 overflow-y-scroll scrollbar-hide">
            {pubCanvas &&
                <div className="stream-container col-md-6 col-xs-6 bg-slate-100 rounded-2xl border border-blue-200 my-1">
                  <UserVideoComponent canvas={pubCanvas.canvasRef} />

                  <div className="text-xl">
                    {pubCanvas.nickname}
                  </div>
                </div>
            }
            {subCanvases &&
                Object.keys(subCanvases).map(key=>(
                    <div key={key} className="stream-container col-md-6 col-xs-6 bg-slate-100 rounded-2xl border border-blue-200 my-1">
                      <UserVideoComponent canvas={subCanvases[key].ref} />
                      <div className="text-xl">
                      {subCanvases[key].nickName}
                    </div>
                    </div>
                ))}
          </ul>

          <button className=" block relative mx-auto w-20 bg-red-300 p-3 rounded-3xl text-slate-900" onClick={leaveSession}>
            나가기
          </button>
        </div>
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
