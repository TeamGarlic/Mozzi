import { useState } from "react";
// import { Link } from "react-router-dom";
import PicSideBar from "../components/PicSideBar";
import Layout from "../components/Layout";
import BigCam from "../components/BigCam";
import Chat from "@/components/Chat";

function TakePic() {
  const [taken, setTaken] = new useState(1);
  function take() {
    let mytake = taken + 1;
    if (mytake === 11) {
      location.href = "/aftertake";
    } else {
      setTaken(mytake);
    }
  }
  return (
    <Layout>
      <>
        <Chat />
        <div className="w-full p-4">
          <span className="text-3xl">Code : XXX_XXX_XXX</span>
          <PicSideBar />
          {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
        </div>
        <BigCam />
        {/* <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link> */}
        <div className="flex justify-center items-center gap-20 pt-5">
          <ul className="flex rounded-3xl bg-slate-300 leading-10">
            <li className=" border-r-2 px-5">timer</li>
            <li className=" border-r-2 px-5">3s</li>
            <li className=" border-r-2 px-5">5s</li>
            <li className=" px-5">10s</li>
          </ul>
          <div className="flex rounded-2xl bg-yellow-200 leading-10">
            <span className=" px-5 ">{taken}/10</span>
            <button
              className="w-full leading-10  px-5  bg-red-300 rounded-r-2xl"
              onClick={take}
            >
              찰칵
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default TakePic;
