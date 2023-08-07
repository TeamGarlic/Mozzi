import {
  setMainCanvas,
  resizeLayer,
  updateSubVideoMap, updatePubVideoMap, updatePosition,
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
  },
  pubCanvas : undefined,
  subCanvases : {},
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
      console.log(state.position);
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
        newSubCanvases[key] = action.payload[key].canvasRef;
      }
      return {
        ...state,
        subCanvases : newSubCanvases,
      }
    }
    case updatePubVideoMap: {
      state.pubVideoMap.vidRef = action.payload.vidRef;
      state.pubCanvas = state.pubVideoMap.canvasRef = action.payload.canvasRef;
      state.pubVideoMap.canvasContextRef = action.payload.canvasContextRef;
      return {
        ...state
      }
    }
    case updatePosition: {
      while(state.position.length>0) state.position.pop();
      console.log(action.payload);
      if(action.payload.length>0){
        for (let pos of action.payload) {
          state.position.push({
            image:(pos.id in state.subCanvases)?state.subCanvases[pos.id]:state.pubCanvas,
            id:pos.id,
            x:pos.x,
            y:pos.y,
            width:pos.width,
            height:pos.height,
          })
        }
      }
      console.log(state.position)
      return {
        ...state
      }
    }
    default:
      return {...state}
  }
}

export default canvasReducer;