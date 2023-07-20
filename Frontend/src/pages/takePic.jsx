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
      location.href = "/0/aftertake";
    } else {
      setTaken(mytake);
    }
  }
  return (
    <Layout>
      <>
        <Chat />
        <div className="w-full pt-4 ps-4">
          <span className="text-3xl">부스 코드 : XXX_XXX_XXX</span>
          <PicSideBar />
          {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
        </div>
        <BigCam />
        {/* <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link> */}
        <div className="flex justify-center items-center gap-20 fixed bottom-10 ms-[calc(25%)] w-1/2">
          <ul className="flex rounded-3xl bg-slate-300 leading-10">
            <li className=" border-r-2 px-5">타이머</li>
            <li className=" border-r-2 px-5">3초</li>
            <li className=" border-r-2 px-5">5초</li>
            <li className=" px-5">10초</li>
          </ul>
          <div className="flex rounded-2xl bg-yellow-200 leading-10">
            <span className=" px-5 ">{taken}/10</span>
            <button
              className="w-full leading-10  px-5  bg-red-300 rounded-r-2xl"
              onClick={take}
            >
              촬영
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default TakePic;
