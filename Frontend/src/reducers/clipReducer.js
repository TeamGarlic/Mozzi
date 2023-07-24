import { Clip2Frame, AddClip, Frame2Clip, DragStart, DragEnd, DragClear, Frame2Frame, setFrame, setClipList } from "@/modules/clipAction"


const clipState = {
  frame: {
    n: 4,
    src: "",
    1: {clipIdx: 0, src: "",
      width : 0.9119170984455959,
      height : 0.20057471264367815,
      x : 0.041191773093426164,
      y : 0.014367816091954023},
    2: {clipIdx: 0, src: "",
      width : 0.9136442141623489,
      height : 0.20057471264367815,
      x : 0.03773754165992012,
      y : 0.22988505747126436},
    3: {clipIdx: 0, src: "",
      width : 0.9136442141623489,
      height : 0.20057471264367815,
      x : 0.039464657376673144,
      y : 0.4454022988505747},
    4: {clipIdx: 0, src: "",
      width : 0.9136442141623489,
      height : 0.20057471264367815,
      x : 0.039464657376673144,
      y : 0.6603448275862069}},
  clipList: {
    n: 0,
    1: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"
  },
  drag: {
    start: "",
    end: "",
    startIdx: 0,
    endIdx: 0,
  }
}

const clipReducer = (state = clipState, action) => {
  switch(action.type){
    case setFrame: {
      return {
        ...state,
      }
    }
    case setClipList: {
      return {
        ...state,
      }
    }
    case Clip2Frame: {
      if (!action.payload.frameIdx){
        for (let idx = 1; idx < 5; idx++) {
          if (!state.frame[idx]["src"]){
            return {
              ...state,
              frame: {...state.frame, [idx]: {...state.frame[idx], clipIdx:action.payload.clipIdx, src:action.payload.src}},
              clipList: {...state.clipList, [action.payload.clipIdx]: ""}
            }}}
        return {
          ...state,
        }
      } else if(state.frame[action.payload.frameIdx]["src"]){
        const dummyClip = {
          clipIdx: state.frame[action.payload.frameIdx]["clipIdx"],
          src: state.frame[action.payload.frameIdx]["src"]
        };
        return {
          ...state,
          frame: {...state.frame, [action.payload.frameIdx]: {...state.frame[action.payload.frameIdx], clipIdx:action.payload.clipIdx, src: action.payload.src}},
          clipList: {...state.clipList, [dummyClip["clipIdx"]]: dummyClip["src"], [action.payload.clipIdx]: ""}
        }}
      return {
        ...state,
        frame: {...state.frame, [action.payload.frameIdx]: {...state.frame[action.payload.frameIdx], clipIdx:action.payload.clipIdx, src: action.payload.src}},
        clipList: {...state.clipList, [action.payload.clipIdx]: ""}
      };
    }
    case AddClip: {
      return {
        ...state,
        clipList: {...state.clipList, [action.payload.idx]: action.payload.src}
      }}
    case Frame2Clip: {
      if (state.frame[action.payload.frameIdx]["src"]){
        return {
          ...state,
          clipList: {...state.clipList, [state.frame[action.payload.frameIdx]["clipIdx"]]: state.frame[action.payload.frameIdx]["src"]},
          frame: {...state.frame, [action.payload.frameIdx]: {...state.frame[action.payload.frameIdx], clipIdx:0, src: ""}}
        }}
      return state
    }
    case Frame2Frame: {
      const startIdx = state.drag['startIdx'];
      const endIdx = state.drag['endIdx']
      const clip = {
        clipIdx: state.frame[startIdx]['clipIdx'],
        src: state.frame[startIdx]['src']
      }
      if (state.frame[endIdx]['src']){
        const endClip = {
          clipIdx: state.frame[endIdx]['clipIdx'],
          src: state.frame[endIdx]['src']
        }
        return {
          ...state,
          frame: {...state.frame,
            [startIdx]:{...state.frame.startIdx, clipIdx:endClip.clipIdx, src:endClip.src},
            [endIdx]:{...state.frame.endIdx, clipIdx:clip.clipIdx, src:clip.src}}
        }
      }
      return {
        ...state,
        frame: {...state.frame,
          [startIdx]:{...state.frame.startIdx, clipIdx:0, src:""},
          [endIdx]:{...state.frame.endIdx, clipIdx:clip.clipIdx, src:clip.src}}
      }
    }
    case DragStart: {
      return {
        ...state,
        drag: {
          ...state.drag,
          start: action.payload.start,
          startIdx: action.payload.startIdx,
        }}}
    case DragEnd: {
      return {
        ...state,
        drag: {
          ...state.drag,
          end: action.payload.end,
          endIdx: action.payload.endIdx
        }}}
    case DragClear: {
      return {
        ...state,
        drag: {
          ...state.drag,
          start: "",
          end: "",
          startIdx: 0,
          endIdx: 0
        }
      }
    }

    default:
      return state
  }
}

export default clipReducer;