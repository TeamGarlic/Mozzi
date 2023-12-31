import Layout from "@/components/Layout";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar";
import {useEffect, useRef, useState} from "react";
import mozziRollApi from "@/api/mozziRollApi.js";
import MozziRollMenu from "@/components/MozziRollMenu.jsx";

function MyPage() {
    const { user } = useUser();
    const [myMozziRollData, setMyMozziRollData] = useState({});
    const [page, setPage] = useState(1);
    const itemRefs = useRef({});

    async function getMyMozziRolls(pageNum, size) {
        let res = await mozziRollApi.getMozziRolls(pageNum,size);
        setMyMozziRollData(res.data.data);
    }

    useEffect(() => {
        if(page===0) return;
        getMyMozziRolls(page, 10);
    }, [page]);

    function goNext(){
        setPage(prev=>prev+1);
    }

    function goPrev(){
        setPage(prev=>prev-1);
    }

    function goModify() {
        location.href = `/modify`;
    }

    async function deleteMozziRolls(id){
        const confirm = window.confirm("삭제하시겠습니까?");
        if(!confirm) return;
        let res = await mozziRollApi.deleteMozziRolls(id);
        // console.log(res);
        if(res.status ===200){
            await getMyMozziRolls(page, 10);
        }
        return res;
    }

    return (
        <Layout>
            {user ?
                <>
                    <NavBar user={user} />
                    <div className="flex-col mt-28 px-20 ">
                        <div className="w-full flex-col">
                            <div className="text-2 text-gray-600">마이페이지</div>
                            <div className="text-4xl">{user.userNickname}</div>
                        </div>
                        <div className="pb-20">
                            <div className=" text-2xl py-5">내 클립</div>
                            <div className="flex flex-wrap gap-5 justify-center items-center text-center">
                                {myMozziRollData.userMozzirollItems && myMozziRollData.userMozzirollItems.map((item, idx) => {
                                    return (
                                        <MozziRollMenu key={item.createdAt+idx.toString()} item={item} idx={idx} deleteFunc={deleteMozziRolls} myRef={itemRefs[item.mozzirollInfo.id]} user={user}/>
                                        )
                                    }
                                )}
                            </div>
                                {myMozziRollData.userMozzirollItems &&
                                    <div className="fixed bottom-4 left-[calc(42%)] flex items-center justify-center text-center my-5 rounded-2xl w-1/6 mx-auto bg-blue-100 border border-blue-500 h-10 px-3">
                                        {page>1 && <span className="w-[calc(25%)] whitespace-nowrap border-r border-blue-300" onClick={goPrev}>이전</span>}
                                        <span className="w-[calc(50%)]">{page}/{Math.max(myMozziRollData.pages,1)}페이지</span>
                                        {page < myMozziRollData.pages &&<span className="w-[calc(25%)] whitespace-nowrap border-l border-blue-300" onClick={goNext}>다음</span>}
                                    </div>
                                }
                        </div>
                    </div>
                </> : <>Loading...</>}
        </Layout>
    );
}

export default MyPage;
