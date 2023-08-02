import { Link } from "react-router-dom";
import { Card } from "@material-tailwind/react";
import { useRef, useEffect } from "react";
// import UserCard from "./UserCard";
import TextInput from "./TextInput";
import UserVideoComponent from "./UserVideoComponents";
import PropTypes from "prop-types";

export default function UserSideBar({ subscribers, mainPublisher }) {
  const myRef = useRef();
  console.log(subscribers);
  console.log(mainPublisher);

  useEffect(() => {
    console.log(subscribers)
    if (mainPublisher) {
      mainPublisher.addVideoElement(myRef.current);
    }
  }, [mainPublisher]);

  return (
    <Card
      id="sideMenu"
      className="fixed top-0 right-0 w-64 h-screen p-4 shadow-xl shadow-blue-gray-900/5 bg-transparent"
    >
      <div className="p-4">
        <span className=" text-xl">사용자</span>
      </div>
      <ul className="gap-4 overflow-y-scroll scrollbar-hide">
        {/* <canvas ref={myRef} /> */}
        <video autoPlay ref={myRef} />
        <hr />
        {/* <SmallCam /> */}
        {subscribers &&
          subscribers.map((sub) => (
            <>
              {/* <UserCard
              userName={sub.stream.connection.connectionId}
              key={sub.stream.connection.connectionId}
            /> */}
              {!JSON.parse(sub.stream.connection.data).isMask?(
              <div key={JSON.parse(sub.stream.connection.data).uid} className="stream-container col-md-6 col-xs-6">
                {/*<span>{JSON.parse(sub.stream.connection.data).clientData}</span>*/}
                <UserVideoComponent sub={sub} />
              </div>
              ):null}
            </>
          ))}
      </ul>
      <div className="px-4">
        <TextInput type="text" placeholder="이름 변경..." className="" />
      </div>
      <button type="button" className="w-full h-10">
        이름 변경
      </button>
      <Link className="w-full h-10 text-center leading-10" to="/">
        나가기
      </Link>
    </Card>
  );
}

UserSideBar.propTypes = {
  subscribers: PropTypes.array,
  mainPublisher: PropTypes.object,
};
