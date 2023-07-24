import { useState } from "react";
import MakeBooth from "./makeBooth";
import TakePic from "./takePic";
import { useParams } from "react-router-dom";

function Booth() {
  const [taking, setTaking] = useState(false);
  const { code: sessionID } = useParams();
  console.log(sessionID);
  function startTake() {
    console.log("take!");
    setTaking(true);
  }
  return (
    <>
      {/* 여기 두개에다가 아래 canvas 내용을 props로 그대로 넣을거임 */}
      {!taking ? <MakeBooth startTake={startTake} /> : <TakePic />}

      <canvas className=" hidden" />
      <video className=" hidden" />
      <canvas className=" hidden" />
    </>
  );
}

export default Booth;
