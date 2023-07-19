import { Clip2Frame, AddClip, Frame2Clip, DragStart, DragEnd, DragClear, Frame2Frame } from "@/modules/clipAction"


const clipState = {
  frame: {
    1: {clipIdx: 0, src: ""},
    2: {clipIdx: 0, src: ""},
    3: {clipIdx: 0, src: ""},
    4: {clipIdx: 0, src: ""}},
  clipList: {1: "https://www.kmdb.or.kr/trailer/play/MK041673_P02.mp4"},
  drag: {
    start: '',
    end: '',
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
              frame: {...state.frame, [idx]: {clipIdx:action.payload.clipIdx, src:action.payload.src}},
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
          frame: {...state.frame, [action.payload.frameIdx]: {clipIdx:action.payload.clipIdx, src: action.payload.src}},
          clipList: {...state.clipList, [dummyClip["clipIdx"]]: dummyClip["src"], [action.payload.clipIdx]: ''}
        }}
      return {
        ...state,
        frame: {...state.frame, [action.payload.frameIdx]: {clipIdx:action.payload.clipIdx, src: action.payload.src}},
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
          frame: {...state.frame, [action.payload.frameIdx]: {clipIdx:0, src: ""}}
        }}
      return state
    }
    case Frame2Frame: {
      console.log(`${state.drag['startIdx']} to ${state.drag['endIdx']}`)
      const clip = {
        clipIdx: state.frame[state.drag['startIdx']]['clipIdx'],
        src: state.frame[state.drag['startIdx']]['src']
      }
      if (state.frame[state.drag['endIdx']]['src']){
        const endClip = {
          clipIdx: state.frame[state.drag['endIdx']]['clipIdx'],
          src: state.frame[state.drag['endIdx']]['src']
        }
        return {
          ...state,
          frame: {...state.frame,
            [state.drag['startIdx']]:{clipIdx:endClip.clipIdx, src:endClip.src}, [state.drag['endIdx']]:{clipIdx:clip.clipIdx, src:clip.src}}
        }
      }
      return {
        ...state,
        frame: {...state.frame, [state.drag['startIdx']]:{clipIdx:0, src:''}, [state.drag['endIdx']]:{clipIdx:clip.clipIdx, src:clip.src}}
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
          start: '',
          end: '',
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