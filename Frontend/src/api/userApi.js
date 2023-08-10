import axios from "axios";

const PublicUserApi = axios.create({
  baseURL: "https://api.mozzi.lol/users",
  headers: {
    "Content-Type": "application/json",
  },
});

const PrivateUserApi = axios.create({
  baseURL: "https://api.mozzi.lol/users",
  headers: {
    "Content-Type": "application/json",
    Authorization: window.localStorage.getItem("accessToken"),
  },
});

PrivateUserApi.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  config.headers.Authorization = token;
  return config;
});

PrivateUserApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const { config } = error;

      const originRequest = config;
      try {
        const tokenResponse = await userApi.reIssue();
        if (tokenResponse.status === 200) {
          const newAccessToken = tokenResponse.data.data.accessToken;
          localStorage.setItem(
              "accessToken",
              tokenResponse.data.data.accessToken
          );
          localStorage.setItem(
              "refreshToken",
              tokenResponse.data.data.refreshToken
          );
          PrivateUserApi.defaults.headers.common["Authorization"] =
              newAccessToken;
          PrivateUserApi.defaults.headers["Authorization"] = newAccessToken;
          originRequest.headers["Authorization"] = newAccessToken;
          let res = await axios(originRequest);
          return res;
        } else {
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.location.replace("/");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          window.localStorage.removeItem("accessToken");
          window.localStorage.removeItem("refreshToken");
          window.location.replace("/");
        }
      }
    }
);

const userApi = {
  checkId: async (id) => {
    const res = await PublicUserApi.get(`check-login-id?userId=${id}`);
    return res;
  },

  logIn: async (id, pwd) => {
    const res = await PublicUserApi.post("login", {
      userId: id,
      password: pwd,
    });
    return res;
  },

  logOut: async () => {
    const res = await PrivateUserApi.get("logout");
    return res;
  },

  signUp: async (id, pwd, nickname, email) => {
    const res = await PublicUserApi.post("register", {
      userId: id,
      nickname: nickname,
      email: email,
      password: pwd,
    });
    return res;
  },

  reIssue: async () => {
    let res = await PublicUserApi.post("reissue", {
      accessToken: window.localStorage.getItem("accessToken"),
      refreshToken: window.localStorage.getItem("refreshToken"),
    });
    return res;
  },

  getUser: async () => {
    if (!window.localStorage.getItem("accessToken")) return;
    let res = await PrivateUserApi.get("");
    console.log(res);
    return res;
  },

  modify:async(pwd, nickname, email)=>{
    let template = {
      accessToken : window.localStorage.getItem("accessToken"),
    }

    if(pwd !== ""){
      template = {...template, password : pwd,}
    }

    if(nickname !== ""){
      template = {...template, nickname:nickname,}
    }

    if(email !== ""){
      template = {...template, email:email,}
    }

    console.log(template);

    let res = await PublicUserApi.patch("",template);
    return res;
  },

  reset:async(userId)=>{
    let res = await PublicUserApi.post("reset",{
      userId : userId
    })
    console.log(res);
    return res;
  },

  signOut:async()=>{

  }
};

export default userApi;
