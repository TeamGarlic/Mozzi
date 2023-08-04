import {
  setMainCanvas,
  addCamCanvas,
  resetCamCanvases,
  setMyLayer,
  resizeMyLayer,
  setMyLayerSource,
  updateVideoMap,
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
  videoMap : {

  }
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
    case updateVideoMap: {
      // state.videoMap = action.payload;
      // console.log(action.payload);
      for (var prev in state.videoMap) {
        delete state.videoMap[prev];
      }
      for (var next in action.payload) {
        state.videoMap[next] = action.payload[next];
      }
      // console.log(state.videoMap);
      return {
        ...state
      }
    }
    default:
      return {...state}
  }
}

export default canvasReducer;