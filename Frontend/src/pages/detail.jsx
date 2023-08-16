import Layout from "@/components/Layout";
import useUser from "@/hooks/useUser.js";
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "@/components/NavBar.jsx";
import {useEffect, useState} from "react";
import mozziRollApi from "@/api/mozziRollApi.js";

function Detail() {
    const {user} = useUser();
    console.log(user)
    const {id} = useParams();
    const [mozzi, setMozzi] = useState();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState();
    const navigate = useNavigate();

    useEffect(()=>{
        if(!id) return;
        getDetail(id);
    },[id]);

    async function getDetail(id){
        let res = await mozziRollApi.getDetail(id);
        console.log(res.data.data)
        setMozzi(res.data.data);
        setLiked(res.data.data.liked);
        setLikes(res.data.data.likeCount);
    }

    const download=(e)=>{
        e.stopPropagation();
        let encode = encodeURI(e.target.value);
        let link = document.createElement("a");
        link.setAttribute("href", encode);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const deleteMozzi = async(e)=>{
        const id = e.target.value;
        let res = await deleteClip(id);
        if(res.status ===200){
            alert("삭제 완료했습니다.");
            navigate(-1);
        }
    }

    const deleteClip = async(id)=>{
        const confirm = window.confirm("삭제하시겠습니까?");
        if(!confirm) return;
        let res = await mozziRollApi.deleteMozziRolls(id);
        if(res.status ===200){
            return res;
        }
        alert("오류 발생");
        navigate(-1);
    }

    const giveLike =async(id)=>{
        if(!user) return;
        let res = await mozziRollApi.like(id);
        if(res.status ===200){
            setLiked(res.data.data.liked);
            setLikes(res.data.data.likeCount);
        }
    }

    return (
        <Layout>
           <>
               <NavBar user={user} />
               <div className="flex-col mt-28 px-20 py-5">
                   <div className="text-3xl text-gray-600 mb-20">클립 보기</div>
                   {mozzi && <div className=" overflow-scroll scrollbar-hide my-4 mt-5">
                    <div className="flex max-w-[calc(75rem)] mx-auto">
                        <div className={`${mozzi.mozzirollInfo.width+100 > mozzi.mozzirollInfo.height ? "max-h-96 max-w-screen-sm" : "max-h-96 max-w-screen-sm"} py-2 mr-3 ml-auto`}>
                           <video
                               className={`${mozzi.mozzirollInfo.width+100 > mozzi.mozzirollInfo.height ? "w-full h-full":"w-full h-full"} mx-auto`}
                               width={`${mozzi.mozzirollInfo.width}`}
                               height={`${mozzi.mozzirollInfo.height}`}
                               src={`https://api.mozzi.lol/files/object/${mozzi.mozzirollInfo.objectName}`}
                               controls
                               autoPlay
                               crossOrigin="anonymous"
                           />
                        </div>
                        <div className="ml-3 mr-auto my-auto flex-col">
                            <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full my-auto"} overflow-hidden my-1`}>
                                <div className="my-auto text-center font-bold">{mozzi.title}</div>
                            </div>
                            <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full my-auto"} overflow-hidden flex my-1`}>
                                <img src="/src/assets/img/mozzi-icon.png" alt="" className="rounded-full w-8 h-8 p-0.5 object-cover bg-[#fce7f3]" />
                                <span className="ml-2 mr-5 my-auto">{mozzi.user.nickname}</span>
                                <div className="my-auto ml-5">{mozzi.mozzirollInfo.createdAt.slice(0,10)}</div>
                            </div>
                            <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full my-auto"} flex mt-2`}>
                                <div className={`${mozzi.posted ? "text-blue-500" : "text-red-500"} flex-col ml-auto my-auto`}>
                                    <img src={`/src/assets/img/${mozzi.posted?"post":"unpost"}.png`} alt="" className="w-auto h-auto mx-auto" />
                                    <div className="whitespace-nowrap text-xs">{`${mozzi.posted ? "공유O":"공유"}`}</div>
                                </div>
                                <button className="flex overflow-hidden px-1 py-2 ml-2 my-auto" onClick={()=>giveLike(mozzi.id)}>
                                    <img src={`/src/assets/img/heart-${liked?"full":"empty"}.png`} alt="" className="w-5 h-5 ml-auto my-auto" />
                                    <span className="ml-1 text-red-500 text-lg">{likes}</span>
                                </button>
                                { user && mozzi.user.id ===user.id &&
                                <button
                                    className="float-right p-1 rounded-e-xl text-white"
                                    value={mozzi.id}
                                    onClick={deleteMozzi}>
                                    <img src="/src/assets/img/delete.png" alt="" className="w-5 h-5 ml-auto my-auto" />
                                </button>
                                }

                                {/* <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "h-fit" : "min-h-[calc(30rem)]"} rounded-2xl bg-white p-5 border-4 border-red-200 overflow-hidden flex`}>
                                    <div className={`${mozzi.posted ? "text-blue-500" : "text-red-500"} flex-col`}>
                                        <img src={`/src/assets/img/${mozzi.posted?"post":"unpost"}.png`} alt="" className="w-auto h-auto mx-auto" />
                                        <div className="whitespace-nowrap text-sm">{`${mozzi.posted ? "공유됨":"공유되지 않음"}`}</div>
                                    </div>
                                    <div className={"w-full bottom-0"}>
                                        <div
                                            className={"text-red-500 float-left rounded-xl border-purple-200 p-1 hover:shadow-innerpink hover:cursor-pointer"}
                                            onClick={()=>giveLike(mozzi.id)}>
                                            {liked ? "♥︎":"♡"}{likes}
                                        </div>
                                        { user && mozzi.user.id ===user.id &&
                                        <button
                                            className="float-right bg-red-500 p-1 rounded-e-xl text-white"
                                            value={mozzi.id}
                                            onClick={deleteMozzi}>
                                            삭제하기
                                        </button>
                                        }
                                        <button
                                            value={`https://api.mozzi.lol/files/object/${mozzi.mozzirollInfo.objectName}`}
                                            className={`float-right bg-blue-500 p-1 text-white rounded-s-xl ${user && mozzi.user.id ===user.id ? "":"rounded-e-xl"}`}
                                            onClick={download}>
                                            다운로드
                                        </button>
                                    </div>
                            </div> */}
                        </div>
                        </div>
                   </div>
                   </div>
                   }
               </div>
           </>
        </Layout>
    );
}

export default Detail;
