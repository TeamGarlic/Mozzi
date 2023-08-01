import { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import boothApi from "@/api/boothApi.js";

function useSession(userName, shareCode) {
  const [mainSession, setMainSession] = useState(undefined);
  const [maskSession, setMaskSession] = useState(undefined);
  const [mainPublisher, setMainPublisher] = useState(undefined);
  const [maskPublisher, setMaskPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [chatLists, setChatLists] = useState([]);
  const leaveSession = () => {
    if (mainSession) {
      mainSession.disconnect();
    }
    if (maskSession) {
      maskSession.disconnect();
    }
    setMainSession(undefined);
    setMaskSession(undefined);
    setMainPublisher(undefined);
    setMaskPublisher(undefined);
    setSubscribers([]);
  };

  const joinSession = async (canvases) => {
    try {
      const mainOV = new OpenVidu();
      const maskOV = new OpenVidu();
      const mainSession = mainOV.initSession();
      const maskSession = maskOV.initSession();
      setMainSession(mainSession);
      setMaskSession(maskSession);

      // 생성시 이벤트
      mainSession.on("streamCreated", (event) => {
        const subscriber = mainSession.subscribe(event.stream, undefined);
        setSubscribers((prev) => [...prev, subscriber]);
      });
      // TODO : mask subscribe 필요한지 확인
      // maskSession.on('streamCreated', (event) => {
      //     const subscriber = maskSession.subscribe(event.stream, undefined);
      //     setSubscribers([...subscribers, subscriber]);
      //   });

      // 채팅 수신
      mainSession.on("signal:chat", (event) => {
        console.log(event);
        let data = { ...JSON.parse(event.data), id: event.from.connectionId };
        setChatLists((prev) => {
          return [...prev, data];
        });
      });

      // 언마운트시 이벤트
      mainSession.on("streamDestroyed", (event) => {
        deleteSubscriber(event.stream.streamManager);
      });
      // // TODO : mask unsubscribe 필요한지 확인
      // maskSession.on('streamDestroyed', (event) => {
      //   deleteSubscriber(event.stream.streamManager);
      // });

      // 예외 처리
      mainSession.on("exception", (exception) => {
        console.warn(exception);
      });
      maskSession.on("exception", (exception) => {
        console.warn(exception);
      });

      const mainToken = await getToken(shareCode);
      const maskToken = await getToken(shareCode);

      mainSession.connect(mainToken, { clientData: userName });
      maskSession.connect(maskToken, { clientData: userName + "_mask" });

      const mainPublisher = await mainOV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: canvases[0].current.captureStream(30).getVideoTracks()[0],
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

      mainSession.publish(mainPublisher);
      maskSession.publish(maskPublisher);
      setMainPublisher(mainPublisher);
      setMaskPublisher(maskPublisher);
    } catch (error) {
      console.log(
        "There was an error connecting to the session:",
        error.code,
        error.message
      );
    }
  };

  const sendMessage = (message) => {
    mainSession.signal({
      data: JSON.stringify({ from: userName, message: message }), // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: "chat", // The type of message (optional)
    });
  };

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
    // TODO : userName, sessionId 설정 (이 위치에서 할 필요는 없음)

    const handleBeforeUnload = () => {
      leaveSession();
    };
    // TODO : 라이프사이클 확인
    window.addEventListener("beforeunload", leaveSession);

    // TODO : 라이프사이클 확인
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
  };
}

export default useSession;
