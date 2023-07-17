import Api from "./api";

// 유저 인증, 정보 관련 API
const userApi = {
  logIn: async (id, pwd) => {
    const res = await Api.post(
      "login",
      {
        id,
        pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
  logOut: async (id, pwd) => {
    const res = await Api.post(
      "logout",
      {
        id,
        pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
  signUp: async (id, pwd) => {
    const res = await Api.post(
      "signup",
      {
        id,
        pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
  signOut: async (id, pwd) => {
    const res = await Api.post(
      "signout",
      {
        id,
        pwd,
      },
      { withCredentials: true }
    );
    return res;
  },
  reIssue: async (accessToken, refreshToken) => {
    console.log("reissue start");
    let res = await Api.post(
      "user/reissue",
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
};

export default userApi;
