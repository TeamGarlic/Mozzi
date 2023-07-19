import { Clip2Frame, AddClip, } from "@/modules/clipAction"


const clipState = {
  frame: {1: '', 2: '', 3: '', 4: ''},
  clipList: {1: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"}
}

const clipReducer = (state = clipState, action) => {
  switch(action.type){
    case Clip2Frame: {
      return {
        ...state,
        frame: {...state.frame, [action.payload.frameIdx]: action.payload.src},
        clipList: {...state.clipList, [action.payload.idx]: ""}
      }
    }
    case AddClip: {
      return {
        ...state,
        clipList: {...state.clipList, [action.payload.idx]: action.payload.src}
      }
    }
    default:
      return state
  }
}

export default clipReducer;