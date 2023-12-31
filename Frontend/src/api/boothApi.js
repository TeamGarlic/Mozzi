import axios from "axios";
import userApi from "@/api/userApi.js";
import baseURL from "@/api/BaseURL.js";

const PublicBoothApi = axios.create({
  baseURL: `${baseURL}/sessions`,
  headers: {
    "Content-Type": "application/json",
  },
});

const PrivateBoothApi = axios.create({
  baseURL: `${baseURL}/sessions`,
  config: {
    headers: {
      "Content-Type": "application/json",
      Authorization: window.sessionStorage.getItem("accessToken"),
    },
  },
});

const ClipApi = axios.create({
  baseURL: `${baseURL}/sessions`,
});

PrivateBoothApi.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem("accessToken");
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
        sessionStorage.setItem(
          "accessToken",
          tokenResponse.data.data.accessToken
        );
        sessionStorage.setItem(
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
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");
        window.location.replace("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        window.sessionStorage.removeItem("accessToken");
        window.sessionStorage.removeItem("refreshToken");
        window.location.replace("/");
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
    const res = await PrivateBoothApi.post(`connections`, {
      sessionId: sessionID,
    });
    return res;
  },

  getBackground: async (pageNumber = 1) => {
    const res = await PublicBoothApi.get(`backgrounds?pageNum=${pageNumber}`);
    return res;
  },

  closeBooth: async (shareCode) => {
    const res = await PublicBoothApi.get(
      `close?shareCode=${shareCode}`,
      {
        headers:{
          Authorization:window.sessionStorage.getItem("accessToken"),
        }
      }
    )
    return res
  },

  uploadClip: async (fileName, shareCode, file) => {
    const res = await ClipApi.post(
      "file",
      {
        shareCode: shareCode,
        fileName: fileName,
        file: file
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: window.sessionStorage.getItem("accessToken"),
        },
      }
    )
    return res
  },

  downloadClip: async (fileName, shareSecret, shareCode) => {
    const res = await ClipApi.get(
      "file",
      {
        headers: {
          "Content-Type": "application/json",
          shareSecret: shareSecret
        },
        params: {
          shareCode: shareCode,
          fileName: fileName
        }
      },

    )
    return res
  },

  destroyBooth:async(sessionId)=>{
    let res = await PublicBoothApi.delete(`${sessionId}`,{});
    return res;
  }
};

export default boothApi;
