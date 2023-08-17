import {
  setMainCanvas,
  resizeLayer,
  updateSubVideoMap, updatePubVideoMap, updatePosition, setDegree, setScale, setVisibility,
} from '@/modules/canvasAction';

const canvasState = {
  mainCanvas : {
    canvas : undefined,
    context : undefined,
  },
  subVideoMap : {},
  pubVideoMap : {
    vidRef:undefined,
    canvasRef:undefined,
    canvasContextRef:undefined,
    nickname:undefined,
  },
  // pubCanvas : undefined,
  pubCanvas : {
    canvasRef:undefined,
    nickname:undefined,
  },
  subCanvases : {},
  canvasConfig : {
    visibility : true,
    degree : 0,
    scale : 100,
  },
  position: [],
}

const canvasReducer = (state = canvasState, action) => {
  switch (action.type){
    case setMainCanvas: {
      state.mainCanvas.canvas = action.payload.canvas;
      state.mainCanvas.context = action.payload.context;
      return  {
        ...state
      }
    }
    case resizeLayer: {
      // console.log(state.position);
      // console.log(action.payload);
      for (let pos of state.position) {
        if(pos.id===action.payload.id){
          pos.x = action.payload.x;
          pos.y = action.payload.y;
          pos.width = action.payload.width;
          pos.height = action.payload.height;
        }
      }
      // console.log(state.position);
      return  {
        ...state
      }
    }
    case updateSubVideoMap: {
      const newSubCanvases = [];
      for (let key in state.subVideoMap) {
        delete state.subVideoMap[key];
      }
      for (let key in action.payload) {
        state.subVideoMap[key] = action.payload[key];
        newSubCanvases[key] = {
          ref: action.payload[key].canvasRef,
          nickName: action.payload[key].nickName,
          }
        }
      return {
        ...state,
        subCanvases : newSubCanvases,
      }
    }
    case updatePubVideoMap: {
      // console.log(action.payload);
      state.pubVideoMap.vidRef = action.payload.vidRef;
      // state.pubCanvas = state.pubVideoMap.canvasRef = action.payload.canvasRef;
      state.pubVideoMap.canvasRef = action.payload.canvasRef;
      state.pubVideoMap.nickname = action.payload.nickname;

      //
      state.pubCanvas = {
        canvasRef: state.pubVideoMap.canvasRef,
        nickname : state.pubVideoMap.nickname,
      }
      //

      state.pubVideoMap.canvasContextRef = action.payload.canvasContextRef;
      return {
        ...state
      }
    }
    case updatePosition: {
      if(action.payload&&action.payload.length>0){
        while(state.position.length>0) state.position.pop();
        // console.log(action.payload);
        for (let pos of action.payload) {
          state.position.unshift({
            image:(pos.id in state.subCanvases)?state.subCanvases[pos.id].ref:state.pubCanvas.canvasRef,
            id:pos.id,
            x:pos.x,
            y:pos.y,
            width:pos.width,
            height:pos.height,
          })
        }
      }
      // console.log(state.position);
      return {
        ...state
      }
    }
    case setDegree: {
      state.canvasConfig.degree = action.payload
      return {
        ...state
      }
    }
    case setScale: {
      state.canvasConfig.scale = action.payload
      return {
        ...state
      }
    }
    case setVisibility: {
      state.canvasConfig.visibility = action.payload
      return {
        ...state
      }
    }
    default:
      return {...state}
  }
}

export default canvasReducer;
