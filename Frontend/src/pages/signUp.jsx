import { useState } from "react";
import Layout from "@/components/Layout";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";

function SignUp() {
  const id = useInput();
  const idRegex = /^(?=.*[a-z])(?=.*\d)[a-z\d]{8,16}$/;
  const pw = useInput();
  const pwRegex =
    /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()-=_+])[a-z\d!@#$%^&*()-=_+]{8,16}$/;
  const pw2 = useInput();
  const [idValid, setIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [pw2Valid, setPw2Valid] = useState(false);

  function checkId() {
    setIdValid(false);
    if (!idRegex.test(id.value)) {
      setIdValid(false);
      return;
    }
    setIdValid(true);
  }

  function checkPw() {
    setPwValid(false);
    if (!pwRegex.test(pw.value)) {
      setPwValid(false);
      return;
    }
    setPwValid(true);
  }

  function checkPw2() {
    setPw2Valid(false);
    if (!pwRegex.test(pw2.value)) {
      setPw2Valid(false);
      return;
    }
    setPw2Valid(true);
  }

  function sign() {
    if (!(idValid && pwValid && pw2Valid)) {
      alert("형식을 확인해 주세요.");
      return;
    } else if (pw.value !== pw2.value) {
      alert("비밀번호 확인이 틀립니다.");
      return;
    }

    alert(`id : ${id.value}, pw : ${pw.value}, pw2 : ${pw2.value}`);
    id.reset();
    pw.reset();
    pw2.reset();
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
            <div className=" text-red-600 text-sm text-left">
              {idValid.toString()}
            </div>
          </div>
          <div className="flex-col">
            <TextInput
              type="password"
              placeholder="비밀번호"
              {...pw}
              onBlur={checkPw}
            />
            <div className="text-red-600 text-sm text-left">
              {pwValid.toString()}
            </div>
          </div>
          <div className="flex-col">
            <TextInput
              type="password"
              placeholder="비밀번호확인"
              {...pw2}
              onBlur={checkPw2}
            />
            <div className="text-red-600 text-sm text-left">
              {pw2Valid.toString()}
            </div>
          </div>
          <button
            type="button"
            onClick={sign}
            className="w-80 h-12 leading-3 rounded-2xl mt-20 border border-slate-600"
          >
            회원가입
          </button>
        </div>
        {/*</div>*/}
      </>
    </Layout>
  );
}

export default SignUp;
