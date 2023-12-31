import { Card } from "@material-tailwind/react";
import UserVideoComponent from "./UserVideoComponents";
import { useSelector } from 'react-redux';

export default function UserSideBar() {
  const pubCanvas = useSelector((state) => state.canvasReducer.pubCanvas);
  const subCanvases = useSelector((state) => state.canvasReducer.subCanvases);
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

                  <div className="text-xl h-7">
                    {pubCanvas.nickname}
                  </div>
                </div>
            }
            {subCanvases &&
                Object.keys(subCanvases).map(key=>(
                    <div key={key} className="stream-container col-md-6 col-xs-6 bg-slate-100 rounded-2xl border border-blue-200 my-1">
                      <UserVideoComponent canvas={subCanvases[key].ref} />
                      <div className="text-xl h-7">
                      {subCanvases[key].nickName}
                    </div>
                    </div>
                ))}
          </ul>
        </div>
      </Card>
  );
}
