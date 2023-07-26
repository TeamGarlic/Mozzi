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
    console.log("reissue start");
    let res = await UserApi.post(
      "reissue",
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      { withCredentials: true }
    );

    if (res.status === 201) {
      console.log("reissue complete");
      window.sessionStorage.setItem("accessToken", res.data.accessToken);
      window.sessionStorage.setItem("refreshToken", res.data.refreshToken);
      return;
    }

    window.sessionStorage.removeItem("accessToken");
    window.sessionStorage.removeItem("refreshToken");
    alert("세션 만료 : 다시 로그인해 주세요");
    location.href = "/";
  },

  getUser: async (accessToken) => {
    let res = await UserApi.get("userinfo", {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });
    return res;
  },
};

export default userApi;
