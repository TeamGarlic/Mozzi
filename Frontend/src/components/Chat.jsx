import { useState } from "react";
import { ChatBubbleOvalLeftEllipsisIcon as ShowChat } from "@heroicons/react/24/outline";
import { ChatBubbleOvalLeftEllipsisIcon as HideChat } from "@heroicons/react/24/solid";
function Chat() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="fixed bottom-5 right-5">
      {visible && <div>chat!!</div>}
      <div className=" w-10 h-10">
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
