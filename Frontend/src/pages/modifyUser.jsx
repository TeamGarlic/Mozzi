import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import TextInput from "@/components/TextInput.jsx";
import NavBar from "@/components/NavBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "@/api/userApi";
import useUser from "@/hooks/useUser.js";

function ModifyUser() {
  const {user} = useUser();
  const [msg , setMsg] = useState("");
  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()-=_+])[A-Za-z\d!@#$%^&*()-=_+]{8,16}$/;
  const nickRegex = /^(?!\s)(?!.*\s{2})\S{2,16}$/;

  const newID = useInput();
  const newPW = useInput();
  const newPW2 = useInput();
  const newNick = useInput();
  const newEmail = useInput();


  async function modify(){
    if(newPW.value !== newPW2.value){
      setMsg("비밀번호가 틀립니다.");
      return;
    }

    if(!(newPW.value.length>0 || newNick.value.length>0 || newEmail.value.length>0) ){
      setMsg("최소 하나의 값을 입력해 주세요.");
      return;
    }

    if(newPW.value.length >0 && !pwRegex.test(newPW.value)){
      setMsg("비밀번호 형식이 틀립니다.");
      return;
    }

    if(newNick.value.length >0 && !nickRegex.test(newNick.value)){
      setMsg("닉네임 형식이 틀립니다.");
      return;
    }

    if(newEmail.value.length >0 && !emailRegex.test(newEmail.value)){
      setMsg("이메일 형식이 틀립니다.");
      return;
    }

    let res = await userApi.modify(newPW.value, newNick.value, newEmail.value);
    console.log(res);

    if(res.status === 200){
      alert("수정 성공했습니다!");
      navigate(("/"));
    }else{
      alert("다시 입력해 주세요");
      newPW.reset();
      newPW2.reset();
      newNick.reset();
      newEmail.reset();
    }
  }

  async function signOut(){
    console.log("탈퇴")
    let confirm = window.confirm("정말 탈퇴하시겠습니까?");
    if(confirm){
        let res = await userApi.signOut();
        console.log(res);
        if(res.status === 200){
         alert("탈퇴 처리되었습니다.");
         window.location.href="/";
        }else{
          alert("요청이 실패했습니다.");
      }
    }
  }

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
            <TextInput type="text" placeholder="닉네임" {...newNick}/>
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="이메일" {...newEmail}/>
          </div>
          <div className="flex">
            <span className="float-left text-red-600">{msg}</span>
          </div>
          <div className="flex pt-10">
            <button
              type="button"
              className="w-1/2 h-12 leading-3 rounded-s-2xl bg-yellow-300"
              onClick={modify}
            >
              정보 수정
            </button>
            <button onClick={signOut}
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
