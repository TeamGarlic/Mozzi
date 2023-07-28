import Layout from "../components/Layout";
import { Link } from "react-router-dom";

function NoFile() {
  return (
    <Layout>
      <div className="w-full h-fit justify-center items-center text-center">
        존재하지 않는 페이지입니다!
        <br />
        <Link to="/">홈으로 돌아가기</Link>
      </div>
    </Layout>
  );
}

export default NoFile;
