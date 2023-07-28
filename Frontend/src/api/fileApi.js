import axios from "axios";

// 미인증 유저 api axios 객체
const FileApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "/files",
  headers: {
    "Content-Type": "application/json",
  },
});

// 인증 유저 api axios 객체
// const UserAuthApi = axios.create({
//   baseURL: "/",
//   headers: {
//       "Content-Type": "application/json"
//   }
// });

// 유저 인증, 정보 관련 API
const fileApi = {
  checkId: async (id) => {
    const res = await FileApi.get(`check-login-id?userId=${id}`, {
      withCredentials: true,
    });
    return res;
  },

  logIn: async (id, pwd) => {
    const res = await FileApi.post(
      "login",
      {
        userId: id,
        password: pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
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
    const res = await FileApi.post(
      "register",
      {
        userId: id,
        nickname: nickname,
        email: email,
        password: pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
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
    let res = await FileApi.post(
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
    let res = await FileApi.get("", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res;
  },
};

export default fileApi;
