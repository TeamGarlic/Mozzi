import axios from "axios";

const Api = axios.create({
  // baseUrl : 백엔드 서버 IP
  baseURL: "/",
});

export default Api;
