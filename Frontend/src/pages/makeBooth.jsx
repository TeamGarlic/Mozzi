import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import UserSideBar from "../components/UserSideBar";
import EnterDialog from "@/components/EnterDialog";
import { useState } from "react";

function MakeBooth() {
  const [visibility, setVisibility] = new useState(true);
  const [toggleVoice, setToggleVoice] = new useState(true);
  const closeDialog = () => {
    setVisibility(false);
  };
  function setVoice() {
    setToggleVoice(!toggleVoice);
  }
  return (
    <>
      <EnterDialog
        visibility={visibility}
        onClick={closeDialog}
        toggleVoice={toggleVoice}
        setVoice={setVoice}
      />
      <Layout>
        <div className="flex">
          <div className="w-full h-screen p-4 flex-col">
            <span className="text-3xl">Code : XXX_XXX_XXX</span>
            <div className=" text-2xl p-4">프레임 선택</div>
            <div className="flex gap-6 p-4 pr-[calc(18rem)] overflow-x-scroll scrollbar-hide
            ">
              <div className=" h-96 w-96">frame 1</div>
              <div className=" h-96 w-96">frame 2</div>
              <div className=" h-96 w-96">frame 3</div>
              <div className=" h-96 w-96">frame 4</div>
              <div className=" h-96 w-96">frame 5</div>
              <div className=" h-96 w-96">frame 6</div>
              <div className=" h-96 w-96">frame 7</div>
              <div className=" h-96 w-96">frame 8</div>
            </div>
            <div className="w-full p-20">
            <Link to="/takepic" className=" block relative mx-auto w-fit">
              촬영 시작
            </Link>
            </div>
          </div>
          <UserSideBar />
        </div>
      </Layout>
    </>
  );
}

export default MakeBooth;
