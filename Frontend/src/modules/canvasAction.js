export const setMainCanvas = "setMainCanvas";
export const addCamCanvas = "addCamCanvas";
export const resetCamCanvases = "resetCamCanvases";
export const setMyLayer = "setMyLayer";
export const setMyLayerSource = "setMyLayerSource";
export const resizeMyLayer = "resizeMyLayer";
export const updateSubVideoMap = "updateSubVideoMap";
export const updatePubVideoMap = "updatePubVideoMap";

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

export const setMyLayerSourceAction = (res) => {
  return {
    type : setMyLayerSource,
    payload : res,
  }
};

export const resizeMyLayerAction = (res) => {
  return {
    type : resizeMyLayer,
    payload : res,
  }
};

export const updateSubVideoMapAction = (res) => {
  return {
    type : updateSubVideoMap,
    payload : res,
  }
};

export const updatePubVideoMapAction = (res) => {
  return {
    type : updatePubVideoMap,
    payload : res,
  }
};