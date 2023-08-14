import axios from "axios";

const PublicFileApi = axios.create({
  baseURL: "https://api.mozzi.lol/files",
  headers: {
    "Content-Type": "application/json",
  },
});

const PrivateFileApi = axios.create({
  baseURL: "https://api.mozzi.lol/files",
  headers: {
    "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
    Authorization : window.sessionStorage.getItem("accessToken")
  },
});

PrivateFileApi.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem("accessToken");
  config.headers.Authorization = token;
  return config;
});

const fileApi = {
  saveClip: async (file, title, width, height) => {
    const res = await PrivateFileApi.post(
      "mozziroll/upload",
      {
        file: file,
        title: title,
        width: width,
        height: height,
      }
    );
    return res;
  },

  downloadClip: async (id) => {
    const res = await PublicFileApi.get(
      `object/${id}`,
    );
    return res;
  }
};

export default fileApi;
