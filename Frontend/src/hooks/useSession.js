import { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import boothApi from '@/api/boothApi.js';

function useSession(userName, shareCode) {
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
  };


  const joinSession = async (canvases) => {
    try {
      const OV = new OpenVidu();
      const mySession = OV.initSession();
      setSession(mySession);

      // 생성시 이벤트
      mySession.on('streamCreated', (event) => {
        const subscriber = mySession.subscribe(event.stream, undefined);
        setSubscribers([...subscribers, subscriber]);
      });

      // 언마운트시 이벤트
      mySession.on('streamDestroyed', (event) => {
        deleteSubscriber(event.stream.streamManager);
      });

      // 예외 처리
      mySession.on('exception', (exception) => {
        console.warn(exception);
      });


      const token = await getToken(shareCode);


      mySession.connect(token, { clientData: userName });


      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: canvases[1].current.captureStream(30).getVideoTracks()[0],
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });


      mySession.publish(publisher);


      setMainStreamManager(publisher);
      setPublisher(publisher);
      console.log(subscribers)
    } catch (error) {
      console.log('There was an error connecting to the session:', error.code, error.message);
    }
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

  useEffect(()=>{
    // TODO : userName, sessionId 설정 (이 위치에서 할 필요는 없음)

    const handleBeforeUnload = () => {
      leaveSession();
    };
    // TODO : 라이프사이클 확인
    window.addEventListener('beforeunload', leaveSession);

    // TODO : 라이프사이클 확인
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  },[]);

  return {session, mainStreamManager, publisher, subscribers, joinSession } ;
}

export default useSession;