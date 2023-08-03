import axios from "axios";

const BgApi = axios.create({
  baseURL: "/items",
  headers: {
    "Content-Type": "application/json",
  },
});

const bgApi = {
};

export default bgApi;
