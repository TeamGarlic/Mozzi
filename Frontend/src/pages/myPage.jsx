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
            let res = await mozziRollApi.getMozziRolls();
            console.log(res);
            const { data: { data: { mozzirollItems } } } = await res;
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
                                            <div>
                                                <div className="float-left">{item.objectName}</div>
                                                <div className="float-right">{item.createdAt}</div>
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
