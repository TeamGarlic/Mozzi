import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import mozzilogo from "@/assets/img/mozzi.png";
import userApi from "@/api/userApi";

function NavBar({ user }) {
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  function goLogin() {
    navigate("/login");
  }
  function goHome() {
    navigate("/");
  }

  function showMenu() {
    setMenu(!menu);
  }

  async function logOut() {
    let res = await userApi.logOut();
    console.log(res);
    if(res.status ===200){
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("refreshToken");
      alert("로그아웃되었습니다!");
      location.href = "/";
    }
  }

  return (
      <div className="fixed w-screen top-0 p-4 px-8 h-fit">
        <img
            src={mozzilogo}
            className=" float-left w-20 h-20 hover:cursor-pointer"
            onClick={goHome}
        />
        {user ? (
            <div className=" float-right flex-col z-10 relative">
              <div
                  onClick={showMenu}
                  className="flex float-right leading-[calc(2rem)] break-keep"
              >
                {user.userNickname} 님
              </div>
              {menu && (
                  <ul className="mt-10 w-[calc(8rem)] absolute right-0 px-4 border-4 rounded-lg z-10 bg-purple-200 items-center justify-center text-center">
                    <li className=" my-2 z-10">
                      <Link to={`/mypage`}>마이페이지</Link>
                    </li>
                    <li className=" my-2 z-10">
                      <Link to="/modify">내정보수정</Link>
                    </li>
                    <li className=" my-2 hover:cursor-pointer z-10" onClick={logOut}>
                      로그아웃
                    </li>
                  </ul>
              )}
            </div>
        ) : (
            <button
                className="float-right  leading-[calc(1.875rem)]"
                onClick={goLogin}
            >
              로그인
            </button>
        )}
      </div>
  );
}

export default NavBar;

NavBar.dafaultProps = {
  user: null,
};

NavBar.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
  }),
};
