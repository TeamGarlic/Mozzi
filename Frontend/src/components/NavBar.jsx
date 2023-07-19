import { useEffect, useState } from "react";

function NavBar() {
  const [user, setUser] = useState(null);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    setUser(null);
  }, []);

  function goLogin() {
    location.href = "/login";
  }
  function goHome() {
    location.href = "/";
  }

  function showMenu() {
    setMenu(!menu);
  }

  return (
    <div className="fixed w-screen top-0 p-4 px-8 h-14">
      <button className="float-left" onClick={goHome}>
        logo
      </button>
      {user ? (
        <div className=" float-right flex-col">
          <button onClick={showMenu} className=" float-right">
            {user.name}
          </button>
          {menu && (
            <ul className="mt-10 border-4 rounded-lg p-4">
              <li className=" my-2">마이페이지</li>
              <li className=" my-2">내정보수정</li>
              <li className=" my-2">로그아웃</li>
            </ul>
          )}
        </div>
      ) : (
        <button className="float-right" onClick={goLogin}>
          login
        </button>
      )}
    </div>
  );
}

export default NavBar;
