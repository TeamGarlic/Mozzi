import Layout from "../components/Layout";
import UserSideBar from "../components/UserSideBar";
import EnterDialog from "@/components/EnterDialog";
import PropTypes from "prop-types";
import { useState } from "react";

function MakeBooth({ startTake }) {
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
            <div>
              <div className=" text-sm text-gray-500">
                초대 코드 : XXX_XXX_XXX
              </div>
              <div className="text-2xl">MOZZI</div>
            </div>
            <div className=" text-2xl p-4">프레임 선택</div>
            <div className="gap-6 p-4 mr-[calc(17rem)]  overflow-x-scroll scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-hide">
              <div className=" inline-flex flex-nowrap h-[calc(25rem)] gap-4 p-4">
                <span className="w-96 border-2 float-left">frame 2</span>
                <div className=" w-96 border-2 float-left">frame 3</div>
                <div className=" w-96 border-2 float-left">frame 4</div>
                <div className=" w-96 border-2 float-left">frame 5</div>
                <div className=" w-96 border-2 float-left">frame 6</div>
                <div className=" w-96 border-2 float-left">frame 7</div>
                <div className=" w-96 border-2 float-left">frame 8</div>
              </div>
            </div>
            <div className="w-full pt-32">
              <button
                onClick={startTake}
                className=" block relative mx-auto w-fit"
              >
                촬영 시작
              </button>
            </div>
          </div>
          <UserSideBar />
        </div>
      </Layout>
    </>
  );
}

export default MakeBooth;

MakeBooth.propTypes = {
  startTake: PropTypes.func,
};
