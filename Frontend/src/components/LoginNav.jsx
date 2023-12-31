import PropTypes from "prop-types";
import mozzilogo from "@/assets/img/mozzi.png";

function LoginNav({ link }) {
  function goHome() {
    location.href = "/";
  }
  function goLink() {
    location.href = `/${link}`;
  }
  return (
    <div className="fixed w-screen top-0 p-4 px-8 h-fit">
      <img
        alt = "MOZZI"
        src={mozzilogo}
        className=" float-left w-20 h-20 hover:cursor-pointer"
        onClick={goHome}
      />
      <button className="float-right" onClick={goLink}>
        {(link==='login')?"로그인":"회원가입"}
      </button>
    </div>
  );
}

export default LoginNav;

LoginNav.propTypes = {
  link: PropTypes.string.isRequired,
};
