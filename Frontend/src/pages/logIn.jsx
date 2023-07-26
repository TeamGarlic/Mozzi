import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";
import userApi from "@/api/userApi";
import { useState } from "react";

function LogIn() {
  const [error, setError] = useState("");
  const id = useInput();
  const pw = useInput();

  async function login() {
    console.log(`id : ${id.value}, pw : ${pw.value}`);
    try {
      let res = await userApi.logIn(id.value, pw.value);
      console.log(res);
    } catch (e) {
      const status = e.response.status;
      if (status === 404) {
        setError("존재하지 않는 아이디입니다!");
      } else if (status === 400) {
        setError("로그인에 실패했습니다.");
      } else {
        setError("다시 시도해 주세요.");
      }
    }
    id.reset();
    pw.reset();
  }

  return (
    <Layout>
      <>
        <LoginNav link="signup" />
        <div className="relative w-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto pt-60">
          <div className="w-full h-10">
            <span className=" float-left text-lg">로그인</span>
            <span className=" float-right text-sm text-slate-600">
              비밀번호를 잊으셨나요?
            </span>
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="ID" {...id} />
          </div>
          <div className="flex">
            <TextInput type="password" placeholder="비밀번호" {...pw} />
          </div>
          <span className=" float-left text-sm text-red-500">{error}</span>
          <button
            type="button"
            onClick={login}
            className="w-80 h-12 leading-3 rounded-2xl mt-10 bg-yellow-300"
          >
            로그인
          </button>
        </div>
        {/*</div>*/}
      </>
    </Layout>
  );
}

export default LogIn;
