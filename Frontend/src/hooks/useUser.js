import { useState, useEffect } from "react";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";

function useUser(initialState = null) {
  const [user, setUser] = useState(initialState);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  async function getUser() {
    let res = await userApi.getUser(accessToken);
    return res;
}

useEffect(() => {
  getUser().then((res)=>{
    if (res&&res.status === 200) {
      const userData = res.data.data
      setUser({
        ...user,
        ...userData,
      });
    }
  });
}, [accessToken]);

async function checkUser() {
    await getUser().then((res)=>{
      if (res&&res.status === 200) {
        const userData = res.data.data
        setUser({
          ...user,
          ...userData,
        });
      } else {
        let guest = prompt("이름을 입력하세요", "GUEST");
        if (!guest) {
          alert("메인 화면으로 돌아갑니다.");
          navigate("/");
        }
        setUser({
          ...user,
          userNickname: guest,
        });
      }
    });
    console.log(user);
  }

  return { user, setUser, checkUser };
}

export default useUser;
