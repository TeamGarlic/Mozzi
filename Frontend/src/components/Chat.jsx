import { useState } from "react";

function Chat() {
  const [visible, setVisible] = useState(false);
  return (
    <div className="fixed bottom-5 right-5">
      {visible && <div>chat!!</div>}
      <button
        className="rounded-full border-2"
        onClick={() => {
          setVisible(!visible);
        }}
      >
        show chat
      </button>
    </div>
  );
}

export default Chat;
