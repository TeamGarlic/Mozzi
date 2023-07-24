import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "@/pages/start";
import MakeBooth from "@/pages/makeBooth";
import TakePic from "@/pages/takePic";
import Booth from "@/pages/booth";
import AfterTake from "@/pages/afterfTake";
import Finish from "@/pages/finish";
import NoFile from "@/pages/404";
import LogIn from "@/pages/logIn";
import SignUp from "@/pages/signUp";
import ModifyUser from "@/pages/modifyUser";
import MyPage from "@/pages/myPage";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route 컴포넌트를 커스텀해서 로그인해야 들어갈 수 있는 링크인지 아닌지 검증 예정 */}
        {/* components 디렉토리 내에 PublicRoute, AuthRoute 컴포넌트 생성해서 할듯? */}
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/modify" element={<ModifyUser />} />
        <Route path="/mypage/:username" element={<MyPage />} />
        <Route path="/:code/booth" element={<Booth />} />
        <Route path="/:code/makebooth" element={<MakeBooth />} />
        <Route path="/:code/takepic" element={<TakePic />} />
        <Route path="/:code/aftertake" element={<AfterTake />} />
        <Route path="/:code/finish" element={<Finish />} />
        <Route path="*" element={<NoFile />} />
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
