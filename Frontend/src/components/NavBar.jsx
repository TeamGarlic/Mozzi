import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function NavBar({ user }) {
  // const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();
  // useEffect(() => {
  //   setUser(null);
  // }, []);

  function goLogin() {
    navigate("/login");
  }
  function goHome() {
    navigate("/");
  }

  function showMenu() {
    setMenu(!menu);
  }

  function logOut() {
    localStorage.removeItem("accessToken");
    alert("로그아웃되었습니다!");
    navigate("/");
  }

  return (
    <div className="fixed w-screen top-0 p-4 px-8 h-fit">
      <img
        src="/src/assets/img/mozzi.png"
        className=" float-left w-20 h-20 hover:cursor-pointer"
        onClick={goHome}
      />
      {user.name ? (
        <div className=" float-right flex-col">
          <button
            onClick={showMenu}
            className=" float-right leading-[calc(1.875rem)]"
          >
            {user.name}
          </button>
          {menu && (
            <ul className="mt-10 border-4 rounded-lg p-4">
              <li className=" my-2">
                <Link to={`/mypage/${user.name}`}>마이페이지</Link>
              </li>
              <li className=" my-2">
                <Link to="/modify">내정보수정</Link>
              </li>
              <li className=" my-2 hover:cursor-pointer" onClick={logOut}>
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
          login
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
    name: PropTypes.string,
  }),
};
