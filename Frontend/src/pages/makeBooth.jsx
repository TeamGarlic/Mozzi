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
            <div className="w-full flex gap-6 p-4">
              <div className=" h-[calc(35rem)] w-30">frame 1</div>
              <div className=" h-96 w-30">frame 2</div>
              <div className=" h-96 w-30">frame 3</div>
            </div>
            <Link to="/takepic" className="block relative mx-auto w-fit">
              촬영 시작
            </Link>
          </div>
          <UserSideBar />
        </div>
      </Layout>
    </>
  );
}

export default MakeBooth;
