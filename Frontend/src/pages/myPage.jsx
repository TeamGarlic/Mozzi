import Layout from "@/components/Layout";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar";
import { useEffect, useState } from "react";
import mozziRollApi from "@/api/mozziRollApi.js";

function MyPage() {
    const { user } = useUser();
    const [mozziRollPage, setMozziRollPage] = useState(1);
    const [myMozziRolls, setMyMozziRolls] = useState([]);

    useEffect(() => {
        async function getMyMozziRolls() {
            let res = await mozziRollApi.getMozziRolls(mozziRollPage,20);
            const { data: { data: { mozzirollItems } } } = res;
            console.log(mozzirollItems);
            setMyMozziRolls(mozzirollItems);
        }

        getMyMozziRolls();
    }, [mozziRollPage]);

    function goModify() {
        location.href = `/modify`;
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
                            <h1>{user.userNickname}의 모찌롤</h1>
                            <div className="flex flex-wrap gap-2 justify-center items-center text-center">
                                {myMozziRolls.map((item) => {
                                    return (
                                        <div key={item.createdAt} className="justify-center items-center text-center flex-col hover:shadow-inner p-3">
                                            <video className="h-80 mx-auto" src={`https://api.mozzi.lol/files/object/${item.objectName}`} />
                                            <div className=" overflow-hidden p-1">
                                                <div className="float-left">{item.objectName.slice(0,13)}</div>
                                                <div className="float-right">{item.createdAt.slice(0,10)}</div>
                                            </div>
                                            <div  className=" overflow-hidden p-1">
                                                    <button className="float-right">
                                                        삭제하기
                                                    </button>
                                                    <button className="float-right">
                                                        다운로드
                                                    </button>
                                            </div>
                                        </div>)
                                }
                                )}
                            </div>
                        </div>
                        <hr />
                        <div className="py-5">
                            <h1>{user.userNickname}의 즐겨찾기 목록</h1>
                        </div>
                        <hr />
                        <button
                            onClick={goModify}
                            className="w-32 h-12 float-right leading-3 rounded-2xl mt-10 bg-yellow-300"
                        >
                            내정보수정
                        </button>
                    </div>
                </> : <>Loading...</>}
        </Layout>
    );
}

export default MyPage;
