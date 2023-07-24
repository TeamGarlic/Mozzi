import TextInput from "@/components/TextInput";
import PropTypes from "prop-types";
import LoginNav from "./LoginNav";

function SignupModal({ signUp, id, pw, pw2 }) {
  return (
    <div className="flex-col w-full h-screen top-0 left-0 bottom-0 right-0 justify-center items-center text-center">
      <LoginNav link="login" />
      <div className="relative w-[calc(50rem)] min-h-[calc(30rem)] flex-col rounded-lg  justify-center items-center text-center mx-auto p-40">
        <div className="w-full h-10">
          <span className=" float-left text-lg">회원가입</span>
        </div>
        <div className="flex-col">
          <TextInput
            type="text"
            placeholder="ID"
            className="border-2 border-b-0"
            {...id}
          />
          <div className=" text-red-600 text-sm text-left">
            불가능한 아이디입니다
          </div>
        </div>
        <div className="flex-col">
          <TextInput
            type="password"
            placeholder="비밀번호"
            className="border-2 border-t-0"
            {...pw}
          />
          <div className="text-red-600 text-sm text-left">
            불가능한 비밀번호입니다
          </div>
        </div>
        <div className="flex-col">
          <TextInput
            type="password"
            placeholder="비밀번호확인"
            className="border-2 border-t-0"
            {...pw2}
          />
          <div className="text-red-600 text-sm text-left">
            비밀번호가 틀립니다
          </div>
        </div>
        <button type="button" onClick={signUp} className=" mt-10">
          회원가입
        </button>
      </div>
    </div>
  );
}

export default SignupModal;

SignupModal.propTypes = {
  signUp: PropTypes.func.isRequired,
  id:PropTypes.shape({
    value:PropTypes.string,
    onChange:PropTypes.func,
    reset:PropTypes.func
  }),
  pw:PropTypes.shape({
    value:PropTypes.string,
    onChange:PropTypes.func,
    reset:PropTypes.func
  }),
  pw2:PropTypes.shape({
    value:PropTypes.string,
    onChange:PropTypes.func,
    reset:PropTypes.func
  })
};
