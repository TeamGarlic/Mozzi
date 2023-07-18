import { useState } from "react";
// import { Link } from "react-router-dom";
import PicSideBar from "../components/PicSideBar";
import Layout from "../components/Layout";
import BigCam from "../components/BigCam";

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
      <div className="w-full p-4">
        <span className="text-3xl">Code : XXX_XXX_XXX</span>
        <PicSideBar />
        <div className="float-right mr-10 text-2xl">taken : {taken}/10</div>
      </div>
      <BigCam />
      {/* <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link> */}
      <button className="block relative mx-auto w-fit" onClick={take}>
        찰칵
      </button>
    </Layout>
  );
}

export default TakePic;
