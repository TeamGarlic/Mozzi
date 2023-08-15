import { useState } from "react";
import { Card } from "@material-tailwind/react";
import UserList from "./UserList";
import BgCard from "./BgCard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

export default function PicSideBar({user, bgList, changeBg, position, sendPosition, setPosition, subscribers, publisher, setAlertModal}) {
  const [menu, setMenu] = useState(0);
  return (
      <>
        <div className={`fixed z-10 flex-col gap-3 p-4 h-fit top-5 ${menu === 0 ? "right-0" : "right-64"}`}>
          <div className=" w-10 h-10">
            <UsersIcon onClick={() => (menu === 1 ? setMenu(0) : setMenu(1))} />
          </div>
          <div className=" w-10 h-10">
            <ComputerDesktopIcon
              onClick={() => (menu === 2 ? setMenu(0) : setMenu(2))}
            />
          </div>
        </div>
    <div className="fixed z-10 top-0 right-0 flex">
        <Card
          id="sideMenu"
          className={`h-screen w-[calc(16rem)] shadow-xl shadow-blue-gray-900/5 p-4 overflow-y-scroll bg-white scrollbar-hide rounded-e-none ${
            menu === 0 ? "hidden" : ""
          }`}
        >
            <div className={`h-full ${menu === 1?"":"collapse fixed"}`}>
              <UserList
                user={user}
                position={position}
                sendPosition={sendPosition}
                setPosition={setPosition}
                subscribers={subscribers}
                publisher={publisher}
                setAlertModal={setAlertModal}
              />
            </div>
            <div className={`h-full ${menu === 2?"":"collapse fixed"}`}>
                <div className="row-auto text-center">
                    <div className="text-2xl">
                        배경화면 바꾸기
                    </div>
                    <div className="text-sm text-slate-600">
                        방장이 배경화면을 바꿀 수 있습니다
                    </div>
              {bgList.map((bg) => (
                <BgCard 
                  bgName={bg.title}
                  key={bg.id} 
                  bgSrc={bg.objectName} 
                  user={user} 
                  changeBg={changeBg}
                  setAlertModal={setAlertModal}
                />
              ))}
                </div>
            </div>
          {menu === 3 && <div>스티커</div>}
        </Card>
    </div>
        </>
  );
}

PicSideBar.propTypes = {
  bgList: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  changeBg: PropTypes.func,
  position: PropTypes.array,
  sendPosition: PropTypes.func,
  setPosition: PropTypes.func,
  subscribers: PropTypes.array,
  publisher: PropTypes.any,
  setAlertModal: PropTypes.func,
};
