import UserCard from "@/components/UserCard"
import {useState} from "react"
import {checkHost} from "@/utils/DecoratorUtil.js"
import PropTypes from "prop-types";

function UserList({user}){
  const [userList, setUserList] = useState([
    { item: "🦜", name: "Parrot", onMic: 1, onCam: 1, isHost: 1 },
    { item: "🦖", name: "Dinosaur", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦆", name: "Duck", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦔", name: "Porkypine", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🐤", name: "Chick", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🐧", name: "Penguin", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦜", name: "Parrot", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦖", name: "Dinosaur", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦆", name: "Duck", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🦔", name: "Porkypine", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🐤", name: "Chick", onMic: 1, onCam: 1, isHost: 0 },
    { item: "🐧", name: "Penguin", onMic: 1, onCam: 1, isHost: 0 },
  ]);
  const [drag, setDrag] = useState(null);
  let height = 0;
  let moveY = 0;
  let movePosition = height / 2;
  const borderTop = "border-t-2";
  const borderBottom = "border-b-2";
  const borderColor = "border-blue-500";

  function onDragOver(event){
    event.preventDefault();
    height = event.currentTarget.offsetHeight;
    moveY = event.nativeEvent.offsetY;
    movePosition = height / 2;
    event.currentTarget.classList.add(borderColor);

    if (movePosition > moveY){
      event.currentTarget.classList.add(borderTop);
      event.currentTarget.classList.remove(borderBottom);
    } else {
      event.currentTarget.classList.add(borderBottom);
      event.currentTarget.classList.remove(borderTop);
    }
  }

  function onDragEnter(event){
    const dragIdx = drag.dataset.index;
    const targetIdx = event.target.dataset.index;
    if (dragIdx < targetIdx){
      event.currentTarget.classList.add(borderBottom);
      event.currentTarget.classList.add(borderColor);
    } else {
      event.currentTarget.classList.add(borderBottom);
      event.currentTarget.classList.add(borderColor);
    }
  }

  function onDragLeave(event){
    event.currentTarget.classList.remove(borderBottom)
    event.currentTarget.classList.remove(borderTop)
    event.currentTarget.classList.remove(borderColor)
  }

  function onDragStart(event){
    setDrag(event.target);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.target);
  }

  function onDragEnd(){
    setDrag(null);
  }

  function onDrop(event){
    const dragIdx = drag.dataset.index;
    const targetIdx = event.currentTarget.dataset.index;
    const _userList = [...userList];
    const _user = _userList[dragIdx];

    event.currentTarget.classList.remove(borderBottom);
    event.currentTarget.classList.remove(borderTop);
    event.currentTarget.classList.remove(borderColor);

    if (dragIdx === targetIdx) return;

    if (dragIdx < targetIdx) {
      if(movePosition > moveY){
        _userList.splice(dragIdx, 1);
        _userList.splice(targetIdx - 1, 0, _user);
      } else {
        _userList.splice(dragIdx, 1);
        _userList.splice(targetIdx, 0, _user);
      }
    } else {
      if(movePosition > moveY){
        _userList.splice(dragIdx, 1);
        _userList.splice(targetIdx, 0, _user);
      } else {
        _userList.splice(dragIdx, 1);
        _userList.splice(targetIdx + 1, 0, _user);
      }
    }
    setUserList(_userList);
  }

  function setTool(idx, tool){
    const _userList = [...userList];
    if (tool === "onMic"){
      _userList[idx].onMic = 1-userList[idx].onMic;
    } else if (tool === "onCam"){
      _userList[idx].onCam = 1-userList[idx].onCam;
    }
    setUserList(_userList);
  }

  onDragOver = checkHost(onDragOver, user.isHost)
  onDragEnter = checkHost(onDragEnter, user.isHost)
  onDragStart = checkHost(onDragStart, user.isHost)
  onDragEnd = checkHost(onDragEnd, user.isHost)
  onDragLeave = checkHost(onDragLeave, user.isHost)
  onDrop = checkHost(onDrop, user.isHost)
  
  return (
    <>
      대충 사용자 목록
      {userList.map((item, idx) => (
        <div
             key={idx}
             data-index={idx}
             onDragStart={onDragStart}
             onDragEnd={onDragEnd}
             onDragEnter={onDragEnter}
             onDragLeave={onDragLeave}
             onDragOver={onDragOver}
             onDrop={onDrop}
             draggable>
          <UserCard
            setTool={setTool}
            onMic={item.onMic}
            onCam={item.onCam}
            idx={idx}
            userName={item.name}
            isHost={item.isHost}
          />
        </div>
      ))}
    </>
  )
}

export default UserList;

UserList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
};