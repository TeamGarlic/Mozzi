import { useState } from "react";
import { Card } from "@material-tailwind/react";
import UserList from "./UserList";
import BgCard from "./BgCard";
import { UsersIcon } from "@heroicons/react/24/outline";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import ImageUploader from "react-image-upload";
import 'react-image-upload/dist/index.css'
import {checkHost} from "@/utils/DecoratorUtil.js";
import boothApi from "@/api/boothApi.js";
import {changeBgAction} from "@/modules/bgAction.js";
import {useDispatch} from "react-redux"

export default function PicSideBar({user, bgList, changeBg, position, sendPosition, setPosition, subscribers, publisher, setAlertModal, toggleMic, subVideoRefs, shareCode, shareSecret, tempBg, sendBg}) {
  const [menu, setMenu] = useState(0);
  const [file, setFile] = useState();
  const [idx, setIdx] = useState(0);
  const dispatch = useDispatch();

  function getImageFileObject(imageFile){
    console.log(imageFile)
    const fileToBase64 = file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise(resolve => {
        reader.onloadend = () => {
          resolve(reader.result);
        };
      });
    };
    fileToBase64(imageFile.file).then(res => {
      const date = new Date().toLocaleTimeString();
      uploadBg(res, `${shareCode}${idx}${date}`)
      setIdx((prev) => prev+1)
    });
  }

  async function uploadBg(file, fileName) {
    try {
      let res = await boothApi.uploadClip(fileName, shareCode, file);
      console.log(res)
      if (res.status === 200) {
        sendBg(fileName, shareSecret)
      }
    } catch (e) {
      console.log(e);
    }
  }

  function imageDelete() {
  }

  function setBg(){
    if (!tempBg) return;
    changeBg("")
  }
  setBg = checkHost(setBg, user.isHost, setAlertModal)
  return (
      <>
        <div className={`fixed z-30 flex-col gap-3 h-fit top-5 ${menu === 0 ? "right-0" : "right-[calc(18rem)]"}`}>
            <div
                className={`w-14 bg-white pl-1 py-2 mb-0.5 border-l border-y border-blue-300 rounded-l-2xl ${menu === 1?"":"border-r"}`}
                onClick={() =>  setMenu(menu===1?0:1)} >
                <UsersIcon />
                <div className="whitespace-nowrap text text-center">사용자</div>
                <div className="whitespace-nowrap text text-center">목록</div>
            </div>
            <div
                className={`w-14 bg-white pl-1 py-2 mb-0.5 border-l border-y border-blue-300 rounded-l-2xl ${menu === 2?"":"border-r"}`}
                onClick={() =>  setMenu(menu===2?0:2)} >
                <ComputerDesktopIcon />
                <div className="whitespace-nowrap text text-center">배경</div>
                <div className="whitespace-nowrap text text-center">바꾸기</div>
            </div>
        </div>
    <div className="fixed z-10 top-0 right-0 flex">
        <Card
          id="sideMenu"
          className={`h-screen w-[calc(18rem)] shadow-xl shadow-blue-gray-900/5 p-4 overflow-y-scroll bg-white scrollbar-hide rounded-e-none ${
            menu === 0 ? "hidden" : ""
          }`}
        >
            <div className={`h-full ${menu === 1?"":"collapse fixed"}`}>
              <UserList
                user={user}
                position={position}
                sendPosition={sendPosition}
                setPosition={setPosition}
                subscribers={subscribers}
                publisher={publisher}
                setAlertModal={setAlertModal}
                toggleMic={toggleMic}
                subVideoRefs={subVideoRefs}
              />
            </div>
            <div className={`h-full ${menu === 2?"":"collapse fixed"}`}>
              <div className="row-auto text-center">
                <div className="text-2xl">
                    배경화면 바꾸기
                </div>
                <div className="text-sm text-slate-600 whitespace-nowrap">
                    방장이 배경화면을 바꿀 수 있습니다
                </div>
                <div>
                  <div onClick={setBg} className="flex-col shadow border select-none cursor-pointer bg-white dark:bg-gray-800 rounded-md flex flex-1 items-center p-2 my-2 w-full h-[9/16]">
                    <ImageUploader
                      onFileAdded={(img) => getImageFileObject(img)}
                      onFileRemoved={(img) => imageDelete(img)}
                    />
                  </div>

                </div>
              {bgList.map((bg) => (
                <BgCard 
                  bgName={bg.title}
                  key={bg.id} 
                  bgSrc={bg.objectName} 
                  user={user} 
                  changeBg={changeBg}
                  setAlertModal={setAlertModal}
                />
              ))}
                </div>
            </div>
          {menu === 3 && <div>스티커</div>}
        </Card>
    </div>
        </>
  );
}

PicSideBar.propTypes = {
  bgList: PropTypes.array,
  user: PropTypes.shape({
    id: PropTypes.number,
    userId: PropTypes.string,
    userNickname: PropTypes.string,
    email: PropTypes.string,
    isHost: PropTypes.number,
  }),
  changeBg: PropTypes.func,
  position: PropTypes.array,
  sendPosition: PropTypes.func,
  setPosition: PropTypes.func,
  subscribers: PropTypes.array,
  publisher: PropTypes.any,
  setAlertModal: PropTypes.func,
  toggleMic: PropTypes.func,
  subVideoRefs: PropTypes.any,
  shareCode: PropTypes.string,
  shareSecret: PropTypes.string,
  tempBg: PropTypes.any,
  sendBg: PropTypes.func,
};
