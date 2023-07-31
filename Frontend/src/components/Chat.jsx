import { useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon as ShowChat } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as HideChat } from "@heroicons/react/24/solid";
import PropTypes from "prop-types";

function Chat({sendMessage, chatLists}) {
  const [visible, setVisible] = useState(false);
  console.log(chatLists);

    const [user, setUser] = useState("ssumthingood");
  return (
    <div className="fixed bottom-5 right-5">
      {visible &&
          <div className="flex-col w-80 h-96 rounded-xl bg-white">
          <div className="text-2xl p-5">채팅</div>
          <hr/>
          <div className="overflow-scroll p-5 h-72 scrollbar-hide">
              {chatLists && chatLists.map(item=>{
                  return(item.from === user ?
                      <div>
                          <div className="text-right flex-col pb-2">
                              <div className="text-sm text-gray-500">{item.from}</div>
                              <div>{item.message}</div>
                          </div>
                      </div>
                      :
                      <div>
                          <div className="text-left flex-col pb-2">
                              <div className="text-sm text-gray-500">{item.from}</div>
                              <div>{item.message}</div>
                          </div>
                      </div>)
              })
          }
          </div>
              <button onClick={()=>sendMessage("ssumthingood")}>send</button>
        </div>
      }
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
    chatLists : PropTypes.array
};
