import { BrowserRouter, Routes, Route } from "react-router-dom";
import Start from "@/pages/start";
import Booth from "@/pages/booth";
import NoFile from "@/pages/404";
import LogIn from "@/pages/logIn";
import SignUp from "@/pages/signUp";
import ModifyUser from "@/pages/modifyUser";
import MyPage from "@/pages/myPage";
import Community from "@/pages/community";
import Detail from "@/pages/detail";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/modify" element={<ModifyUser />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/community" element={<Community />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/:code/booth" element={<Booth />} />
        <Route path="*" element={<NoFile />} />
      </Routes>
    </BrowserRouter>
  );
}
export default Router;
