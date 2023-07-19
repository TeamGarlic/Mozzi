import { Clip2Frame, AddClip, Frame2Clip } from "@/modules/clipAction"


const clipState = {
  frame: {
    1: {clipIdx: 0, src: ''},
    2: {clipIdx: 0, src: ''},
    3: {clipIdx: 0, src: ''},
    4: {clipIdx: 0, src: ''}},
  clipList: {1: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"},
}

const clipReducer = (state = clipState, action) => {
  switch(action.type){
    case Clip2Frame: {
      for (let idx = 1; idx < 5; idx++) {
        if (!state.frame[idx]['src']){
          return {
            ...state,
            frame: {...state.frame, [idx]: {clipIdx:action.payload.clipIdx, src:action.payload.src}},
            clipList: {...state.clipList, [action.payload.clipIdx]: ""}
          }
        }
      }
      return {
        ...state,
      }
    }
    case AddClip: {
      return {
        ...state,
        clipList: {...state.clipList, [action.payload.idx]: action.payload.src}
      }
    }
    case Frame2Clip: {
      console.log(state.frame)
      if (state.frame[action.payload.frameIdx]['src']){
        return {
          ...state,
          clipList: {...state.clipList, [state.frame[action.payload.frameIdx]['clipIdx']]: action.payload.src},
          frame: {...state.frame, [action.payload.frameIdx]: {clipIdx:0, src: ""}}
        }
      }
      return state
    }

    default:
      return state
  }
}

export default clipReducer;