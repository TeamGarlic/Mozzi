import { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import { v4 } from "uuid";
import boothApi from "@/api/boothApi.js";
import {useDispatch} from "react-redux";
import {setFrameAction, AddClipAction} from "@/modules/clipAction.js";

function useSession(shareCode) {
  const [session, setSession] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [userName, setUserName] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const [nowTaking, setNowTaking] = useState(false);
  const [now, setNow] = useState("MAKING");
  const [taken, setTaken] = useState(1);
  const [timer, setTimer] = useState(3);
  const [position, setPosition] = useState({});
  const dispatch = useDispatch();

  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setPublisher(undefined);
    setSubscribers([]);
    location.href = "/";
  };

  const joinSession = async (userName, source) => {
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

      session.on("signal:setFrame", async (event) => {
        const frame = await JSON.parse(event.data);
        dispatch(setFrameAction({frame}))
      });

      session.on("signal:sendBlob", async (event) => {
        const data = await JSON.parse(event.data);
        // Todo: blob이 비어있을 경우 에러 발생
        // 합성 로직 이후 확인 필요
        const blobURL = window.URL.createObjectURL(data.blob);
        console.log(blobURL)
        dispatch(AddClipAction({idx: data.idx, src: blobURL}))
      });

      session.on("signal:timeChange", async (event) => {
        const data = await JSON.parse(event.data);
        setTimer(Number(data.time));
      });

      session.on("signal:sendPosition", async (event) => {
        const data = await JSON.parse(event.data);
        setPosition(data.position);
      });

      session.on("signal:startTaking", async () => {
        setNowTaking(true)
      })

      session.on("signal:finishTaking", async () => {
        setNowTaking(false);
        setTaken((prev) => prev+1);
      })

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

      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: source,
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: "APPEND",
        mirror: false,
      });

      await session.publish(publisher);
      await setPublisher(publisher);
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

  const setFrame = async (frame) => {
    await session.signal({
      data: JSON.stringify(frame),
      to: [],
      type: "setFrame",
    });
  };

  const sendBlob = async (idx, blob) => {
    await session.signal({
      data: JSON.stringify({idx: idx, blob: blob}),
      to: [],
      type: "sendBlob",
    });
  };

  const timeChange = async (time) => {
    setTimer(time);
    await session.signal({
      data: JSON.stringify({time: time}),
      to: [],
      type: "timeChange",
    });
  };

  const startTaking = async () => {
    await session.signal({
      data: "",
      to: [],
      type: "startTaking",
    })
  }

  const finishTaking = async () => {
    await session.signal({
      data: "",
      to: [],
      type: "finishTaking",
    })
  }

  const sendPosition = async (positions) => {
    // 방장이 모든 유저의 위치 정보를 전파
    await session.signal({
      data: JSON.stringify(positions),
      to: [],
      type: "setPosition",
    });
  };

  const updatePosition = async (position) => {
    // 참가자가 자신의 위치 정보 수정을 전파
    await session.signal({
      data: JSON.stringify(position),
      to: [],
      type: "setPosition",
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
    setFrame,
    sendBlob,
    timer,
    taken,
    timeChange,
    startTaking,
    finishTaking,
    position,
    setPosition,
    sendPosition,
    updatePosition,
  };
}

export default useSession;
