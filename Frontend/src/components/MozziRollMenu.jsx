import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

function MozziRollMenu({item, idx, deleteFunc, myRef}){
    const navigate = useNavigate();
    const bgs = ["bg-yellow-200","bg-green-200","bg-purple-200","bg-red-200"];

    const play=()=>{
        const type = myRef.src.slice(-3, myRef.src.length);
        if(type !== "mp4") return;
        myRef.play();
    }

    const pause=()=>{
        myRef.pause();
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

    const deleteMozzi = (e)=>{
        e.stopPropagation();
        const id = e.target.value;
        deleteFunc(id);
    }

    return(
        <div key={item.createdAt}
             className={`justify-center items-center text-center flex-col p-3 rounded-2xl ${bgs[idx%4]} hover:shadow-innerpink hover:cursor-pointer`}
             onClick={()=>navigate(`/detail/${item.id}`)}
        >
            <video
                className="h-80 mx-auto"
                src={`https://api.mozzi.lol/files/object/${item.mozzirollInfo.objectName}`}
                ref={ref=>(myRef = ref)}
                // onMouseOver={()=>myRef.play()}
                onMouseOver={play}
                onMouseOut={pause}
                crossOrigin="anonymous"
            />
            <div className=" overflow-hidden p-1">
                <div className="float-left">{item.title}</div>
                <div className="float-right">{item.mozzirollInfo.createdAt.slice(0,10)}</div>
            </div>
            <div  className=" overflow-hidden p-1">
                <span className="float-left">❤️ {item.likeCount}</span>
                {deleteFunc &&
                    <button
                        className="float-right bg-red-500 p-1 rounded-e-xl text-white"
                        value={item.id}
                        onClick={deleteMozzi}>
                    삭제하기
                </button>}
                <button
                    value={`https://api.mozzi.lol/files/object/${item.mozzirollInfo.objectName}`}
                    className={`float-right bg-blue-500 p-1 text-white ${deleteFunc ? "rounded-s-xl":"rounded-xl"}`}
                    onClick={download}>
                    다운로드
                </button>
            </div>
        </div>
    )

}

export default MozziRollMenu;

MozziRollMenu.propTypes = {
    item:PropTypes.object,
    idx:PropTypes.number,
    deleteFunc:PropTypes.func,
    myRef:PropTypes.any
}
