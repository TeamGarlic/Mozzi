import { useState, useEffect } from "react";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";

function useUser(initialState = null) {
  const [user, setUser] = useState(initialState);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    async function getUser() {
      let res = await userApi.getUser(accessToken);
      console.log(res.status);
      return res;
    }
    let res = getUser();
    if (res.status === 200) {
      setUser(res.data);
      console.log("200 complete");
    } else {
      console.log("no user");
    }
  }, [accessToken]);

  async function checkUser() {
    if (!user) {
      let guest = prompt("이름을 입력하세요", "GUEST");
      if (!guest) {
        alert("메인 화면으로 돌아갑니다.");
        navigate("/");
      }
      await setUser(guest);
    }
  }

  return { user, setUser, checkUser };
}

export default useUser;
