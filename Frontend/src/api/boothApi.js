import axios from "axios";

// booth api axios 객체
const BoothApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "https://api.mozzi.lol/sessions",
});

const boothApi = {
  createBooth: async (accessToken) => {
    const res = await BoothApi.post(
      "",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
      }
    );
    console.log(res);
    return res;
  }, // 완

  getSessionID: async (shareCode) => {
    const res = await BoothApi.get(`${shareCode}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  },

  getToken: async (sessionID) => {
    const res = await BoothApi.post(`connections`, {
      "sessionId" : sessionID,
    },{
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res;
  },

  getBackground: async (pageNumber = 1) => {
    const res = await BoothApi.get(`backgrounds?pageNum=${pageNumber}`, {
      withCredentials: true,
    });
    return res;
  },
};

export default boothApi;
