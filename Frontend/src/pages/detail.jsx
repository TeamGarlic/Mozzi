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
        console.log(id);
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
                   <div className="text-3xl text-gray-600">클립 보기</div>
                   {mozzi && <div className=" overflow-scroll scrollbar-hide my-4">
                   <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "flex-col max-w-[calc(75rem)] mx-auto":"flex min-w-[calc(75rem)]"}`}>
                       <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full":"w-1/2 h-full"} p-5`}>
                           <video
                               className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full h-full":"w-3/4 h-3/4"} mx-auto`}
                               width={`${mozzi.mozzirollInfo.width}`}
                               height={`${mozzi.mozzirollInfo.height}`}
                               src={`https://api.mozzi.lol/files/object/${mozzi.mozzirollInfo.objectName}`}
                               controls
                               autoPlay
                           />
                       </div>
                       <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full":"h-full w-1/2 my-auto"} p-5 flex-col`}>
                           <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "h-fit":"min-h-[calc(30rem)]"} rounded-2xl bg-white p-5 border-4 border-red-200 overflow-hidden`}>
                                    <div className="text-2xl">
                                       {mozzi.title}
                                    </div>
                                    <div className="overflow-hidden">
                                       <span className="text-gray-600 float-left">
                                           {mozzi.user.nickname}
                                       </span>
                                       <span className="text-gray-600 float-right">
                                           {mozzi.mozzirollInfo.createdAt.slice(0,10)}
                                       </span>
                                    </div>
                               <hr className={"my-5"}/>
                                    <div className={`${mozzi.posted ? "text-blue-500":"text-red-500"} text-sm`}>
                                       {`${mozzi.posted ? "공유됨":"공유되지 않음"}`}
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
