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
    Authorization : window.localStorage.getItem("accessToken")
  },
});

PrivateUserApi.interceptors.request.use((config)=>{
  console.log("req interceptor : user")
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = token;
  return config;
  }
)

PrivateUserApi.interceptors.response.use(
  response=>{
    return response;
  },
  async(error)=>{
    const{
      config,
      response:{status},
    } = error;

    if(status !== 200){
      const originRequest = config;
        try {
          const tokenResponse = await userApi.reIssue();
          if (tokenResponse.status === 200) {
            const newAccessToken = tokenResponse.data.accessToken;
            localStorage.setItem('accessToken', tokenResponse.data.accessToken);
            localStorage.setItem(
              'refreshToken',
              tokenResponse.data.refreshToken,
            );
            axios.defaults.headers.common.Authorization = newAccessToken;
            originRequest.headers.Authorization = newAccessToken;
            return axios(originRequest);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
              alert("세션 만료. 다시 로그인해 주세요");
              window.location.replace('/login');
          }
        }
    }
  }
)

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
    alert("reissue start");
    let res = await PublicUserApi.post(
      "reissue",
      {
        accessToken: window.localStorage.getItem('accessToken'),
        refreshToken:  window.localStorage.getItem('refreshToken'),
      },
    );
    alert("reissue complete");
    return res;
  },

  getUser: async () => {
    if (!window.localStorage.getItem("accessToken")) return;
    let res = await PrivateUserApi.get("");
    return res;
  },
};

export default userApi;
