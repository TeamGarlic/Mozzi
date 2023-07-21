import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
import { Link } from "react-router-dom";
import useUser from "@/hooks/useUser";
import useInput from "@/hooks/useInput";
import { useState } from "react";
import TextInput from "@/components/TextInput";

function Start() {
  const [showCode, setShowCode] = useState(false);
  const { user } = useUser();
  const code = useInput();
  console.log(user);
  function showCodeLine() {
    setShowCode(!showCode);
  }
  function gotoBooth() {
    location.href = `/${code.value}/booth`;
  }
  return (
    <Layout>
      <>
        <NavBar />
        <div className="w-[calc(40rem)] flex-col justify-center items-center text-center mx-auto pt-40">
          <div className=" text-6xl pt-40">인 생 클 립</div>
          <div className=" flex justify-center text-center gap-20">
            <div className="mt-20 w-48 h-fit flex-col p-4">
              <Link to="/0/booth" className="text-center">
                <img
                  src="./src/assets/img/makebooth.png"
                  className=" w-20 h-20 mx-auto hover:ring-2 rounded-xl ring-offset-2 ring-offset-transparent"
                />
              </Link>
              <div className="mt-4 h-14 leading-10 text-lg">부스 만들기</div>
            </div>
            <div className="mt-20 w-48 h-fit flex-col p-4">
              <img
                src="./src/assets/img/gotobooth.png"
                className=" w-20 h-20 mx-auto hover:ring-2 rounded-xl ring-offset-2 ring-offset-transparent"
                onClick={showCodeLine}
              />
              {!showCode ? (
                <div className="mt-4 h-14 leading-10 text-lg">
                  부스 참여하기
                </div>
              ) : (
                <div className="mt-2 h-14 flex leading-10 text-lg gap-2">
                  <TextInput type="text" placeholder="코드 입력" {...code} />
                  <span className="mt-2 leading-10" onClick={gotoBooth}>
                    🔍
                  </span>
                  <span className="mt-2 leading-10" onClick={showCodeLine}>
                    ❌
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default Start;
