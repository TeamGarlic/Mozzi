import Layout from "@/components/Layout";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import mozziRollApi from "@/api/mozziRollApi.js";
import fileApi from "@/api/fileApi.js";

function MyPage() {
    const { user } = useUser();
    const [mozziRollPage, setMozziRollPage] = useState(1);
    const [myMozziRolls, setMyMozziRolls] = useState([]);

    useEffect(() => {
        async function getMyMozziRolls() {
            let res = await mozziRollApi.getMozziRolls(mozziRollPage,30);
            const { data: { data: { mozzirollItems } } } = res;
            console.log(mozzirollItems);
            setMyMozziRolls(mozzirollItems);
        }

        getMyMozziRolls();
    }, [mozziRollPage]);

    function goNext(){
        setMozziRollPage(prev=>prev+1);
    }

    function goPrev(){
        setMozziRollPage(prev=>prev-1);
    }

    function goModify() {
        location.href = `/modify`;
    }

    async function deleteMozziRolls(id){
        let res = await mozziRollApi.deleteMozziRolls(id);
        console.log(res);
        return res;
    }

    return (
        <Layout>
            {user ?
                <>
                    <NavBar user={user} />
                    <div className="flex-col mt-36 px-20">
                        <div className="w-full flex-col">
                            <div className="text-2 text-gray-600">마이페이지</div>
                            <div className="text-4xl">{user.userNickname}</div>
                        </div>
                        <div className="py-5">
                            <h1>내 모찌롤</h1>
                            <div className="flex flex-wrap gap-2 justify-center items-center text-center">
                                {myMozziRolls.map((item) => {
                                    return (
                                        <div key={item.createdAt} className="justify-center items-center text-center flex-col hover:shadow-innerpink p-3">
                                            <video className="h-80 mx-auto" src={`https://api.mozzi.lol/files/object/${item.objectName}`} />
                                            <div className=" overflow-hidden p-1">
                                                <div className="float-left">{item.id}</div>
                                                <div className="float-right">{item.createdAt.slice(0,10)}</div>
                                            </div>
                                            <div  className=" overflow-hidden p-1">
                                                <span className="float-left">❤️ 0</span>
                                                    <button className="float-right bg-red-500 p-1 rounded-e-xl text-white" onClick={()=>deleteMozziRolls(item.id)}>
                                                        삭제하기
                                                    </button>
                                                    <a href={`https://api.mozzi.lol/files/object/${item.objectName}`} target="blank" className="float-right bg-blue-500 p-1 rounded-s-xl text-white">
                                                        다운로드
                                                    </a>
                                            </div>
                                        </div>)
                                    }
                                )}
                            </div>
                                {myMozziRolls &&
                                    <div className="flex items-center justify-center text-center gap-4">
                                        {mozziRollPage>1 && <span>이전</span>}
                                        {mozziRollPage}페이지
                                        {mozziRollPage * 20  < myMozziRolls.length &&<span>다음</span>}
                                    </div>
                                }
                        </div>
                        <hr />
                        <div className="py-5">
                            <h1>내 즐겨찾기 목록</h1>
                        </div>
                        <hr />
                        <button
                            onClick={goModify}
                            className="p-4 float-right leading-3 rounded-2xl mt-10 bg-yellow-300"
                        >
                            내정보수정
                        </button>
                    </div>
                </> : <>Loading...</>}
        </Layout>
    );
}

export default MyPage;
