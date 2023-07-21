import { Clip2Frame, AddClip, Frame2Clip, DragStart, DragEnd, DragClear, Frame2Frame } from "@/modules/clipAction"


const clipState = {
  frame: {
    1: {clipIdx: 0, src: "", top:49, left:55},
    2: {clipIdx: 0, src: "", top:208, left:55},
    3: {clipIdx: 0, src: "", top:366, left:55},
    4: {clipIdx: 0, src: "", top:525, left:55}},
  clipList: {1: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"},
  drag: {
    start: "",
    end: "",
    startIdx: 0,
    endIdx: 0,
  }
}

const clipReducer = (state = clipState, action) => {
  switch(action.type){
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