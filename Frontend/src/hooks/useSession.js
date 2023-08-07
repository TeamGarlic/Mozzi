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
  const [nowTaking, setNowTaking] = useState(false);
  const [now, setNow] = useState("MAKING");

  const leaveSession = async () => {
    if (mainSession) {
      await mainSession.disconnect();
    }
    if (maskSession) {
      await maskSession.disconnect();
    }
    setMainSession(undefined);
    setMaskSession(undefined);
    setMainPublisher(undefined);
    setMaskPublisher(undefined);
    setSubscribers([]);
    location.href = "/";
  };

  const joinSession = async (userName, canvases) => {
    setUserName(userName);
    try {
      const mainOV = new OpenVidu();
      const maskOV = new OpenVidu();
      const mainSession = mainOV.initSession();
      const maskSession = maskOV.initSession();
      setMainSession(mainSession);
      setMaskSession(maskSession);

      mainSession.on("streamCreated", (event) => {
        const subscriber = mainSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      mainSession.on("signal:chat", async (event) => {
        console.log(event);
        let data = await JSON.parse(event.data);
        setChatLists((prev) => {
          return [...prev, data];
        });
      });

      mainSession.on("signal:gotoTakePic", async (event) => {
        console.log("방장이 사진찍재!!");
        // setNowTaking(true);
        setNow("TAKING");
      });

      mainSession.on("signal:gotoModifing", async (event) => {
        console.log("방장이 편집하쟤!!");
        // setNowTaking(true);
        setNow("MODIFING");
      });

      mainSession.on("signal:gotoFinish", async (event) => {
        console.log("방장이 사진찍재!!");
        // setNowTaking(true);
        setNow("FINISH");
      });

      mainSession.on("streamDestroyed", (event) => {
        setSubscribers((prev) => {
          const newSubscribers = [...prev];
          const idx = newSubscribers.indexOf(event.stream.streamManager);
          console.log(newSubscribers);
          if (idx < 0) return;
          newSubscribers.splice(idx, 1);
          return [...newSubscribers];
        });
      });

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
        isMask: false,
        uid: uid,
      });
      await maskSession.connect(maskToken, {
        clientData: userName,
        isMask: true,
        uid: uid,
      });

      const mainPublisher = await mainOV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
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

  const sendMessage = async (message, userName) => {
    console.log({ from: userName + "", message: message });
    await mainSession.signal({
      data: JSON.stringify({ from: userName + "", message: message }),
      to: [],
      type: "chat",
    });
  };

  const gotoTakePic = async () => {
    await mainSession.signal({
      data: "",
      to: [],
      type: "gotoTakePic",
    });
  };

  const gotoModifing = async () => {
    await mainSession.signal({
      data: "",
      to: [],
      type: "gotoModifing",
    });
  };

  const gotoFinish = async () => {
    await mainSession.signal({
      data: "",
      to: [],
      type: "gotoFinish",
    });
  };

  const getToken = async (code) => {
    let idRes = await boothApi.getSessionID(code);
    const {
      data: {
        data: { sessionId },
      },
    } = idRes;
    let tokenRes = await boothApi.getToken(sessionId);
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
    gotoTakePic,
    gotoModifing,
    gotoFinish,
    nowTaking,
    now,
    setNow,
  };
}

export default useSession;
