import { PhotoIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Layout from "../components/Layout";

function Start() {
  return (
    <Layout>
      <>
        <PhotoIcon className="fixed top-4 left-4 w-10 h-10 text-blue-600" />
        <Sidebar />
        <Link to="/makebooth">Make Booth</Link>
      </>
    </Layout>
  );
}

export default Start;
