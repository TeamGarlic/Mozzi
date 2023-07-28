import { useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon as ShowChat } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as HideChat } from "@heroicons/react/24/solid";
function Chat() {
  const [visible, setVisible] = useState(false);
  const messageList = [
      {name:"junhong", text:"msg1"},
      {name:"ssumthingood", text:"msg1"},
      {name:"minjung", text:"msg1"},
      {name:"changjae", text:"msg1"},
      {name:"woojung", text:"msg1"},
      {name:"taeyoung", text:"msg1"},
      {name:"minkyu", text:"msg1"},
      {name:"guest1", text:"msg1"},
      {name:"guest1", text:"msg1"},
      {name:"guest2", text:"msg1"},
      {name:"guest2", text:"msg1"},
      {name:"guest2", text:"msg1"},
      {name:"guest2", text:"msg1"},
      {name:"guest2", text:"msg1"},
  ]
    const [user] = useState("ssumthingood");
  return (
    <div className="fixed bottom-5 right-5">
      {visible &&
          <div className="flex-col w-80 h-96 rounded-xl bg-white">
          <div className="text-2xl p-5">채팅</div>
          <hr/>
          <div className="overflow-scroll p-5 h-72 scrollbar-hide">
              {messageList.map(item=>{
                  return(item.name === user ?
                      <div>
                          <div className="text-right flex-col pb-2">
                              <div className="text-sm text-gray-500">{item.name}</div>
                              <div>{item.text}</div>
                          </div>
                      </div>
                      :
                      <div>
                          <div className="text-left flex-col pb-2">
                              <div className="text-sm text-gray-500">{item.name}</div>
                              <div>{item.text}</div>
                          </div>
                      </div>)
              })
          }
          </div>
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
