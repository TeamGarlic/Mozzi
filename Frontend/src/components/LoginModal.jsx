import TextInput from "@/components/TextInput";
import PropTypes from "prop-types";
import LoginNav from "./LoginNav";

function LoginModal({ logIn }) {
  return (
    <div className="fixed flex-col w-full h-screen top-0 left-0 bottom-0 right-0 justify-center items-center text-center">
      <LoginNav link="signup" />
      <div className="w-[calc(50rem)] min-h-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto p-40">
        <div className="w-full h-10">
          <span className=" float-left text-lg">로그인</span>
          <span className=" float-right text-sm text-slate-600">
            비밀번호를 잊으셨나요?
          </span>
        </div>
        <div className="flex">
          <TextInput type="text" placeholder="ID" />
        </div>
        <div className="flex">
          <TextInput type="password" placeholder="비밀번호" />
        </div>
        <button type="button" onClick={logIn} className=" mt-20">
          로그인
        </button>
      </div>
    </div>
  );
}

export default LoginModal;

LoginModal.propTypes = {
  logIn: PropTypes.func.isRequired,
};
