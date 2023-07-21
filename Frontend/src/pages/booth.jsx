import MakeBooth from "./makeBooth";
import TakePic from "./takePic";

function Booth() {
  return (
    <>
      {/* 여기 두개에다가 아래 canvas 내용을 props로 그대로 넣을거임 */}
      <MakeBooth />
      <TakePic />

      <canvas className=" hidden" />
      <video className=" hidden" />
      <canvas className=" hidden" />
    </>
  );
}

export default Booth;
