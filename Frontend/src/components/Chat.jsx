import { useEffect, useRef, useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon as ShowChat } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as HideChat } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import useInput from "@/hooks/useInput.js";
import TextInput from "@/components/TextInput.jsx";

function Chat({ sendMessage, chatLists, user, publisher }) {
  const [visible, setVisible] = useState(false);
  const chattingLog = useRef();
  const chattingCase = useRef();
  const msg = useInput();
  function send() {
    if (msg.value.length === 0) return;
    if(user.isHost === 1){
    sendMessage(msg.value, user.userData.userNickname);
    }else if(user.isHost === 0){
      if(user.userData){
        sendMessage(msg.value, user.userData.userNickname);
      }else{
      sendMessage(msg.value, user.userNickname);
      }
    }
    msg.reset();
  }

  function onKeyDown(event) {
    if (event.key === "Enter") {
      send();
    }
  }

  useEffect(() => {
    // console.log(chattingLog.current.scrollTop, chattingLog.current.scrollHeight );
    const lastMsg = chatLists[chatLists.length-1];
    if(!chattingLog) return;
    if(lastMsg){
      if(!chattingLog.current) return;
      // if(!chattingLog.current.scrollHeight) return;

      lastMsg.connectionId === publisher.stream.connection.connectionId ?
          chattingLog.current.scrollTop = chattingLog.current.scrollHeight
          :
          console.log(lastMsg);
    }
  }, [chatLists]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {visible && (
        <div className="flex-col w-80 h-fit rounded-xl bg-white my-3 border border-blue-300">
          <div className=" text-lg p-3">채팅</div>
          <hr />
          <div className="h-full" ref={chattingCase}>
          <div
            className="overflow-scroll p-3 h-72 scrollbar-hide"
            ref={chattingLog}
          >
            {chatLists &&
              chatLists.map((item, idx) => {
                return item.connectionId === publisher.stream.connection.connectionId ? (
                  (item.connectionId === item.from ?
                  <div key={`chat : ${idx}`} id={`chat : ${idx}`}>
                    <div className=" text-center pb-2">
                      <div className="w-full break-all text-xs text-blue-500" >{item.message}</div>
                    </div>
                 </div>
                  :
                  <div key={`chat : ${idx}`} id={`chat : ${idx}`}>
                     <div className="text-right flex-col pb-2">
                       <div className="text-sm text-gray-500">{item.from}</div>
                       <div className="w-full break-all" >{item.message}</div>
                     </div>
                  </div>)
                  // <div key={`chat : ${idx}`} id={`chat : ${idx}`}>
                  //   <div className="text-right flex-col pb-2">
                  //     <div className="text-sm text-gray-500">{item.from}</div>
                  //     <div className="w-full break-all" >{item.message}</div>
                  //   </div>
                  // </div>
                ) : (
                    <div key={`chat : ${idx}`} id={`chat : ${idx}`}>
                    <div className="text-left flex-col pb-2">
                      <div className="text-sm text-gray-500">{item.from}</div>
                      <div className="w-full break-all">{item.message}</div>
                    </div>
                  </div>
                );
              })}
          </div>
          </div>
          <div className="flex p-3 border-t-2 gap-1">
            <TextInput
              placeholder="채팅 입력..."
              type="text"
              {...msg}
              onKeyDown={onKeyDown}
            />
            <button
              onClick={send}
              className="rounded-xl bg-blue-500 text-white w-1/3 my-2"
            >
              보내기
            </button>
          </div>
        </div>
      )}
      <div className=" w-14 h-14 float-right p-1 rounded-full bg-[#ffffff] border-2 border-blue-500">
        {visible ? (
          <HideChat
            onClick={() => {
              setVisible(!visible);
            }}
          />
        ) : (
          <ShowChat
            onClick={() => {
              setVisible(!visible);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Chat;

Chat.propTypes = {
  sendMessage: PropTypes.func,
  chatLists: PropTypes.array,
  publisher:PropTypes.any,
  user: PropTypes.shape({
    isHost :PropTypes.number,
    userNickname:PropTypes.string,
    userData : PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    })
  }),
};
