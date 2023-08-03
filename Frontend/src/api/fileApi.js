import axios from "axios";

const FileApi = axios.create({
  baseURL: "https://api.mozzi.lol/items",
  headers: {
    "Content-Type": "application/json",
  },
});

const fileApi = {
  getBgList: async (pageNum=1, pageSize=10) => {
    const res = await FileApi.get(
      `backgrounds?pageNum=${pageNum}&pageSize=${pageSize}`,
    );
    return res;
  },

  getFrameList: async () => {
    const res = await FileApi.get(
      `frames`,
    );
    return res;
  },
};

export default fileApi;
