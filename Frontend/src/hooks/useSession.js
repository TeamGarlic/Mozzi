import { useEffect, useState } from 'react';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';
import { useSelector } from 'react-redux';

// TODO : APPLICATION_SERVER_URL 삭제하고 boothApi.js 안의 메소드 사용
const APPLICATION_SERVER_URL = 'https://ssafyscheduler.ddns.net:40000/';

function useSession(userName, shareCode) {
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const {camStream, maskStream} = useSelector((state)=>({
    camStream : state.canvasReducer.camStream,
    maskStream : state.canvasReducer.maskStream,
  }));
  const leaveSession = () => {
    if (session) {
      session.disconnect();
    }
    setSession(undefined);
    setMainStreamManager(undefined);
    setPublisher(undefined);
    setSubscribers([]);
  };


  const joinSession = async () => {
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


      const token = await getToken();


      mySession.connect(token, { clientData: userName });


      const publisher = await OV.initPublisherAsync(undefined, {
        audioSource: undefined,
        videoSource: camStream.stream,
        publishAudio: true,
        publishVideo: true,
        frameRate: 30,
        insertMode: 'APPEND',
        mirror: false,
      });


      mySession.publish(publisher);


      setMainStreamManager(publisher);
      setPublisher(publisher);
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


  const getToken = async () => {
    const receivedId = await createSession(shareCode);
    return await createToken(receivedId);
  };


  // TODO : @/api/boothApi.js 에 합치기
  const createSession = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions',
      { customSessionId: sessionId },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The sessionId
  };

  // TODO : @/api/boothApi.js 에 합치기
  const createToken = async (sessionId) => {
    const response = await axios.post(
      APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections',
      {},
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return response.data; // The token
  };


  useEffect(()=>{
    // TODO : userName, sessionId 설정 (이 위치에서 할 필요는 없음)

    const handleBeforeUnload = () => {
      leaveSession();
    };
    // TODO : 라이프사이클 확인
    window.addEventListener('beforeunload', leaveSession);

    joinSession();
    console.log("joined!!!");

    // TODO : 라이프사이클 확인
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  },[]);

  return {session, mainStreamManager, publisher, subscribers } ;
}

export default useSession;