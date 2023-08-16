import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";
import full from '@/assets/img/heart-full.png'
import empty from '@/assets/img/heart-empty.png'

function MozziRollMenu({item, idx, deleteFunc, myRef, user}){
    const navigate = useNavigate();
    // const bgs = ["bg-yellow-200","bg-green-200","bg-purple-200","bg-red-200"];

    const play=()=>{
        const type = myRef.src.slice(-3, myRef.src.length);
        if(type !== "mp4") return;
        myRef.play();
    }

    const pause=()=>{
        myRef.pause();
    }

    return(
        <div key={item.createdAt}
            className={`justify-center items-center text-center flex-col p-3 rounded-2xl bg-[#fce7f3] bg-opacity-30 hover:shadow-innerpink hover:cursor-pointer`}
            onClick={()=>navigate(`/detail/${item.id}`)}
        >
            <div className=" overflow-hidden flex my-1">
                <img src="/src/assets/img/mozzi-icon.png" alt="" className="rounded-full w-8 h-8 p-0.5 object-cover bg-[#fce7f3]" />
                <span className="mx-2 my-auto">{item.user.nickname}</span>
                <div className="my-auto ml-auto">{item.mozzirollInfo.createdAt.slice(0,10)}</div>
            </div>
            <video
                className="h-80 mx-auto"
                src={`https://api.mozzi.lol/files/object/${item.mozzirollInfo.objectName}`}
                ref={ref=>(myRef = ref)}
                onMouseOver={play}
                onMouseOut={pause}
                crossOrigin="anonymous"
            />
            <div className="overflow-hidden px-1 py-2">
                <div className="float-left">{item.title}</div>
                <div className={`float-right flex`}>
                {user && (user.userId === item.user.userId) && <span className="text-sm text-blue-600 my-auto mx-3">{item.posted ? "공유됨":""}</span>}
                <img src={`${item.liked? full: empty}`} alt="" className="w-5 h-5 my-auto" />
                <span className="ml-1">{item.likeCount}</span>
                </div>
            </div>
        </div>
    )

}

export default MozziRollMenu;

MozziRollMenu.propTypes = {
    item:PropTypes.object,
    idx:PropTypes.number,
    deleteFunc:PropTypes.func,
    myRef:PropTypes.any,
    user: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.string,
        userNickname: PropTypes.string,
        email: PropTypes.string,
      }),
}
