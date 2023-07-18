import { Link } from "react-router-dom";
import { Card } from "@material-tailwind/react";
import UserCard from "./UserCard";
import TextInput from "./TextInput";
import SmallCam from "./SmallCam";

export default function UserSideBar() {
  const users = [
    { name: "홍길동" },
    { name: "박길동" },
    { name: "최길동" },
    { name: "홍길동" },
    { name: "홍길동" },
    { name: "홍길동" },
  ];
  return (
    <Card
      id="sideMenu"
      className="fixed top-0 right-0 w-64 h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-transparent"
    >
      <div className="p-4">
        <span className=" text-xl">사용자</span>
      </div>
      <ul className="gap-4 overflow-y-scroll scrollbar-hide">
        <SmallCam />
        {users.map((user) => (
          <UserCard userName={user.name} key={user.name} />
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
