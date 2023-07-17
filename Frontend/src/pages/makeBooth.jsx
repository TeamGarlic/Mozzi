import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import UserSideBar from "../components/UserSideBar";

function MakeBooth() {
  return (
    <Layout>
      <div className="h-10 w-full">Code : XXX_XXX_XXX</div>
      <UserSideBar />
      <Link to="/takepic" className="block relative mx-auto w-fit">
        Take Picture
      </Link>
    </Layout>
  );
}

export default MakeBooth;
