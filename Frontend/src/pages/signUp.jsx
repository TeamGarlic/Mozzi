import Layout from "@/components/Layout";
// import SignupModal from "@/components/SignupModal";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";

function SignUp() {
  const id = useInput();
  const pw = useInput();
  const pw2 = useInput();
  function sign() {
    alert(`id : ${id.value}, pw : ${pw.value}, pw2 : ${pw2.value}`);
    id.reset();
    pw.reset();
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
            <TextInput type="text" placeholder="ID" {...id} />
            <div className=" text-red-600 text-sm text-left">
              불가능한 아이디입니다
            </div>
          </div>
          <div className="flex-col">
            <TextInput type="password" placeholder="비밀번호" {...pw} />
            <div className="text-red-600 text-sm text-left">
              불가능한 비밀번호입니다
            </div>
          </div>
          <div className="flex-col">
            <TextInput type="password" placeholder="비밀번호확인" {...pw2} />
            <div className="text-red-600 text-sm text-left">
              비밀번호가 틀립니다
            </div>
          </div>
          <button type="button" onClick={sign} className=" mt-10">
            회원가입
          </button>
        </div>
        {/*</div>*/}
      </>
    </Layout>
  );
}

export default SignUp;
