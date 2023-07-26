import {setCamStream, setMaskStream, setMainCanvas, addCamCanvas, resetCamCanvases, setMyLayer, resizeMyLayer} from "@/modules/canvasAction"

const canvasState = {
  camStream : {
    canvas:undefined,
    context:undefined,
    stream:undefined,
  },
  maskStream : {
    canvas:undefined,
    context:undefined,
    stream:undefined,
  },
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
  }
}

const canvasReducer = (state = canvasState, action) => {
  switch (action.type){
    case setCamStream: {
      return  {
        ...state,
        camStream : {
          canvas:action.payload.canvas,
          context:action.payload.context,
          stream:action.payload.stream,
        }
      }
    }
    case setMaskStream: {
      return  {
        ...state,
        maskStream : {
          canvas:action.payload.canvas,
          context:action.payload.context,
          stream:action.payload.stream,
        }
      }
    }
    case setMainCanvas: {
      state.mainCanvas.canvas = action.payload.canvas;
      state.mainCanvas.context = action.payload.context;
      return  {
        ...state
      }
    }
    case addCamCanvas: {
      // console.log(action.payload)
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
      // state.myLayer = {
      //   image : state.camStream.canvas,
      //   x:action.payload.x,
      //   y:action.payload.y,
      //   width:action.payload.width,
      //   height:action.payload.height,
      // }
      state.myLayer.image = state.camStream.canvas
      state.myLayer.x = action.payload.x
      state.myLayer.y = action.payload.y
      state.myLayer.width = action.payload.width
      state.myLayer.height = action.payload.height
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
    default:
      return {...state}
  }
}

export default canvasReducer;