import UserCard from "@/components/UserCard"
import {useEffect, useState} from "react"
import {checkHost} from "@/utils/DecoratorUtil.js"
import PropTypes from "prop-types";

function UserList({user, position, sendPosition, setPosition}){
  const [userList, setUserList] = useState(position.map((user) => {
    return {
      id: user.id,
      name: "dummy",
      onMic: 1,
      onCam: 1,
      isHost: 0
    }
  }))
  const [drag, setDrag] = useState(null);
  let height = 0;
  let moveY = 0;
  let movePosition = height / 2;
  const borderTop = "border-t-2";
  const borderBottom = "border-b-2";
  const borderColor = "border-blue-500";

  useEffect(() => {
    console.log(position)
  }, []);

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
    const dragIdx = Number(drag.dataset.index);
    const targetIdx = Number(event.currentTarget.dataset.index);
    const _userList = [...userList];
    const _user = _userList[dragIdx];
    const _position = [...position];
    const _targetPosition = _position[dragIdx];

    event.currentTarget.classList.remove(borderBottom);
    event.currentTarget.classList.remove(borderTop);
    event.currentTarget.classList.remove(borderColor);

    if (dragIdx === targetIdx) return;

    if (dragIdx < targetIdx) {
      if(movePosition > moveY){
        _userList.splice(dragIdx, 1);
        _position.splice(dragIdx, 1);
        _userList.splice(targetIdx - 1, 0, _user);
        _position.splice(targetIdx - 1, 0, _targetPosition);

      } else {
        _userList.splice(dragIdx, 1);
        _position.splice(dragIdx, 1);
        _userList.splice(targetIdx, 0, _user);
        _position.splice(targetIdx, 0, _targetPosition);
      }
    } else {
      if(movePosition > moveY){
        _userList.splice(dragIdx, 1);
        _position.splice(dragIdx, 1);
        _userList.splice(targetIdx, 0, _user);
        _position.splice(targetIdx, 0, _targetPosition);
      } else {
        _userList.splice(dragIdx, 1);
        _position.splice(dragIdx, 1);
        _userList.splice(targetIdx+1, 0, _user);
        _position.splice(targetIdx+1, 0, _targetPosition);
      }
    }
    setUserList(_userList);
    setPosition(_position);
    sendPosition(_position);
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
             className="mt-1 mb-1"
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
  position: PropTypes.array,
  sendPosition: PropTypes.func,
  setPosition: PropTypes.func,
};