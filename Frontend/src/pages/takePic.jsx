import { Link } from "react-router-dom";
import PicSideBar from "../components/PicSideBar";
import Layout from "../components/Layout";
import BigCam from "../components/BigCam";

function TakePic() {
  return (
    <Layout>
      <div className="h-10 w-full text-blue-600">
        Code : XXX_XXX_XXX
        <PicSideBar />
        <div className="float-right mr-10">taken : 1/10</div>
      </div>
      <BigCam />
      <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link>
    </Layout>
  );
}

export default TakePic;
