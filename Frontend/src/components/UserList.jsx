import UserCard from "@/components/UserCard"
import {useEffect, useState} from "react"
import {checkHost} from "@/utils/DecoratorUtil.js"
import PropTypes from "prop-types";
import MicSetting from "@/components/MicSetting.jsx";

function UserList({user, position, sendPosition, setPosition, subscribers, publisher, setAlertModal, toggleMic, subVideoRefs}){
  const [userList, setUserList] = useState([])
  const [drag, setDrag] = useState(null);
  let height = 0;
  let moveY = 0;
  let movePosition = height / 2;
  const borderTop = "border-t-2";
  const borderBottom = "border-b-2";
  const borderColor = "border-blue-500";
  const [target, setTarget] = useState({
    visible: false,
    userName: "",
    id: "",
    volume: 100,
  });

  function setMicSetting(t){
    setTarget(t);
  }

  useEffect(() => {
    setUserList(position.map((user) => {
      let name = ""
      let isHost = 0;
      let onMic = true;
      let isPublisher = false;
      let id = "";
      const subscriber = subscribers && subscribers.find((el)=>{
        return el.stream.connection.connectionId === user.id
      })
      if (subscriber) {
        id = subscriber.stream.connection.connectionId;
        name = JSON.parse(subscriber.stream.connection.data).clientData;
        isHost = JSON.parse(subscriber.stream.connection.data).isHost;
        onMic = subscriber.stream.audioActive;
      } else {
        id = publisher.stream.connection.connectionId;
        name = JSON.parse(publisher.stream.connection.data).clientData;
        isHost = JSON.parse(publisher.stream.connection.data).isHost;
        onMic = publisher.stream.audioActive;
        isPublisher = true;
      }
      return {
        id: id,
        name: name,
        onMic: onMic,
        isHost: isHost,
        isPublisher: isPublisher
      }
    }))
  }, [position]);

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

  onDragOver = checkHost(onDragOver, user.isHost, setAlertModal)
  onDragEnter = checkHost(onDragEnter, user.isHost, setAlertModal)
  onDragStart = checkHost(onDragStart, user.isHost, setAlertModal)
  onDragEnd = checkHost(onDragEnd, user.isHost, setAlertModal)
  onDragLeave = checkHost(onDragLeave, user.isHost, setAlertModal)
  onDrop = checkHost(onDrop, user.isHost, setAlertModal)

  return (
    <>

      <div className="row-auto text-center">
        <div className="text-2xl">
                사용자 목록
        </div>
        <div className="text-sm text-slate-600 whitespace-nowrap">
          위에 있는 유저일수록 앞쪽에 그려집니다
        </div>

        <div className="text-sm text-slate-600 whitespace-nowrap">
          (방장이 드래그해 순서를 조절합니다)
        </div>
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
               className="mt-1 mb-1 h-fit w-full px-2"
               draggable>
            <UserCard
              onMic={item.onMic}
              userName={item.name}
              isHost={item.isHost}
              isPublisher={item.isPublisher}
              toggleMic={toggleMic}
              setPosition={setPosition}
              sendPosition={sendPosition}
              position={position}
              id={item.id}
              setMicSetting={setMicSetting}
              subVideoRefs={subVideoRefs}
            />
          </div>
        ))}
        <MicSetting target={target} subVideoRefs={subVideoRefs}/>
      </div>
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
  subscribers: PropTypes.array,
  publisher: PropTypes.any,
  setAlertModal: PropTypes.func,
  toggleMic: PropTypes.func,
  subVideoRefs: PropTypes.any,
};
