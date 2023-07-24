import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import TextInput from "@/components/TextInput.jsx";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar";
import { useEffect } from "react";

function ModifyUser() {
  const { user } = useUser();

  useEffect(() => {
    user ? console.log(user.name) : alert("로그인해주세요");
  }, [user]);
  const newID = useInput();
  const newPW = useInput();
  const newPW2 = useInput();
  const newNick = useInput();

  return (
    <Layout>
      <>
        <NavBar user={user} />
        <div className="relative w-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto pt-60">
          <div className="w-full h-10">
            <span className=" float-left text-lg">회원정보수정</span>
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="ID" {...newID} />
          </div>
          <div className="flex">
            <TextInput type="password" placeholder="비밀번호" {...newPW} />
          </div>
          <div className="flex">
            <TextInput
              type="password"
              placeholder="비밀번호 확인"
              {...newPW2}
            />
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="닉네임" {...newNick} />
          </div>
          <div className="flex pt-10">
            <button
              type="button"
              className="w-1/2 h-12 leading-3 rounded-s-2xl bg-yellow-300"
            >
              정보 수정
            </button>
            <button
              type="button"
              className="w-1/2 h-12 leading-3 rounded-e-2xl bg-red-400"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default ModifyUser;
