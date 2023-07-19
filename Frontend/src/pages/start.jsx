import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { Link } from "react-router-dom";
import { UserGroupIcon, MapPinIcon } from "@heroicons/react/24/outline";

function Start() {
  return (
    <Layout>
      <>
        <NavBar />
        <div className="w-[calc(40rem)] flex-col justify-center items-center text-center mx-auto pt-40">
          <div className=" text-6xl pt-40">인 생 클 립</div>
          <div className=" flex justify-center items-center text-center gap-20 overflow-hidden">
            <div className="mt-20 w-30 h-30 rounded-3xl">
              <Link to="/makebooth" className="text-center">
                <MapPinIcon className="w-30 h-30" />
                <div>방 만들기</div>
              </Link>
            </div>
            <div className="mt-20 w-30 h-30 rounded-3xl">
              <Link to="/makebooth" className="text-center">
                <UserGroupIcon className="w-30 h-30" />
                <div>방 참여하기</div>
              </Link>
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Start;
