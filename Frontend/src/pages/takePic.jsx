import { useState } from "react";
// import { Link } from "react-router-dom";
import PicSideBar from "../components/PicSideBar";
import Layout from "../components/Layout";
import BigCam from "../components/BigCam";
import Chat from "@/components/Chat";
import MyRadioGroup from "@/components/MyRadioGroup";

function TakePic() {
  const [taken, setTaken] = new useState(1);
  const timers = [3, 5, 10];
  const [timer, setTimer] = useState(3);
  const [count, setCount] = useState(3);
  const [timerVisible, setTimerVisible] = useState(false);
  let interval;
  function timeChange(e) {
    setTimer(e.target.value);
    console.log(timer + "로 설정");
    setCount(e.target.value);
  }
  function take() {
    setTimerVisible(true);
    console.log(timer + "초 후 촬영");
    interval = setInterval(() => {
      console.log(interval);
      setCount((prev) => {
        let next = prev - 1;
        if (next === 0) {
          alert("찰칵!");
          clearInterval(interval);
          setTimerVisible(false);
          if (taken === 10) {
            location.href = "/0/aftertake";
          } else {
            setTaken(taken + 1);
          }
          return timer;
        }
        return next;
      });
    }, 1000);
  }

  // useEffect(() => {
  //   if (count === 0) {
  //     alert("찰칵!");
  //     clearInterval(interval);
  //     setCount(timer);
  //     setTimerVisible(false);
  //   }
  // }, [count]);
  return (
    <Layout>
      <>
        <Chat />
        <div className="w-full pt-4 ps-4">
          <div>
            <div className=" text-sm text-gray-500">
              초대 코드 : XXX_XXX_XXX
            </div>
            <div className="text-2xl">MOZZI</div>
          </div>
          <PicSideBar />
          {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
        </div>
        <BigCam />
        {/* <Link to="/aftertake" className="block relative mx-auto w-fit">
        찰칵
      </Link> */}
        <div className="flex justify-center items-center gap-20 fixed bottom-10 ms-[calc(25%)] w-1/2">
          {!timerVisible && (
            <MyRadioGroup
              arr={timers}
              name="timer"
              onChange={timeChange}
              nowState={Number(timer)}
              text={"⏲️"}
            />
          )}
          <div className="flex rounded-2xl bg-yellow-200 leading-10">
            <span className=" px-5 ">{taken}/10</span>
            <button
              className={`w-full leading-10  px-5  bg-red-300 rounded-r-2xl`}
              onClick={take}
              disabled={timerVisible}
            >
              {timerVisible ? <span>{count}</span> : <span>📷</span>}
            </button>
          </div>
        </div>
      </>
    </Layout>
  );
}

export default TakePic;
