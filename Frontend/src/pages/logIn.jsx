import Layout from "@/components/Layout";
// import LoginModal from "@/components/LoginModal";
import useInput from "@/hooks/useInput.js";
import LoginNav from "@/components/LoginNav.jsx";
import TextInput from "@/components/TextInput.jsx";

function LogIn() {
  const id = useInput();
  const pw = useInput();

  function login() {
    alert(`id : ${id.value}, pw : ${pw.value}`);
    id.reset();
    pw.reset();
  }
  return (
    <Layout>
      <>
      {/*<LoginModal logIn={login} id={id} pw={pw}/>*/}
      {/*<div className="flex-col w-full h-screen top-0 left-0 bottom-0 right-0 justify-center items-center text-center">*/}
        <LoginNav link="signup" />
        <div className="relative w-[calc(50rem)] min-h-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto my-72 px-40">
          <div className="w-full h-10">
            <span className=" float-left text-lg">로그인</span>
            <span className=" float-right text-sm text-slate-600">
            비밀번호를 잊으셨나요?
          </span>
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="ID" {...id}/>
          </div>
          <div className="flex">
            <TextInput type="password" placeholder="비밀번호" {...pw}/>
          </div>
          <button type="button" onClick={login} className=" mt-20">
            로그인
          </button>
        </div>
      {/*</div>*/}
        </>
    </Layout>
  );
}

export default LogIn;
