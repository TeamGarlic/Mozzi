import {
  setMainCanvas,
  addCamCanvas,
  resetCamCanvases,
  setMyLayer,
  resizeMyLayer,
  setMyLayerSource,
  updateSubVideoMap, updatePubVideoMap,
} from '@/modules/canvasAction';

const canvasState = {
  mainCanvas : {
    canvas : undefined,
    context : undefined,
  },
  camCanvases : [],
  myLayer : {
    image : undefined,
    x:undefined,
    y:undefined,
    width:undefined,
    height:undefined,
  },
  subVideoMap : {},
  pubVideoMap : {
    vidRef:undefined,
    canvasRef:undefined,
    canvasContextRef:undefined,
  },
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
    case addCamCanvas: {
      state.camCanvases.push({
        canvas : action.payload.canvas,
        context : action.payload.context,
      })
      return  {
        ...state,
      }
    }
    case resetCamCanvases: {
      while(state.camCanvases.length) state.camCanvases.shift();
      return  {
        ...state,
      }
    }
    case setMyLayer: {
      state.myLayer.x = action.payload.x
      state.myLayer.y = action.payload.y
      state.myLayer.width = action.payload.width
      state.myLayer.height = action.payload.height
      return  {
        ...state
      }
    }
    case setMyLayerSource: {
      state.myLayer.image = action.payload.canvas
      return  {
        ...state
      }
    }
    case resizeMyLayer: {
      state.myLayer.x = action.payload.x;
      state.myLayer.y = action.payload.y;
      state.myLayer.width = action.payload.width;
      state.myLayer.height = action.payload.height;
      return  {
        ...state
      }
    }
    case updateSubVideoMap: {
      // state.videoMap = action.payload;
      // console.log(action.payload);
      for (let key in state.subVideoMap) {
        delete state.subVideoMap[key];
      }
      for (let key in action.payload) {
        state.subVideoMap[key] = action.payload[key];
      }
      // console.log(state.videoMap);
      return {
        ...state
      }
    }
    case updatePubVideoMap: {
      state.pubVideoMap.vidRef = action.payload.vidRef;
      state.pubVideoMap.canvasRef = action.payload.canvasRef;
      state.pubVideoMap.canvasContextRef = action.payload.canvasContextRef;
      return {
        ...state
      }
    }
    default:
      return {...state}
  }
}

export default canvasReducer;