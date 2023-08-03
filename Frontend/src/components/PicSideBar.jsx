import { useState } from "react";
import { Card } from "@material-tailwind/react";
import UserList from "./UserList";
import BgCard from "./BgCard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import TakePic from "@/pages/takePic.jsx";

export default function PicSideBar({user, bgList}) {
  // const buttons = [
  //   { word: "사용자", idx: 1 },
  //   { word: "배경", idx: 2 },
  //   // {word:"스티커", idx:3}
  // ];

  // const bGs = [
  //   { bgName: "피사의 사탑", src: "/src/assets/img/bg1.jpg" },
  //   { bgName: "싸움수준", src: "/src/assets/img/bg2.jpg" },
  //   { bgName: "러쉬모어 산", src: "/src/assets/img/bg3.jpg" },
  //   { bgName: "다크로드", src: "/src/assets/img/bg4.png" },
  //   { bgName: "절-벽", src: "/src/assets/img/cliff.png" },
  //   { bgName: "문호텔어스뷰", src: "/src/assets/img/earth.jpg" },
  //   { bgName: "시공조아", src: "/src/assets/img/heroes.jpg" }];

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
          {menu === 1 && (
            <div className="h-full">
              <UserList
                user={user}/>
            </div>
          )}
          {menu === 2 && (
            <div className="h-full">
              배경 변경하기
              {bgList.map((bg) => (
                <BgCard bgName="gdgd" key={bg.id} bgSrc={bg.objectName} user={user}/>
              ))}
            </div>
          )}
          {menu === 3 && <div>대충 스티커</div>}
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
};