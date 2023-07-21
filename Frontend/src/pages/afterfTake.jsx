// import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import ClipLog from "@/components/ClipLog";
import Frame from "@/components/Frame";

function AfterTake() {
  return (
    <Layout>
      <div className="flex">
        <div className="w-full h-screen p-4 flex-col">
          <ClipLog />
        </div>
        <div className="float-right w-[calc(32rem)] h-screen bg-white flex-col rounded-s-xl p-4 justify-center items-center text-center overflow-y-scroll scrollbar-hide">
          프레임
          <div className="mx-auto bottom-5 justify-center items-center text-center">
            <Frame />
            <button
              className="w-1/2 h-10 rounded-3xl bg-yellow-100 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.5)]"
              onClick={() => {
                location.href = "/0/finish";
              }}
            >
              공유하기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AfterTake;
