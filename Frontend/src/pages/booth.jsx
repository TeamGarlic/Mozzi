import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetCamCanvasesAction,
  setMyLayerSourceAction, updatePubVideoMapAction, updateSubVideoMapAction,
} from '@/modules/canvasAction.js';
import MakeBooth from "./makeBooth";
import TakePic from "./takePic";
import AfterTake from "./afterfTake";
import Finish from "./finish";
import { useParams, useLocation } from "react-router-dom";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import { drawCanvas, drawMask, chromaKey } from "@/utils/videoUtil.js";
import useSession from "@/hooks/useSession.js";
import { changeBgAction } from "@/modules/bgAction.js";
import useUser from "@/hooks/useUser";
import { checkHost } from "@/utils/DecoratorUtil.js";
import itemApi from "@/api/itemApi.js";

function Booth() {
  // const [taking, setTaking] = useState(false);
  const { code: shareCode } = useParams();
  const dispatch = useDispatch();
  // console.log(sessionID);
  const location = useLocation();
  const { user, checkUser } = useUser({
    isHost: location.state ? location.state.isHost : 1,
  });
  const [bgList, setBgList] = useState([]);
  const [frameList, setFrameList] = useState([]);
  const pickedFrame = useSelector((state) => state.clipReducer.frame);

  const {
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
  } = useSession(shareCode);

  // 소스 웹캠 video
  const webcamRef = useRef();
  // 배경 제거된 영상 그리는 canvas, context, layer 정보
  const bgRemovedRef = useRef();
  const bgRemovedContextRef = useRef();

  const camCanvases = useSelector((state) => state.canvasReducer.camCanvases);
  const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
  const myLayer = useSelector((state) => state.canvasReducer.myLayer);
  const pubVideoMap = useSelector((state) => state.canvasReducer.pubVideoMap);
  const subVideoMap = useSelector((state) => state.canvasReducer.subVideoMap);

  const bgNow = useSelector((state) => state.bgReducer.bgNow);

  const pubVideoRef = useRef();
  const pubCanvasRef = useRef();

  const subVideoRefs = useRef({});
  const subCanvasRefs = useRef({});
  const localVideoMap = {};

  function startTake() {
    if (pickedFrame.id === 0) return;
    dispatch(resetCamCanvasesAction());
    gotoTakePic();
    setTaking(true);
  }
  startTake = checkHost(startTake, user.isHost);

  const onResults = (results) => {
    drawMask(bgRemovedRef.current, bgRemovedContextRef.current, results);
    // console.log(pubVideoMap)
    chromaKey(pubVideoMap.canvasRef, pubVideoMap.canvasContextRef, pubVideoMap.vidRef);

    // console.log(videoMap);
    // for (var key in videoMap) {
    //   drawSubscriber(
    //     videoMap[key].canvasRef,
    //     videoMap[key].canvasContextRef,
    //     "vidRef" in videoMap[key] ? videoMap[key].vidRef : webcamRef.current,
    //     videoMap[key].maskRef
    //   );
    // }

    // // 내 웹캠을 담을 canvas (화면에 표시 x)
    // drawMyVid(
    //   bgRemovedRef,
    //   bgRemovedContextRef,
    //   results,
    // );

    // camCanvases.forEach((e) => {
    //   drawMyVid(e.canvas, e.context, results);
    // });

    // TODO : 한 레이어만 그리는 샘플 코드 지우기
    if (mainCanvas.canvas)
      drawCanvas(mainCanvas.canvas, mainCanvas.context, bgNow.img, [myLayer]);

    // TODO : 캔버스에 그리기
    // drawCanvas(canvasRef,canvasContextRef,bgImg,layers);
  };

  async function getBgList(pageNum, pageSize) {
    try {
      let res = await itemApi.getBgList(pageNum, pageSize);
      if (res.status === 200) {
        setBgList(res.data.data.backgrounds);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function getFrameList() {
    try {
      let res = await itemApi.getFrameList();
      if (res.status === 200) {
        setFrameList(res.data.data.frames);
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    checkUser();
    getFrameList();
    // TODO : bgImg를 Redux에서 관리
    const bgImg = new Image();
    bgImg.src = "https://api.mozzi.lol/files/object/1691022079984_bg2.jpg";
    bgImg.crossOrigin = "anonymous";
    dispatch(changeBgAction({ img: bgImg }));
    bgRemovedContextRef.current = bgRemovedRef.current.getContext("2d");
    const constraints = {
      video: { width: { max: 1280 }, height: { max: 720 } },
    };
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      webcamRef.current.srcObject = stream;
      sendToMediaPipe();
    });
    const selfieSegmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });
    selfieSegmentation.setOptions({
      modelSelection: 1,
      selfieMode: true,
    });
    selfieSegmentation.onResults(onResults);
    const sendToMediaPipe = async () => {
      if (!webcamRef.current.videoWidth) {
        requestAnimationFrame(sendToMediaPipe);
      } else {
        await selfieSegmentation.send({ image: webcamRef.current });
        requestAnimationFrame(sendToMediaPipe);
      }
    };
    dispatch(
      setMyLayerSourceAction({
        canvas: bgRemovedRef,
      })
    );
    joinSession(user.userNickname, bgRemovedRef);
    getBgList(1, 10);
  }, []);

  useEffect(() => {
    console.log(subscribers);
    // console.log(subVideoRefs);
    // console.log(subCanvasRefs);
    for (let key in localVideoMap) {
      delete localVideoMap[key];
    }
    if (subscribers) {
      subscribers.forEach((sub) => {
        localVideoMap[JSON.parse(sub.stream.connection.data).uid] = {
          ...localVideoMap[JSON.parse(sub.stream.connection.data).uid],
          vidRef:
            subVideoRefs.current[JSON.parse(sub.stream.connection.data).uid],
          canvasRef:
            subCanvasRefs.current[JSON.parse(sub.stream.connection.data).uid],
          canvasContextRef:
            subCanvasRefs.current[
              JSON.parse(sub.stream.connection.data).uid
              ].getContext("2d"),
        };
        sub.addVideoElement(
          subVideoRefs.current[JSON.parse(sub.stream.connection.data).uid]
        );
      });
    }
    console.log(localVideoMap);
    dispatch(updateSubVideoMapAction(localVideoMap));
    console.log(subVideoMap);
  }, [subscribers]);


  useEffect(() => {
    if (publisher){
      publisher.addVideoElement(pubVideoRef.current);
      dispatch(updatePubVideoMapAction({
        vidRef:pubVideoRef.current,
        canvasRef:pubCanvasRef.current,
        canvasContextRef:pubCanvasRef.current.getContext("2d"),
      }));
    }
  }, [publisher]);

  return (
    <>
      {now === "MAKING" && (
        <MakeBooth
          startTake={startTake}
          shareCode={shareCode}
          subscribers={subscribers}
          publisher={publisher}
          leaveSession={leaveSession}
          gotoTakePic={gotoTakePic}
          frameList={frameList}
          user={user}
        />
      )}
      {now === "TAKING" && (
        <TakePic
          shareCode={shareCode}
          sendMessage={sendMessage}
          chatLists={chatLists}
          user={user}
          bgList={bgList}
          goNext={gotoModifing}
        />
      )}
      {now === "MODIFING" && (
        <AfterTake goNext={gotoFinish} user={user} />
      )}
      {now === "FINISH" && <Finish />}
      <video autoPlay ref={webcamRef} className="hidden" />
      <canvas ref={bgRemovedRef}  width={1280} height={720} className="hidden" />

      <video ref={pubVideoRef} className="hidden" ></video>
      <canvas ref={pubCanvasRef}  width={1280} height={720} className=" " />
      {subscribers &&
        subscribers.map((sub) => {
          return (
            <div key={sub.stream.connection.connectionId}>
              <video
                ref={(elem) =>
                  (subVideoRefs.current[JSON.parse(sub.stream.connection.data).uid] = elem)
                }
                className="hidden"
              ></video>
              <canvas
                ref={(elem) =>
                  (subCanvasRefs.current[JSON.parse(sub.stream.connection.data).uid] = elem)
                }
                className=" "
              ></canvas>
            </div>
          );
        })}
    </>
  );
}

export default Booth;
