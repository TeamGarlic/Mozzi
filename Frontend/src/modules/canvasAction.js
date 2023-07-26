export const setCamStream = "setCamStream";
export const setMaskStream = "setMaskStream";
export const setMainCanvas = "setMainCanvas";
export const addCamCanvas = "addCamCanvas";
export const resetCamCanvases = "resetCamCanvases";
export const setMyLayer = "setMyLayer";
export const resizeMyLayer = "resizeMyLayer";

export const setCamStreamAction = (res) => {
  return {
    type : setCamStream,
    payload : res,
  }
};
export const setMaskStreamAction = (res) => {
  return {
    type : setMaskStream,
    payload : res,
  }
};
export const setMainCanvasAction = (res) => {
  return {
    type : setMainCanvas,
    payload : res,
  }
};
export const addCamCanvasAction = (res) => {
  return {
    type : addCamCanvas,
    payload : res,
  }
};
export const resetCamCanvasesAction = (res) => {
  return {
    type : resetCamCanvases,
    payload : res,
  }
};

export const setMyLayerAction = (res) => {
  return {
    type : setMyLayer,
    payload : res,
  }
};
export const resizeMyLayerAction = (res) => {
  return {
    type : resizeMyLayer,
    payload : res,
  }
};