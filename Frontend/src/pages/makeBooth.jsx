import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import UserSideBar from "../components/UserSideBar";
import EnterDialog from "@/components/EnterDialog";
import { useState } from "react";

function MakeBooth() {
  const [visibility, setVisibility] = new useState(true);
  const closeDialog = () => {
    setVisibility(false);
  };
  return (
    <>
      <EnterDialog visibility={visibility} onClick={closeDialog} />
      <Layout>
        <div className="h-10 w-full">Code : XXX_XXX_XXX</div>
        <UserSideBar />
        <Link to="/takepic" className="block relative mx-auto w-fit">
          Take Picture
        </Link>
      </Layout>
    </>
  );
}

export default MakeBooth;
