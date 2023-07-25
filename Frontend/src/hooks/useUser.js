import { useState, useEffect } from "react";
import userApi from "@/api/userApi";

function useUser(initialState = "dummy user") {
  const [user, setUser] = useState(initialState);
  const accessToken = localStorage.getItem("accessToken");

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
      console.log("user Error");
      setUser("Error User");
    }
  }, [accessToken]);

  return { user };
}

export default useUser;
