import {useState, useEffect} from "react";
import PicSideBar from "@/components/PicSideBar";
import Layout from "@/components/Layout";
import BigCam from "@/components/BigCam";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";
import {checkHost} from "@/utils/DecoratorUtil.js";
import boothApi from "@/api/boothApi.js";
import RecordingModal from "@/components/RecordingModal.jsx";
import WaitingRecordModal from "@/components/WaitingRecordModal.jsx";
import {CameraIcon, ClockIcon} from "@heroicons/react/20/solid/index.js";

function TakePic({
        shareCode,
        user,
        bgList,
        goNext,
        timer,
        taken,
        timeChange,
        startTaking,
        finishTaking,
        nowTaking,
        myId,
        updatePosition,
        changeBg,
        position,
        sendPosition,
        setPosition,
        sendFileName,
        shareSecret,
        publisher,
        subscribers,
        setAlertModal,
        toggleMic,
    }) {
    const timers = [3, 5, 10];
    const MAX_CLIPS = 10;
    const [count, setCount] = useState(3);
    const [timerVisible, setTimerVisible] = useState(false);
    const [isTaking, setIsTaking] = useState(false);
    var interval;
    const mainCanvas = useSelector((state) => state.canvasReducer.mainCanvas);
    let mediaRecorder = null;
    const arrClipData = [];
    const [recordingModal, setRecordingModal] = useState(false);
    const [waitingModal, setWaitingModal] = useState(false);


    // const clipList = useSelector(state => state.clipReducer.clipList);

    function closeRecordingModal() {
        setRecordingModal(false)
    }

    function closeWaitingModal() {
        setWaitingModal(false)
    }

    function recordClip(idx) {
        const mediaStream = mainCanvas.canvas.current.captureStream();
        mediaRecorder = new MediaRecorder(mediaStream);
        mediaRecorder.ondataavailable = (event) => {
            arrClipData.push(event.data);
        };
        mediaRecorder.onstop = () => {
            const blob = new Blob(arrClipData);
            const fileName = `clip${taken}.webm`;
            const file = new File([blob], fileName, {type: "video/webm"})
            const fileToBase64 = file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise(resolve => {
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                });
            };
            fileToBase64(file).then(res => {
                uploadClip(res, fileName, taken)
            });
            // uploadClip(file, fileName, taken)
            arrClipData.splice(0);
        };

        // 녹화 시작
        mediaRecorder.start();
        console.log("촬영시작");
        // Todo: 현재는 시간에 dependent => 프레임 단위로 전환 필요함
        setTimeout(() => {
            // 녹화 종료
            mediaRecorder.stop();
            if (taken == MAX_CLIPS) {
                goNext();
            } else {
                finishTaking();
            }
        }, 5000);
    }

    async function uploadClip(file, fileName, idx) {
        try {
            let res = await boothApi.uploadClip(fileName, shareCode, file);
            if (res.status === 200) {
                sendFileName(idx, fileName, shareSecret)
            }
        } catch (e) {
            console.log(e);
        }
    }

    function setTime(e) {
        timeChange(e.target.value)
    }

    function take() {
        startTaking();
        // startCount();
    }

    function startCount() {
        let localTaking = 0;
        setIsTaking(false);
        setTimerVisible(true);
        setWaitingModal(true);
        // console.log(timer + "초 후 촬영");
        interval = setInterval(() => {
            // console.log(interval);
            setCount((prev) => {
                let next = prev - 1;
                if (localTaking === 0 && next === 0) {
                    // 대기 시간 후 촬영 시작(next 초 만큼)
                    next = 5;
                    setIsTaking(true);
                    localTaking = 1;
                    recordClip(taken);
                    setWaitingModal(false);
                    setRecordingModal(true);
                } else if (localTaking === 1 && next === 0) {
                    clearInterval(interval);
                    setTimerVisible(false);
                    setIsTaking(false);
                    setRecordingModal(false);
                    return timer;
                }
                return next;
            });
        }, 1000);
    }

    function exit(){
        if(taken==1){
            alert("최소 한 개 이상의 클립을 촬영해야 합니다");
            return;
        }
        // TODO : 이게 진짜 필요할까...??
        confirm("정말로 촬영을 종료하고 편집 페이지로 넘어가시겠습니까?")?goNext():"";
    }

    take = checkHost(take, user.isHost, setAlertModal);
    recordClip = checkHost(recordClip, user.isHost, setRecordingModal);
    setTime = checkHost(setTime, user.isHost, setAlertModal);

    useEffect(() => {
        if (nowTaking) startCount();
    }, [nowTaking])

    useEffect(() => {
        setCount(timer);
    }, [timer]);
    return (
        <Layout>
            <>
                {recordingModal && (
                    <RecordingModal closeRecordingModal={closeRecordingModal}/>
                )}
                {waitingModal && (
                    <WaitingRecordModal count={count} closeWaitingModal={closeWaitingModal}/>
                )}
                <div className="w-full pt-4 ps-4">
                    <PicSideBar
                        bgList={bgList}
                        user={user}
                        changeBg={changeBg}
                        position={position}
                        sendPosition={sendPosition}
                        setPosition={setPosition}
                        subscribers={subscribers}
                        publisher={publisher}
                        setAlertModal={setAlertModal}
                        toggleMic={toggleMic}
                    />
                    {/* <div className="float-right mr-10 text-2xl">taken : {taken}/10</div> */}
                </div>
                <BigCam myId={myId} updatePosition={updatePosition} setPosition={setPosition} isTaking={isTaking}/>
                <div className="flex justify-center items-center gap-20 fixed bottom-10 ms-[calc(25%)] w-1/2">
                    {!timerVisible && (
                        <div className="flex rounded-3xl bg-yellow-100 leading-10 border border-yellow-500">
                            <div className="mr-1 px-3 bg-yellow-300 flex flex-wrap content-center rounded-l-3xl">
                                <ClockIcon className="w-8 h-8"/>
                            </div>
                            {timers.map((item) => {
                                return (
                                    <label
                                        key={`${item}label`}
                                        className={`whitespace-nowrap ${
                                            item == Number(timer)
                                                ? " bg-yellow-400 px-5 rounded-3xl"
                                                : "  px-5 rounded-3xl"
                                        }`}
                                    >
                                        {`${item}초`}
                                        <input
                                            type="radio"
                                            id={item + ""}
                                            name={name}
                                            value={item + ""}
                                            onChange={setTime}
                                            checked={item == Number(timer)}
                                            className=" hidden"
                                        />
                                    </label>
                                );
                            })}
                        </div>
                    )}
                    <div className="flex justify-center items-center px-5 rounded-3xl bg-red-300 leading-10 border border-red-500" onClick={take}>
                        <CameraIcon className="w-8 h-8 pr-2"/>
                        {timerVisible ? <span>{isTaking?'촬영중':(count+'초 후 촬영 시작')}</span> : <span>촬영</span>}
                    </div>
                    {!timerVisible&&
                        <div className="flex rounded-3xl bg-orange-100 leading-10 border border-orange-500">
                        <span className="px-4 ">{taken}/{MAX_CLIPS}</span>
                        <button
                            className={`w-full leading-10  px-4  bg-orange-300 rounded-3xl whitespace-nowrap `}
                            onClick={exit}
                            disabled={timerVisible}
                        >
                            촬영 종료
                        </button>
                    </div>
                    }
                </div>
            </>
        </Layout>
    );
}

export default TakePic;

TakePic.propTypes = {
    startTake: PropTypes.func,
    shareCode: PropTypes.string,
    bgList: PropTypes.array,
    goNext: PropTypes.func,
    publisher: PropTypes.any,
    user: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.string,
        userNickname: PropTypes.string,
        email: PropTypes.string,
        isHost: PropTypes.number,
    }),
    timer: PropTypes.number,
    taken: PropTypes.number,
    timeChange: PropTypes.func,
    startTaking: PropTypes.func,
    finishTaking: PropTypes.func,
    nowTaking: PropTypes.bool,
    myId: PropTypes.string,
    updatePosition: PropTypes.func,
    changeBg: PropTypes.func,
    position: PropTypes.array,
    sendPosition: PropTypes.func,
    setPosition: PropTypes.func,
    sendFileName: PropTypes.func,
    shareSecret: PropTypes.string,
    subscribers: PropTypes.array,
    setAlertModal: PropTypes.func,
    toggleMic: PropTypes.func,
};
