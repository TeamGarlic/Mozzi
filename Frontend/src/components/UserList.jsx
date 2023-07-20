import UserCard from "@/components/UserCard"
import {useState} from "react"

function UserList(){
  const [userList, setUserList] = useState([
    { item: "🦜", name: "Parrot" },
    { item: "🦖", name: "Dinosaur" },
    { item: "🦆", name: "Duck" },
    { item: "🦔", name: "Porkypine" },
    { item: "🐤", name: "Chick" },
    { item: "🐧", name: "Penguin" },
    { item: "🦜", name: "Parrot" },
    { item: "🦖", name: "Dinosaur" },
    { item: "🦆", name: "Duck" },
    { item: "🦔", name: "Porkypine" },
    { item: "🐤", name: "Chick" },
    { item: "🐧", name: "Penguin" },
  ]);
  const [drag, setDrag] = useState(null);
  let height = 0;
  let moveY = 0;
  let movePosition = height / 2;

  function onDragOver(event){
    event.preventDefault();
    height = event.currentTarget.offsetHeight;
    moveY = event.nativeEvent.offsetY;
    movePosition = height / 2;
    event.currentTarget.classList.add("border-blue-500");

    if (movePosition > moveY){
      event.currentTarget.classList.add("border-t-4");
      event.currentTarget.classList.remove("border-b-4");
    } else {
      event.currentTarget.classList.add("border-b-4");
      event.currentTarget.classList.remove("border-t-4");
    }
  }

  function onDragEnter(event){
    const dragIdx = drag.dataset.index;
    const targetIdx = event.target.dataset.index;
    if (dragIdx < targetIdx){
      event.currentTarget.classList.add("border-b-4");
      event.currentTarget.classList.add("border-blue-500");
    } else {
      event.currentTarget.classList.add("border-b-4");
      event.currentTarget.classList.add("border-blue-500");
    }
  }

  function onDragLeave(event){
    event.currentTarget.classList.remove("border-b-4")
    event.currentTarget.classList.remove("border-t-4")
    event.currentTarget.classList.remove("border-blue-500")
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

    event.currentTarget.classList.remove("border-b-4");
    event.currentTarget.classList.remove("border-t-4");
    event.currentTarget.classList.remove("border-blue-500");

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
            userName={item.name}
            isHost={idx === 0}
          />
        </div>
      ))}
    </>
  )
}

export default UserList;