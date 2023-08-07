import { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { v4 } from "uuid";
import boothApi from "@/api/boothApi.js";

function useSession(shareCode) {
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [nowTaking, setNowTaking] = useState(false);
  const [now, setNow] = useState("MAKING");

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    location.href = "/";
  };

  const joinSession = async (userName, canvas) => {
    setUserName(userName);
    try {
      const OV = new OpenVidu();
      const session = OV.initSession();
      setSession(session);

      session.on("streamCreated", (event) => {
        const subscriber = session.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });

      session.on("signal:chat", async (event) => {
        console.log(event);
        let data = await JSON.parse(event.data);
        setChatLists((prev) => {
          return [...prev, data];
        });
      });

      session.on("signal:gotoTakePic", async (event) => {
        console.log("방장이 사진찍재!!");
        // setNowTaking(true);
        setNow("TAKING");
      });

      session.on("signal:gotoModifing", async (event) => {
        console.log("방장이 편집하쟤!!");
        // setNowTaking(true);
        setNow("MODIFING");
      });

      session.on("signal:gotoFinish", async (event) => {
        console.log("방장이 사진찍재!!");
        // setNowTaking(true);
        setNow("FINISH");
      });

      session.on("streamDestroyed", (event) => {
        setSubscribers((prev) => {
          const newSubscribers = [...prev];
          const idx = newSubscribers.indexOf(event.stream.streamManager);
          console.log(newSubscribers);
          if (idx < 0) return;
          newSubscribers.splice(idx, 1);
          return [...newSubscribers];
        });
      });

      session.on("exception", (exception) => {
        console.warn(exception);
      });

      const token = await getToken(shareCode);

      const uid = v4();
      await session.connect(token, {
        clientData: userName,
        uid: uid,
      });

      const mainPublisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: canvas.current.captureStream(30).getVideoTracks()[0],
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      await session.publish(mainPublisher);
      await setPublisher(mainPublisher);
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
    await session.signal({
      data: JSON.stringify({ from: userName + "", message: message }),
      to: [],
      type: "chat",
    });
  };

  const gotoTakePic = async () => {
    await session.signal({
      data: "",
      to: [],
      type: "gotoTakePic",
    });
  };

  const gotoModifing = async () => {
    await session.signal({
      data: "",
      to: [],
      type: "gotoModifing",
    });
  };

  const gotoFinish = async () => {
    await session.signal({
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
    session,
    subscribers,
    joinSession,
    sendMessage,
    chatLists,
    publisher,
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
