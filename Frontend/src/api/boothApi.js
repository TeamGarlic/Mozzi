import axios from "axios";
import userApi from "@/api/userApi.js";

// booth api axios 객체
const PublicBoothApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "https://api.mozzi.lol/sessions",
  headers: {
    "Content-Type": "application/json",
  },
});

const PrivateBoothApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "https://api.mozzi.lol/sessions",
  config:{
    headers: {
      "Content-Type": "application/json",
      Authorization : window.localStorage.getItem("accessToken"),
    },
  }
});

PrivateBoothApi.interceptors.request.use((config)=>{
  console.log("req interceptor : booth")
  const token = localStorage.getItem('accessToken');
  config.headers.Authorization = token;
  return config;
  }
)

PrivateBoothApi.interceptors.response.use(
  response=>{
    return response;
  },
  async(error)=>{
    console.log(error)
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
              // window.location.replace('/login');
          }
        }
    }
  }
)

const boothApi = {
  createBooth: async () => {
    let res = await PrivateBoothApi.post("",{});
    return res;
  }, // 완

  getSessionID: async (shareCode) => {
    const res = await PublicBoothApi.get(`${shareCode}`);
    return res;
  },

  getToken: async (sessionID) => {
    const res = await PublicBoothApi.post(`connections`, {
      "sessionId" : sessionID,
    });
    return res;
  },

  getBackground: async (pageNumber = 1) => {
    const res = await PublicBoothApi.get(`backgrounds?pageNum=${pageNumber}`);
    return res;
  },
};

export default boothApi;
