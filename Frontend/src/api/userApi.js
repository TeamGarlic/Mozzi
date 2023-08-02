import axios from "axios";

const UserApi = axios.create({
  baseURL: "https://api.mozzi.lol/users",
  headers: {
    "Content-Type": "application/json",
  },
});

// 유저 인증, 정보 관련 API
const userApi = {
  checkId: async (id) => {
    const res = await UserApi.get(`check-login-id?userId=${id}`);
    return res;
  }, //완

  logIn: async (id, pwd) => {
    const res = await UserApi.post("login", {
      userId: id,
      password: pwd,
    });
    return res;
  }, //완

  // logOut: async (id, pwd) => {
  //   const res = await UserApi.post(
  //     "logout",
  //     {
  //       id,
  //       pwd,
  //     },
  //     { withCredentials: true }
  //   );
  //   return res;
  // },
  signUp: async (id, pwd, nickname, email) => {
    const res = await UserApi.post("register", {
      userId: id,
      nickname: nickname,
      email: email,
      password: pwd,
    });
    return res;
  }, // 완

  // signOut: async (id, pwd) => {
  //   const res = await UserApi.post(
  //     "signout",
  //     {
  //       id,
  //       pwd,
  //     },
  //     { withCredentials: true }
  //   );
  //   return res;
  // },
  reIssue: async (accessToken, refreshToken) => {
    alert("reissue start");
    try {
      let res = await UserApi.post(
        "reissue",
        {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        alert("reissue complete");
        window.localStorage.setItem("accessToken", res.data.accessToken);
        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        return;
      }
    } catch {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      alert("세션 만료 : 다시 로그인해 주세요");
      location.href = "/";
    }
  },

  getUser: async () => {
    if (!window.localStorage.getItem("accessToken")) return;
    // console.log("user search");
    let res = await UserApi.get("", {
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("accessToken"),
      },
    });

    if (res.status === 200) {
      // console.log("searched!");
      // console.log(res);
      return res;
    }
    // console.log(res);
    await userApi.reIssue(
      window.localStorage.getItem("accessToken"),
      window.localStorage.getItem("refreshToken")
    );

    res = await UserApi.get("", {
      headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("accessToken"),
      },
    });

    return res;
  },
};

export default userApi;
