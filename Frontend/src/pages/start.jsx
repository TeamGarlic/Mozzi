import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { Link } from "react-router-dom";

function Start() {
  return (
    <Layout>
      <NavBar />
      <div className="w-[calc(40rem)] flex-col justify-center items-center text-center mx-auto py-40">
        <div>메인메뉴</div>
        <div className=" flex-row justify-center items-center text-center">
          <Link to="/makebooth">방 만들기</Link>
          <Link to="/makebooth">방 참가하기</Link>
        </div>
      </div>
    </Layout>
  );
}

export default Start;
