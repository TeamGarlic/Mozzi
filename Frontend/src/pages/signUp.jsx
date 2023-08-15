import { useState } from "react";
import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";
import userApi from "@/api/userApi";
import {useNavigate} from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();
  const id = useInput();
  const idRegex = /^[a-z\d]{4,16}$/;
  const email = useInput();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const pw = useInput();
  const pwRegex =
    /^[A-Za-z\d!@#$%^&*()-=_+]{8,16}$/;
  const pw2 = useInput();
  const nickname = useInput();
  const nickRegex = /^(?!\s)(?!.*\s{2})\S{2,16}$/;
  const [idValid, setIdValid] = useState(false);
  const [idComment, setIdComment] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [emailComment, setEmailComment] = useState("");
  const [pwValid, setPwValid] = useState(false);
  const [pwComment, setPwComment] = useState("");
  const [pw2Valid, setPw2Valid] = useState(false);
  const [pw2Comment, setPw2Comment] = useState("");
  const [nickValid, setNickValid] = useState(false);
  const [nickComment, setNickComment] = useState("");

  async function checkId() {
    if (!idRegex.test(id.value)) {
      setIdValid(false);
      setIdComment("알파벳 소문자와 숫자로 이루어진 4~16자의 아이디를 입력하세요.");
      return;
    }
    let res = await userApi.checkId(id.value);
    console.log(res);
    const {
      data: {
        data: { result },
      },
    } = res;
    console.log(result);
    if (!result) {
      setIdValid(false);
      setIdComment("이미 사용 중인 ID입니다.");
      return;
    }
    setIdValid(true);
    setIdComment("사용 가능한 ID입니다.");
  }

  function checkEmail() {
    if (!emailRegex.test(email.value)) {
      setEmailValid(false);
      setEmailComment("올바른 형식의 이메일을 입력하세요.");
      return;
    }
    setEmailValid(true);
    setEmailComment("사용 가능한 이메일입니다.");
  }

  function checkPw() {
    if (!pwRegex.test(pw.value)) {
      setPwValid(false);
      setPwComment("숫자, 알파벳 또는 특수문자로 이루어진 8~16자의 비밀번호를 입력하세요.");
      return;
    }
    setPwValid(true);
    setPwComment("사용 가능한 비밀번호입니다.");
  }

  function checkPw2() {
    if (pw2.value !== pw.value) {
      setPw2Valid(false);
      setPw2Comment("비밀번호가 일치하지 않습니다.");
      return;
    }
    setPw2Valid(true);
    setPw2Comment("비밀번호가 일치합니다");
  }

  function checkNick() {
    if (!nickRegex.test(nickname.value)) {
      setNickValid(false);
      setNickComment("띄어쓰기 없이 2~16자의 닉네임을 입력하세요.");
      return;
    }
    setNickValid(true);
    setNickComment("사용 가능한 닉네임입니다.");
  }

  async function sign() {
    if (!(idValid && emailValid && pwValid && pw2Valid && nickValid)) {
      alert("형식을 확인해 주세요.");
      return;
    } else if (pw.value !== pw2.value) {
      alert("비밀번호 확인이 틀립니다.");
      return;
    }

    alert(
      `id : ${id.value}, email : ${email.value}, pw : ${pw.value}, nick : ${nickname.value}`
    );

    let res = await userApi.signUp(
      id.value,
      pw.value,
      nickname.value,
      email.value
    );

    console.log(res);

    if (res.status === 201) {
      alert("회원가입 완료!");
      location.href = "/";
    } else alert("오류가 발생했습니다.");

    id.reset();
    email.reset();
    pw.reset();
    pw2.reset();
    nickname.reset();
  }

  const activeEnter = (e) => {
    if(e.key === "Enter") {
      sign();
    }
  }

  return (
    <Layout>
      <>
        <LoginNav link="login" />
        <div className="relative w-[calc(30rem)] min-h-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto pt-60">
          <div className="w-full h-10">
            <span className=" float-left text-lg">회원가입</span>
            <span className=" float-right text-sm text-slate-600 hover:cursor-pointer hover:text-blue-500" onClick={()=>navigate("/login")}>
              이미 가입하셨나요?
            </span>
          </div>
          <div className="flex-col">
            <TextInput type="text" placeholder="아이디" {...id} onBlur={checkId} />
            <div className=" text-red-600 text-sm text-left">{idComment}</div>
          </div>
          <div className="flex-col">
            <TextInput
              type="text"
              placeholder="이메일"
              {...email}
              onBlur={checkEmail}
            />
            <div className=" text-red-600 text-sm text-left">
              {emailComment}
            </div>
          </div>
          <div className="flex-col">
            <TextInput
              type="text"
              placeholder="닉네임"
              {...nickname}
              onBlur={checkNick}
            />
            <div className="text-red-600 text-sm text-left">{nickComment}</div>
          </div>
          <div className="flex-col">
            <TextInput
              type="password"
              placeholder="비밀번호"
              {...pw}
              onBlur={checkPw}
            />
            <div className="text-red-600 text-sm text-left">{pwComment}</div>
          </div>
          <div className="flex-col">
            <TextInput
              type="password"
              placeholder="비밀번호 확인"
              {...pw2}
              onBlur={checkPw2}
              onKeyDown={activeEnter}
            />
            <div className="text-red-600 text-sm text-left">{pw2Comment}</div>
          </div>
          <button
            type="button"
            onClick={sign}
            className="w-80 h-12 leading-3 rounded-2xl mt-10 border bg-blue-400"
          >
            회원가입
          </button>
        </div>
      </>
    </Layout>
  );
}

export default SignUp;
