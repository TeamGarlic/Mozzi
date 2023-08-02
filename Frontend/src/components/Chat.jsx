import { useEffect, useRef, useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon as ShowChat } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as HideChat } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";
import useInput from "@/hooks/useInput.js";
import TextInput from "@/components/TextInput.jsx";

function Chat({ sendMessage, chatLists, user }) {
  const [visible, setVisible] = useState(false);
  const chattingLog = useRef();
  const msg = useInput();
  function send() {
    if (msg.value.length === 0) return;
    sendMessage(msg.value);
    msg.reset();
    setTimeout(() => {
      chattingLog.current.scrollTop = chattingLog.current.scrollHeight;
    }, 100);
  }

  useEffect(() => {
    console.log(chatLists);
  }, [chatLists]);

  return (
    <div className="fixed bottom-5 right-5 z-20">
      {visible && (
        <div className="flex-col w-80 h-fit rounded-xl bg-white">
          <div className=" text-lg p-3">채팅</div>
          <hr />
          <div
            className="overflow-scroll p-3 h-72 scrollbar-hide"
            ref={chattingLog}
          >
            {chatLists &&
              chatLists.map((item) => {
                return item.from.userNickname === user.userNickname ? (
                  <div>
                    <div className="text-right flex-col pb-2">
                      <div className="text-sm text-gray-500">
                        {item.from.userNickname}
                      </div>
                      <div>{item.message}</div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-left flex-col pb-2">
                      <div className="text-sm text-gray-500">
                        {item.from.userNickname}
                      </div>
                      <div>{item.message}</div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="flex p-3 border-t-2 gap-1">
            <TextInput placeholder="채팅 입력..." type="text" {...msg} />
            <button
              onClick={send}
              className="rounded-xl bg-blue-500 text-white w-1/3 my-2"
            >
              보내기
            </button>
          </div>
        </div>
      )}
      <div className=" w-10 h-10 float-right">
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
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
  }),
};
