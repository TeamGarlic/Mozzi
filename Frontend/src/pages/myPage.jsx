import Layout from "@/components/Layout";
// import useInput from "@/hooks/useInput.js";
// import TextInput from "@/components/TextInput.jsx";
import useUser from "@/hooks/useUser";
import NavBar from "@/components/NavBar";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

function MyPage() {
  const { user } = useUser();
  const { username } = useParams();

  useEffect(() => {
    console.log(username);
    user ? console.log(user.name) : alert("로그인해주세요");
  }, [user]);

  return (
    <Layout>
      <>
        <NavBar user={user} />
        <div className="flex-col mt-20 px-20">
          <div className="w-full flex-col">
            <div className="text-2 text-gray-600">프로필</div>
            <div className="text-4xl">{username}</div>
          </div>
          <div className="py-5">
            <h1>내 사진</h1>
          </div>
          <hr />
          <div className="py-5">
            <h1>내 영상</h1>
          </div>
          <hr />
          <div className="py-5">
            <h1>친구 목록</h1>
          </div>
          <hr />
          {/* 정보를 보는 대상과 현재 사용자가 같을 경우 내정보수정 열림 */}

          {username === user.name ? (
            <button className="w-32 h-12 float-right leading-3 rounded-2xl mt-10 bg-yellow-300">
              내정보수정
            </button>
          ) : (
            <></>
          )}
        </div>
        {/* <div className="flex">
            <TextInput type="text" placeholder="ID" {...newID} />
          </div>
          <div className="flex">
            <TextInput type="password" placeholder="비밀번호" {...newPW} />
          </div>
          <div className="flex">
            <TextInput
              type="password"
              placeholder="비밀번호 확인"
              {...newPW2}
            />
          </div>
          <div className="flex">
            <TextInput type="text" placeholder="닉네임" {...newNick} />
          </div>
          <div className="flex pt-10">
            <button
              type="button"
              className="w-1/2 h-12 leading-3 rounded-s-2xl bg-yellow-300"
            >
              정보 수정
            </button>
            <button
              type="button"
              className="w-1/2 h-12 leading-3 rounded-e-2xl bg-red-400"
            >
              회원 탈퇴
            </button>
          </div> */}
      </>
    </Layout>
  );
}

export default MyPage;
