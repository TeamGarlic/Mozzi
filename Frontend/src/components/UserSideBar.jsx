import { Link } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import UserCard from "./UserCard";
import TextInput from "./TextInput";

export default function UserSideBar() {
  const users = [{ name: "홍길동" }, { name: "박길동" }, { name: "최길동" }];
  return (
    <Card
      id="sideMenu"
      className="fixed top-0 right-0 h-full p-4 shadow-xl shadow-blue-gray-900/5"
    >
      <div className="mb-2 p-4">
        <Typography variant="h5" color="blue-gray">
          Users
        </Typography>
      </div>
      <ul className="gap-4">
        {users.map((user) => (
          <UserCard userName={user.name} key={user.name} />
        ))}
      </ul>
      <TextInput type="text" placeholder="이름 변경..." />
      <button type="button" className="w-full h-10">
        이름 변경
      </button>
      <Link className="w-full h-10 text-center leading-10" to="/">
        나가기
      </Link>
    </Card>
  );
}
