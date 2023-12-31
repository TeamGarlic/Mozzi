import {
  updateFrame,
  Clip2Frame,
  AddClip,
  Frame2Clip,
  DragStart,
  DragEnd,
  DragClear,
  Frame2Frame,
  setFrame,
  setClipList,
  setFFMpegStatus
} from "@/modules/clipAction"

const clipState = {
  frame: {
    id: 0,
    title: "",
    n: 0,
    src: "",
    },
  clipList: {
    n: 0,
  },
  drag: {
    start: "",
    end: "",
    startIdx: 0,
    endIdx: 0,
  },
  FFMpegStatus : true,
}

const clipReducer = (state = clipState, action) => {
  switch(action.type) {
    case updateFrame: {
      const frame = action.payload;
      const frameNum = Array.from({length: state.frame['n']}, (v, i) => i+1);
      const newFrame = {...state.frame}
      frameNum.forEach((n) => {
        newFrame[n] = {
          ...newFrame[n],
          clipIdx: Number(frame[n]),
          src: state.clipList[Number(frame[n])],
        }
      })
      // console.log(newFrame)
      return {
        ...state,
        frame: newFrame,
      }
    }
    case setFrame: {
      // params로 frame 객체 그대로 입력
      const frame = {
        ...action.payload,
      };
      return {
        ...state,
        frame
      }
    }
    case setClipList: {
      return {
        ...state,
        clipList: {
          n: action.payload.n
        }
      }
    }
    case Clip2Frame: {
      if (!action.payload.frameIdx) {
        for (let idx = 1; idx < state.frame.n + 1; idx++) {
          if (!state.frame[idx]["src"]) {
            return {
              ...state,
              frame: {
                ...state.frame,
                [idx]: {...state.frame[idx], clipIdx: action.payload.clipIdx, src: action.payload.src}
              },
            }
          }
        }
        return {
          ...state,
        }
      } else if (state.frame[action.payload.frameIdx]["src"]) {
        return {
          ...state,
          frame: {
            ...state.frame,
            [action.payload.frameIdx]: {
              ...state.frame[action.payload.frameIdx],
              clipIdx: action.payload.clipIdx,
              src: action.payload.src
            }
          },
        }
      }
      return {
        ...state,
        frame: {
          ...state.frame,
          [action.payload.frameIdx]: {
            ...state.frame[action.payload.frameIdx],
            clipIdx: action.payload.clipIdx,
            src: action.payload.src
          }
        },
      };
    }
    case AddClip: {
      return {
        ...state,
        clipList: {...state.clipList, [action.payload.idx]: action.payload.src, n:state.clipList.n+1}
      }
    }
    case Frame2Clip: {
      if (state.frame[action.payload.frameIdx]["src"]) {
        return {
          ...state,
          frame: {
            ...state.frame,
            [action.payload.frameIdx]: {...state.frame[action.payload.frameIdx], clipIdx: 0, src: ""}
          }
        }
      }
      return state
    }
    case Frame2Frame: {
      const startIdx = state.drag['startIdx'];
      const endIdx = state.drag['endIdx']
      const clip = {
        clipIdx: state.frame[startIdx]['clipIdx'],
        src: state.frame[startIdx]['src']
      }
      if (state.frame[endIdx]['src']) {
        const endClip = {
          clipIdx: state.frame[endIdx]['clipIdx'],
          src: state.frame[endIdx]['src']
        }
        return {
          ...state,
          frame: {
            ...state.frame,
            [startIdx]: {...state.frame[startIdx], clipIdx: endClip.clipIdx, src: endClip.src},
            [endIdx]: {...state.frame[endIdx], clipIdx: clip.clipIdx, src: clip.src}
          }
        }
      }
      return {
        ...state,
        frame: {
          ...state.frame,
          [startIdx]: {...state.frame[startIdx], clipIdx: 0, src: ""},
          [endIdx]: {...state.frame[endIdx], clipIdx: clip.clipIdx, src: clip.src}
        }
      }
    }
    case DragStart: {
      return {
        ...state,
        drag: {
          ...state.drag,
          start: action.payload.start,
          startIdx: action.payload.startIdx,
        }
      }
    }
    case DragEnd: {
      return {
        ...state,
        drag: {
          ...state.drag,
          end: action.payload.end,
          endIdx: action.payload.endIdx
        }
      }
    }
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
    case setFFMpegStatus:{
      state.FFMpegStatus = action.payload;
      return {
        ...state
      }
    }
    default:
      return state
  }
}

export default clipReducer;
