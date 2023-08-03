import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import TextInput from "@/components/TextInput.jsx";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "@/api/userApi";

function ModifyUser() {
  const [user, setUser] = useState();
  const [msg , setMsg] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function getUser(){
      await userApi.getUser().then(res=>{
        if(res.data.data){
          setUser(res.data.data);
          console.log(res.data.data)
        }else{
          alert('로그인해주세요!');
          navigate('/');
        }
      });
    }

    getUser();
  }, []);
  const newID = useInput();
  const newPW = useInput();
  const newPW2 = useInput();
  const newNick = useInput();

  return (
    <Layout>
      {user ? <>
        <NavBar user={user} />
        <div className="relative w-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto pt-60">
          <div className="w-full h-10">
            <span className=" float-left text-lg">회원정보수정</span>
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="ID" {...newID} value={user.userId} readOnly={true}/>
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
            <TextInput type="text" placeholder="닉네임" {...newNick} value={user.userNickname}/>
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
      </> : <div className="justify-center items-start w-fit h-screen m-auto">Loading...</div>}
    </Layout>
  );
}

export default ModifyUser;
