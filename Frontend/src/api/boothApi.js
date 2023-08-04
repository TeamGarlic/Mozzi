import axios from "axios";
import userApi from "@/api/userApi.js";

const PublicBoothApi = axios.create({
  baseURL: "https://api.mozzi.lol/sessions",
  headers: {
    "Content-Type": "application/json",
  },
});

const PrivateBoothApi = axios.create({
  baseURL: "https://mozzi.ssafy.life/sessions",
  config: {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.localStorage.getItem("accessToken"),
    },
  },
});

PrivateBoothApi.interceptors.request.use((config) => {
  const token = window.localStorage.getItem("accessToken");
  config.headers.Authorization = token;
  return config;
});

PrivateBoothApi.interceptors.response.use(
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
        PrivateBoothApi.defaults.headers.common["Authorization"] =
          newAccessToken;
        PrivateBoothApi.defaults.headers["Authorization"] = newAccessToken;
        originRequest.headers["Authorization"] = newAccessToken;
        let res = await axios(originRequest);
        return res;
      } else {
        alert("세션 만료. 다시 로그인해 주세요");
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.location.replace("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert("세션 만료. 다시 로그인해 주세요");
        window.localStorage.removeItem("accessToken");
        window.localStorage.removeItem("refreshToken");
        window.location.replace("/login");
      }
    }
  }
);

const boothApi = {
  createBooth: async () => {
    let res = await PrivateBoothApi.post("", {});
    return res;
  },

  getSessionID: async (shareCode) => {
    const res = await PublicBoothApi.get(`${shareCode}`);
    return res;
  },

  getToken: async (sessionID) => {
    const res = await PublicBoothApi.post(`connections`, {
      sessionId: sessionID,
    });
    return res;
  },

  getBackground: async (pageNumber = 1) => {
    const res = await PublicBoothApi.get(`backgrounds?pageNum=${pageNumber}`);
    return res;
  },
};

export default boothApi;
