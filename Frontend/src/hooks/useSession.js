import { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { v4 } from "uuid";
import boothApi from "@/api/boothApi.js";

function useSession(shareCode) {
  const [mainSession, setMainSession] = useState(undefined);
  const [maskSession, setMaskSession] = useState(undefined);
  const [mainPublisher, setMainPublisher] = useState(undefined);
  const [maskPublisher, setMaskPublisher] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const leaveSession = async () => {
    location.href = '/'
    if (mainSession) {
      await mainSession.disconnect();
    }
    if (maskSession) {
      await maskSession.disconnect();
    }
    await setMainSession(undefined);
    await setMaskSession(undefined);
    await setMainPublisher(undefined);
    await setMaskPublisher(undefined);
    await setSubscribers([]);
  };

  const joinSession = async (userName, canvases) => {
    await setUserName(userName);
    try {
      const mainOV = new OpenVidu();
      const maskOV = new OpenVidu();
      const mainSession = mainOV.initSession();
      const maskSession = maskOV.initSession();
      await setMainSession(mainSession);
      await setMaskSession(maskSession);

      // 생성시 이벤트
      mainSession.on("streamCreated", (event) => {
        const subscriber = mainSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      // 채팅 수신
      mainSession.on("signal:chat", async(event) => {
        console.log(event);
        let data = await JSON.parse(event.data);
        setChatLists((prev) => {
          return [...prev, data];
        });
      });

      //takePic 이동 신호 수신
      mainSession.on("signal:gotoTakePic", (event)=>{
        console.log("방장이 사진찍재!!");
      })

      // 언마운트시 이벤트
      mainSession.on("streamDestroyed", (event) => {
        deleteSubscriber(event.stream.streamManager);
      });

      // 예외 처리
      mainSession.on("exception", (exception) => {
        console.warn(exception);
      });
      maskSession.on("exception", (exception) => {
        console.warn(exception);
      });

      const mainToken = await getToken(shareCode);
      const maskToken = await getToken(shareCode);

      const uid = v4();
      await mainSession.connect(mainToken, {
        clientData: userName,
        isMask : false,
        uid : uid,
      });
      await maskSession.connect(maskToken, {
        clientData: userName,
        isMask : true,
        uid : uid,
      });

      const mainPublisher = await mainOV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: "APPEND",
        mirror: true,
      });
      const maskPublisher = await maskOV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: canvases[1].current.captureStream(30).getVideoTracks()[0],
        publishAudio: false,
        publishVideo: true,
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      await mainSession.publish(mainPublisher);
      await maskSession.publish(maskPublisher);
      await setMainPublisher(mainPublisher);
      await setMaskPublisher(maskPublisher);
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  // 채팅 메세지 신호 전송
  const sendMessage = async (message, userName) => {
    console.log({ from: userName+"", message: message });
    await mainSession.signal({
      data: JSON.stringify({ from: userName+"", message: message}), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: "chat", // The type of message (optional)
    });
  };

  //사진 촬영 페이지로 이동 신호
  const gotoTakePic = async()=>{
    await mainSession.signal({
      data : "",
      to:[],
      type:"gotoTakePic"
    });
  }

  const deleteSubscriber = (streamManager) => {
    const newSubscribers = [...subscribers];
    const idx = newSubscribers.indexOf(streamManager);
    if (idx > -1) newSubscribers.splice(idx, 1);
    setSubscribers(newSubscribers);
  };

  const getToken = async (code) => {
    let idRes = await boothApi.getSessionID(code);
    // console.log(idRes);
    const {
      data: {
        data: { sessionId },
      },
    } = idRes;
    let tokenRes = await boothApi.getToken(sessionId);
    // console.log(tokenRes);
    const {
      data: {
        data: { token },
      },
    } = tokenRes;
    return token;
  };

  useEffect(() => {

    const handleBeforeUnload = async () => {
      await leaveSession();
    };

    window.addEventListener("beforeunload", leaveSession);

    return () => {
      // handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return {
    mainSession,
    maskSession,
    subscribers,
    joinSession,
    sendMessage,
    chatLists,
    mainPublisher,
    leaveSession,
    gotoTakePic
  };
}

export default useSession;
