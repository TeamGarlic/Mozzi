import { useState } from "react";
import { Card } from "@material-tailwind/react";
import UserCard from "./UserCard";
import BgCard from "./BgCard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";

export default function PicSideBar() {
  // const buttons = [
  //   { word: "사용자", idx: 1 },
  //   { word: "배경", idx: 2 },
  //   // {word:"스티커", idx:3}
  // ];

  const bGs = [{ bgName: "산" }, { bgName: "바다" }, { bgName: "우주" }];

  const objItems = [
    { item: "🦜", name: "Parrot" },
    { item: "🦖", name: "Dinosaur" },
    { item: "🦆", name: "Duck" },
    { item: "🦔", name: "Porkypine" },
    { item: "🐤", name: "Chick" },
    { item: "🐧", name: "Penguin" },
    { item: "🦜", name: "Parrot" },
    { item: "🦖", name: "Dinosaur" },
    { item: "🦆", name: "Duck" },
    { item: "🦔", name: "Porkypine" },
    { item: "🐤", name: "Chick" },
    { item: "🐧", name: "Penguin" },
  ];

  const [menu, setMenu] = useState(0);

  return (
    <div className="fixed z-10 top-0 right-0">
      <div className="flex">
        <div className="flex flex-col float-right gap-3 p-4">
          {/* {buttons.map((btn) => (
            <button
              type="button"
              onClick={() => (menu === btn.idx ? setMenu(0) : setMenu(btn.idx))}
              key={btn.word}
            >
              {btn.word}
            </button>
          ))} */}
          <div className=" w-10 h-10">
            <UsersIcon onClick={() => (menu === 1 ? setMenu(0) : setMenu(1))} />
          </div>
          <div className=" w-10 h-10">
            <ComputerDesktopIcon
              onClick={() => (menu === 2 ? setMenu(0) : setMenu(2))}
            />
          </div>
        </div>
        <Card
          id="sideMenu"
          className={`h-screen w-[calc(16rem)] shadow-xl shadow-blue-gray-900/5 p-4 overflow-y-scroll bg-white scrollbar-hide rounded-e-none ${
            menu === 0 ? "hidden" : ""
          }`}
        >
          {menu === 1 && (
            <div className="h-full">
              대충 사용자 목록
              {objItems.map((item, idx) => (
                <UserCard
                  userName={item.name}
                  isHost={idx === 0}
                  key={item.name}
                />
              ))}
            </div>
          )}
          {menu === 2 && (
            <div className="h-full">
              배경 변경하기
              {bGs.map((bg) => (
                <BgCard bgName={bg.bgName} key={bg.bgName} />
              ))}
            </div>
          )}
          {menu === 3 && <div>대충 스티커</div>}
        </Card>
      </div>
    </div>
  );
}
