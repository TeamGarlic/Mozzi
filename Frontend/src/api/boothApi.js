import axios from "axios";

// booth api axios 객체
const BoothApi = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  }
});


const boothApi = {
  createBooth: async (customSessionId) => {
    const res = await BoothApi.post(
      "",
      {
          customSessionId,
      },
      {withCredentials: true},
    );
    return res;
  },
  joinBooth: async (sessionId) => {
    const res = await BoothApi.get(
      `${sessionId}`,
      {withCredentials: true}
    );
    return res;
  },
  getBackground: async (pageNumber= 1) => {
    const res = await BoothApi.get(
      `backgrounds?pageNum=${pageNumber}`,
      {withCredentials: true}
    )
  },
}

export default boothApi;