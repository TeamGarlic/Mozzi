import Layout from "@/components/Layout";
import useUser from "@/hooks/useUser.js";
import {useNavigate, useParams} from "react-router-dom";
import NavBar from "@/components/NavBar.jsx";
import {useEffect, useState} from "react";
import mozziRollApi from "@/api/mozziRollApi.js";
import full from '@/assets/img/heart-full.png'
import empty from '@/assets/img/heart-empty.png'
import img_post from '@/assets/img/post.png'
import img_unpost from '@/assets/img/unpost.png'
import user_icon from '@/assets/img/mozzi-icon.png'
import delete_icon from '@/assets/img/delete.png'
import download_icon from '@/assets/img/download.png'
import baseURL from "@/api/BaseURL.js";
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import { setFFMpegStatusAction } from '@/modules/clipAction.js';
import { useDispatch, useSelector } from 'react-redux';


function Detail() {
    const {user} = useUser();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [mozzi, setMozzi] = useState();
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState();
    const [shared, setShared] = useState(false);
    const navigate = useNavigate();
    const [dropdown, setDropdown] = useState(false);
    const FFMpegStatus = useSelector((state) => state.clipReducer.FFMpegStatus);
    const ffmpeg = createFFmpeg({log : false});
    const types=[{format:'webm',type:'', srcFormat:"webm"},{format:'mp4',type:'video/mp4', srcFormat:"webm"},{format:'gif',type:'image/gif', srcFormat:"webm"}]
    const handleDownload = async (src, format, type, srcFormat) => {
        dispatch(setFFMpegStatusAction(false));
        let recUrl = src;
        try{
        if(srcFormat!=format){
            if(!FFMpegStatus){
                alert("이미 다른 파일을 다운로드 중입니다. 잠시 후에 다시 시도해주세요");
                return;
            }
            if(!ffmpeg.isLoaded()) await ffmpeg.load();
            // TODO : download 파일명 바꿔야됨
            ffmpeg.FS("writeFile","download."+srcFormat,await fetchFile(src));
            await ffmpeg.run("-i","download."+srcFormat,"-filter:v", "fps=30","download."+format);
            const recFile = ffmpeg.FS("readFile","download."+format);
            const recBlob = new Blob([recFile.buffer], {type:type});
            recUrl = URL.createObjectURL(recBlob);
        }
        const a = document.createElement("a");
        a.href = recUrl;
        document.body.appendChild(a);
        a.download = "download."+format;
        a.target="_blank";
        a.click();
        }catch{
            alert("변환 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요")
        }
        dispatch(setFFMpegStatusAction(true));
    }


    useEffect(()=>{
        if(!id) return;
        getDetail(id);
    },[id]);

    async function getDetail(id){
        let res = await mozziRollApi.getDetail(id);
        setMozzi(res.data.data);
        setLiked(res.data.data.liked);
        setLikes(res.data.data.likeCount);
        setShared(res.data.data.posted);
    }

    const download=(src, format, type)=>{
        let encode = encodeURI(src);
        console.log(encode);
        let sp = encode.split('.')
        console.log(sp)
        handleDownload(src,format,type,getFormat(src));
    }

    const getFormat = (src)=>{
        let encode = encodeURI(src);
        let sp = encode.split('.')
        return sp[sp.length-1];
    }

    const deleteMozzi = async(e)=>{
        const id = e.target.dataset.value;
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

    const share =async(id)=>{
        if(!user) return;
        if(mozzi.user.userId !== user.userId) return;
        let res = await mozziRollApi.share(id);
        if(res.status ===200){
            setShared(res.data.data.post)
        }
    }

    return (
        <Layout>
           <>
               <div className={`absolute p-2 px-4 rounded-3xl bg-red-100 border border-red-500 m-2 float-right right-20 top-5 ${FFMpegStatus?"hidden":""}`}>영상을 변환하는 중입니다. 잠시만 기다려주세요...</div>

               <NavBar user={user} />
               <div className="flex-col mt-28 px-20 py-5 gap-3">
                   <div className="text-3xl text-gray-600">클립 보기</div>
                   {mozzi && <div className=" overflow-scroll scrollbar-hide my-4">
                    <div className="flex-col max-w-[calc(75rem)] mx-auto">
                        <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "max-w-screen-sm" : "max-h-96 max-w-screen-md"} mx-auto`}>
                           <video
                               className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "max-w-screen-sm":"max-h-96 max-w-screen-md"} mx-auto bg-[#fce7f3] bg-opacity-30`}
                               width={`${mozzi.mozzirollInfo.width}`}
                               height={`${mozzi.mozzirollInfo.height}`}
                               src={`${baseURL}/files/object/${mozzi.mozzirollInfo.objectName}`}
                               controls
                               autoPlay
                               loop
                               crossOrigin="anonymous"
                           />
                        </div>
                        <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "max-w-screen-sm" : "max-h-96 max-w-screen-md"} flex-col mx-auto`}>
                            <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "max-w-screen-sm" : "max-h-96 max-w-screen-md"} flex`}>
                                <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full"} overflow-hidden my-1`}>
                                    <div className="my-auto font-bold text-xl">{mozzi.title}</div>
                                </div>
                                <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full"} overflow-hidden my-1 float-right`}>
                                    <div className="my-auto text-right">{mozzi.mozzirollInfo.createdAt.slice(0,10)}</div>
                                </div>
                            </div>
                            <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full"} flex`}>
                                <div className={`${mozzi.mozzirollInfo.width > mozzi.mozzirollInfo.height ? "w-full" : "w-full"} overflow-hidden flex my-1`}>
                                    <img src={`${user_icon}`} alt="" className="rounded-full w-8 h-8 p-0.5 object-cover bg-[#fce7f3]" />
                                    <span className="ml-2 my-auto">{mozzi.user.nickname}</span>
                                </div>
                                { user && mozzi.user.userId === user.userId && 
                                    <button className={`${shared ? "text-blue-500" : "text-red-500"} flex-col mb-auto mx-2`} onClick={()=>{share(mozzi.id)}}>
                                        <img  src={`${shared?img_post:img_unpost}`} alt="" className="w-auto h-auto mx-auto" />
                                        <div className="whitespace-nowrap text-xs">{`${shared ? "공유중":"공유X"}`}</div>
                                    </button>
                                }
                                { user && mozzi.user.id ===user.id &&
                                <button
                                    className="float-right mr-2 mb-auto mt-1 rounded-e-xl text-white"
                                    value={mozzi.id}
                                    onClick={deleteMozzi}>
                                    <img src={`${delete_icon}`} alt="" className="w-5 h-5" data-value={mozzi.id}/>
                                </button>
                                }
                                { user && mozzi.user.id ===user.id &&
                                    <button
                                        value={`${baseURL}/files/object/${mozzi.mozzirollInfo.objectName}`}
                                        className="my-auto mt-1 mx-2"
                                        onClick={()=>{setDropdown(prev=>!prev)}} >
                                        <img src={`${download_icon}`} alt="" className="w-6 h-5" data-value={`${baseURL}/files/object/${mozzi.mozzirollInfo.objectName}`}/>
                                    </button>
                                }
                                <button className="flex mx-1" onClick={()=>giveLike(mozzi.id)}>
                                    <img src={`${liked?full:empty}`} alt="" className="w-5 h-5 mt-1" />
                                    <div className="ml-1 mr-2 text-red-500 text-lg">{likes}</div>
                                </button>
                            </div>

                            <div className="float-right flex-col rounded-2xl w-1/3 min-w-[calc(13rem)]">
                                {dropdown&&(<div className='rounded-t-2xl h-2 bg-orange-100 border border-orange-500 '></div>)}
                                {dropdown&&types.map(item=>(
                                  <button key={`${item.format}`} className="w-full top-0 h-10  bg-orange-50 border-x border-b border-orange-500"
                                          onClick={()=>{download(baseURL+'/files/object/'+mozzi.mozzirollInfo.objectName,item.format,item.type,item.srcFormat)}}>
                                      {`.${item.format} 파일로 다운로드${item.format===getFormat(baseURL+'/files/object/'+mozzi.mozzirollInfo.objectName)?" (원본)":""}`}
                                  </button>
                                ))}
                                {dropdown&&(<div className='rounded-b-2xl h-2 bg-orange-100 border-b border-x border-orange-500'></div>)}
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
