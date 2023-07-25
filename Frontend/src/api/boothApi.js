import axios from "axios";

// booth api axios 객체
const BoothApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "http://localhost:8080/sessions",
});

const boothApi = {
  startConnect: async () => {
    const res = await BoothApi.post("connections");
    return res;
  },

  createBooth: async (accessToken) => {
    const res = await BoothApi.post("", {
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
      },
    });
    return res;
  }, // 완

  joinBooth: async (sessionId) => {
    const res = await BoothApi.get(`/${sessionId}`, { withCredentials: true });
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
