import { useState, useEffect } from "react";
import userApi from "@/api/userApi";
import { useNavigate } from "react-router-dom";

function useUser(initialState = {
  // TODO : 테스트용 방장권한 제거
  isHost : 1,
}) {
  const [user, setUser] = useState(initialState);
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  async function getUser() {
    let res = await userApi.getUser(accessToken);
    // console.log(user);
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
        // console.log("200 complete");
      } else {
        // console.log("no user");
      }
      // console.log(res.status);
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
        // console.log("200 complete");
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
      // console.log(res.status);
    });
    console.log(user);
    // if (!user) {
    //   let guest = prompt("이름을 입력하세요", "GUEST");
    //   if (!guest) {
    //     alert("메인 화면으로 돌아갑니다.");
    //     navigate("/");
    //   }
    //   setUser(guest);
    // }
  }

  return { user, setUser, checkUser };
}

export default useUser;
