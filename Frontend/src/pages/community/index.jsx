import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import userApi from "@/api/userApi.js";
import useUser from "@/hooks/useUser.js";
import {useNavigate} from "react-router-dom";
import mozziRollApi from "@/api/mozziRollApi.js";
import MozziRollMenu from "@/components/MozziRollMenu.jsx";

function Community() {
    // const [user, setUser] = useState();
    const {user} = useUser();
    const page = new URLSearchParams(window.location.search).get("page");
    const status = new URLSearchParams(window.location.search).get("status");
    const [mozziRollsData, setMozziRollsData] = useState([]);
    const navigate = useNavigate();

    const bgs = ["bg-yellow-200","bg-green-200","bg-purple-200","bg-red-200"];

    useEffect(() => {
        async function getCommunityMozziRolls(page, size){
            let res = await mozziRollApi.getCommunityMozziRolls(status,page, size);
            if(res.status === 200){
                setMozziRollsData(res.data.data);
                console.log(res.data.data)
            }
        }

        getCommunityMozziRolls(page,20);
    }, [page]);

    useEffect(()=>{
        if(!mozziRollsData) return;
        if(mozziRollsData.pages < page || page<1){
            navigate(`?status=${status}&page=1`);
        }
    },[mozziRollsData]);


    function goPrev(){
        navigate(`?status=${status}&page=${page-1}`);
    }
    function goNext(){
        navigate(`?status=${status}&page=${parseInt(page)+1}`);
    }

    return (
        <Layout>
            {/*{user ?*/}
                <>
                    <NavBar user={user} />
                    <div className="flex-col mt-36 px-20">
                        <div className="w-full flex-col">
                            <div className="text-2 text-gray-600">커뮤니티</div>
                            {/*<div className="text-4xl">{user.userNickname}</div>*/}
                        </div>
                        <div className="py-5">
                            <h1>좋아요 많은 모찌롤</h1>
                            <div className="flex flex-wrap gap-5 justify-center items-center text-center">
                                {mozziRollsData.userMozzirollItems && mozziRollsData.userMozzirollItems.map((item, idx) => {
                                        return (
                                            <MozziRollMenu key={item.createdAt} item={item} idx={idx}/>
                                        )
                                    }
                                )}
                            </div>
                            <div className="flex items-center justify-center text-center gap-4 my-5 rounded-2xl w-fit mx-auto bg-blue-200 p-3">
                                {page>1 && <span onClick={goPrev}>이전</span>}
                                {page}/{mozziRollsData.pages }페이지
                                { page<mozziRollsData.pages &&<span onClick={goNext}>다음</span>}
                            </div>
                        </div>
                        <hr />
                    </div>
                </>
            {/*: <>Loading...</>}*/}
        </Layout>
    );
}

export default Community;
