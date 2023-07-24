import Layout from "@/components/Layout";
import NavBar from "@/components/NavBar";
// import { Link } from "react-router-dom";
import useUser from "@/hooks/useUser";
import useInput from "@/hooks/useInput";
import { useState } from "react";
import TextInput from "@/components/TextInput";
import boothApi from "@/api/boothApi";

function Start() {
  const [showCode, setShowCode] = useState(false);
  const { user } = useUser();
  const code = useInput();
  function showCodeLine() {
    code.reset();
    setShowCode(!showCode);
  }

  async function makeBooth() {
    user ? (location.href = `/0/booth`) : alert("로그인해주세요!");
  }

  async function gotoBooth() {
    try {
      let res = await boothApi.joinBooth(code.value);
      console.log(res);
    } catch {
      alert("대충 부스가 있다 침");
      location.href = `/${code.value}/booth`;
    }
  }
  return (
    <Layout>
      <>
        <NavBar user={user} />
        <div className="w-[calc(40rem)] flex-col justify-center items-center text-center mx-auto pt-40">
          <div className=" text-2xl items-center">
            <img
              src="./src/assets/img/mozzi.png"
              className=" mx-auto w-72 h-72"
            />
          </div>
          <div className=" flex justify-center text-center gap-20">
            <div className="w-48 h-fit flex-col p-4">
              <button onClick={makeBooth} className="text-center">
                <img
                  src="./src/assets/img/makebooth.png"
                  className=" w-20 h-20 mx-auto hover:ring-2 rounded-xl ring-offset-2 ring-offset-transparent"
                />
              </button>
              <div className="mt-4 h-14 leading-10 text-lg">부스 만들기</div>
            </div>
            <div className="w-48 h-fit flex-col p-4">
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
                  <span
                    className="mt-2 leading-10 hover:cursor-pointer"
                    onClick={gotoBooth}
                  >
                    🔍
                  </span>
                  <span
                    className="mt-2 leading-10 hover:cursor-pointer"
                    onClick={showCodeLine}
                  >
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
