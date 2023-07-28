import { useState } from "react";
import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";
import userApi from "@/api/userApi";

function SignUp() {
  const id = useInput();
  const idRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{4,16}$/;
  const email = useInput();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const pw = useInput();
  const pwRegex =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-=_+])[a-z\d!@#$%^&*()-=_+]{8,16}$/;
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
      setIdComment("사용 불가능한 ID입니다.");
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
      setIdComment("중복된 ID입니다.");
      return;
    }
    setIdValid(true);
    setIdComment("사용 가능한 ID입니다.");
  }

  function checkEmail() {
    if (!emailRegex.test(email.value)) {
      setEmailValid(false);
      setEmailComment("사용 불가능한 이메일입니다.");
      return;
    }
    setEmailValid(true);
    setEmailComment("사용 가능한 이메일입니다.");
  }

  function checkPw() {
    if (!pwRegex.test(pw.value)) {
      setPwValid(false);
      setPwComment("사용 불가능한 비밀번호입니다.");
      return;
    }
    setPwValid(true);
    setPwComment("사용 가능한 비밀번호입니다.");
  }

  function checkPw2() {
    if (!pwRegex.test(pw2.value)) {
      setPw2Valid(false);
      setPw2Comment("비밀번호 형식이 틀립니다.");
      return;
    } else if (pw2.value !== pw.value) {
      setPw2Valid(false);
      setPw2Comment("비밀번호와 다릅니다.");
      return;
    }
    setPw2Valid(true);
    setPw2Comment("사용 가능합니다.");
  }

  function checkNick() {
    if (!nickRegex.test(nickname.value)) {
      setNickValid(false);
      setNickComment("사용 불가능한 닉네임입니다.");
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

  return (
    <Layout>
      <>
        <LoginNav link="login" />
        <div className="relative w-[calc(30rem)] min-h-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto pt-60">
          <div className="w-full h-10">
            <span className=" float-left text-lg">회원가입</span>
          </div>
          <div className="flex-col">
            <TextInput type="text" placeholder="ID" {...id} onBlur={checkId} />
            <div className=" text-red-600 text-sm text-left">{idComment}</div>
          </div>
          <div className="flex-col">
            <TextInput
              type="text"
              placeholder="Email"
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
              placeholder="비밀번호확인"
              {...pw2}
              onBlur={checkPw2}
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
