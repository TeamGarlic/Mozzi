import PropTypes from "prop-types";

function MozziRollMenu({item, idx, deleteFunc}){
    const bgs = ["bg-yellow-200","bg-green-200","bg-purple-200","bg-red-200"];

    return(
        <div key={item.createdAt} className={`justify-center items-center text-center flex-col hover:shadow-innerpink p-3 rounded-2xl ${bgs[idx%4]}`}>
            <video className="h-80 mx-auto" src={`https://api.mozzi.lol/files/object/${item.mozzirollInfo.objectName}`} />
            <div className=" overflow-hidden p-1">
                <div className="float-left">{item.title}</div>
                <div className="float-right">{item.mozzirollInfo.createdAt.slice(0,10)}</div>
            </div>
            <div  className=" overflow-hidden p-1">
                <span className="float-left">❤️ {item.likeCount}</span>
                {deleteFunc && <button className="float-right bg-red-500 p-1 rounded-e-xl text-white" onClick={()=>deleteFunc(item.mozzirollInfo.id)}>
                    삭제하기
                </button>}
                <a href={`https://api.mozzi.lol/files/object/${item.mozzirollInfo.objectName}`} target="blank" className={`float-right bg-blue-500 p-1 text-white ${deleteFunc ? "rounded-s-xl":"rounded-xl"}`}>
                    다운로드
                </a>
            </div>
        </div>
    )

}

export default MozziRollMenu;

MozziRollMenu.propTypes = {
    item:PropTypes.object,
    idx:PropTypes.number,
    deleteFunc:PropTypes.func
}
