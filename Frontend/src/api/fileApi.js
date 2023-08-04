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
    Authorization : window.localStorage.getItem("accessToken")
  },
});

const fileApi = {
  saveClip: async (file, title) => {
    const res = await PrivateFileApi.post(
      "mozziroll/upload",
      {
        file: file,
        title: title,
      }
    );
    return res;
  },

  downloadClip: async (id) => {
    const res = await PublicFileApi.get(
      `mozziroll/${id}`,
    );
    return res;
  }
};

export default fileApi;
