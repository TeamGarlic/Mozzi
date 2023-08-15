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
        Authorization: window.sessionStorage.getItem("accessToken"),
    },
});

PrivateMozziRollApi.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem("accessToken");
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
                sessionStorage.setItem(
                    "accessToken",
                    tokenResponse.data.data.accessToken
                );
                sessionStorage.setItem(
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
                window.sessionStorage.removeItem("accessToken");
                window.sessionStorage.removeItem("refreshToken");
                window.location.replace("/");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                window.sessionStorage.removeItem("accessToken");
                window.sessionStorage.removeItem("refreshToken");
                window.location.replace("/");
            }
        }
    }
);

const mozziRollApi = {
    getMozziRolls: async (page, size) => {
        let res = await PrivateMozziRollApi.get("",
        {params:
            {pageNum: page, pageSize: size}
        }
            );
        console.log(res);
        return res;
    },

    deleteMozziRolls:async(userMozziRollId)=>{
        let res = await PrivateMozziRollApi.delete(`${userMozziRollId}`);
        return res;
    },

    getCommunityMozziRolls:async(state, pageNum, size)=>{
        let res;
        if(window.sessionStorage.getItem('accessToken')){
            res = await PrivateMozziRollApi.get("popular",{
                params:{
                    sorted:state,
                    pageNum:pageNum,
                    pageSize:size,
                }
            });
        }else{
            res = await PublicMozziRollApi.get("popular",{
                params:{
                    sorted:state,
                    pageNum:pageNum,
                    pageSize:size,
                }
            });
        }
        return res;
    },

    getDetail:async(id)=>{
        let res;
        try{
            if(window.sessionStorage.getItem('accessToken')){
                res = await PrivateMozziRollApi.get(`${id}`);
            }else{
                res = await PublicMozziRollApi.get(`${id}`);
            }
            return res;
        }catch{
            alert("글이 존재하지 않거나 잘못된 접근입니다.");
            window.location.href= "/";
        }
    },

    like:async (id)=>{
        let res = await PrivateMozziRollApi.post(`like/${id}`);
        return res;
    },

    link: async (id, title, shareCode) => {
        let res = await PrivateMozziRollApi.post("link",
          {
              mozzirollId: id,
              title: title,
              shareCode: shareCode,
            })
        return res;
    }
};

export default mozziRollApi;
