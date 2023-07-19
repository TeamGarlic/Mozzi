// import { Link } from "react-router-dom";
import Layout from "../components/Layout";

function AfterTake() {
  return (
    <Layout>
      <div className="flex">
        <div className="w-full h-screen p-4 flex-col">
          <span className="text-3xl">Select</span>
          <div className=" overflow-y-scroll scrollbar-hide h-[calc(100%-2.5rem)]">
            <div className=" flex flex-wrap w-full p-8 overflow-y-scroll scrollbar-hide items-center text-center gap-4">
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics1
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics2
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics3
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics4
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics5
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics6
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics7
              </div>
              <div className=" w-96 h-[calc(13.5rem)] bg-slate-300 mx-auto">
                pics8
              </div>
            </div>
          </div>
        </div>
        <div className="float-right w-[calc(32rem)] h-screen bg-white flex-col rounded-s-xl p-4 justify-center items-center text-center overflow-y-scroll scrollbar-hide">
          frame
          <div className="mx-auto bottom-5 justify-center items-center text-center">
            <button
              className="w-1/2 h-10 rounded-3xl bg-yellow-100 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.5)]"
              onClick={() => {
                location.href = "/finish";
              }}
            >
              finish
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default AfterTake;
