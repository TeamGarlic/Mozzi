import axios from "axios";
import baseURL from "@/api/BaseURL.js";

const ItemApi = axios.create({
  baseURL: `${baseURL}/items`,
  headers: {
    "Content-Type": "application/json",
  },
});

const itemApi = {
  getBgList: async (pageNum=1, pageSize=10) => {
    const res = await ItemApi.get(
      `backgrounds?pageNum=${pageNum}&pageSize=${pageSize}`,
    );
    return res;
  },

  getFrameList: async () => {
    const res = await ItemApi.get(
      `frames`,
    );
    return res;
  },
};

export default itemApi;
