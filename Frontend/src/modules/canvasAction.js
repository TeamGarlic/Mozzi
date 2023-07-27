export const setMainCanvas = "setMainCanvas";
export const addCamCanvas = "addCamCanvas";
export const resetCamCanvases = "resetCamCanvases";
export const setMyLayer = "setMyLayer";
export const resizeMyLayer = "resizeMyLayer";

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