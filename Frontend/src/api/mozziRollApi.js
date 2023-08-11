import axios from "axios";
import userApi from "@/api/userApi.js";

const PublicMozziRollApi = axios.create({
    baseURL: "https://api.mozzi.lol/mozzirolls",
    headers: {
        "Content-Type": "application/json",
    },
});

const PrivateMozziRollApi = axios.create({
    baseURL: "https://api.mozzi.lol/mozzirolls",
    headers: {
        "Content-Type": "application/json",
        Authorization: window.localStorage.getItem("accessToken"),
    },
});

PrivateMozziRollApi.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("accessToken");
    config.headers.Authorization = token;
    return config;
});

PrivateMozziRollApi.interceptors.response.use(
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
                localStorage.setItem(
                    "accessToken",
                    tokenResponse.data.data.accessToken
                );
                localStorage.setItem(
                    "refreshToken",
                    tokenResponse.data.data.refreshToken
                );
                PrivateMozziRollApi.defaults.headers.common["Authorization"] =
                    newAccessToken;
                PrivateMozziRollApi.defaults.headers["Authorization"] = newAccessToken;
                originRequest.headers["Authorization"] = newAccessToken;
                let res = await axios(originRequest);
                return res;
            } else {
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("refreshToken");
                window.location.replace("/login");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                window.localStorage.removeItem("accessToken");
                window.localStorage.removeItem("refreshToken");
                window.location.replace("/login");
            }
        }
    }
);

const mozziRollApi = {
    getMozziRolls: async (page, size) => {
        if (!window.localStorage.getItem("accessToken")) return;
        let res = await PrivateMozziRollApi.get(``, { pageNum: page, pageSize: size });
        return res;
    },
};

export default mozziRollApi;
