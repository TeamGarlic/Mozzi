import Layout from "@/components/Layout";
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
          <button
            type="button"
            onClick={login}
            className="w-80 h-12 leading-3 rounded-2xl mt-10 border bg-yellow-300"
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
