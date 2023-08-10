export const setMainCanvas = "setMainCanvas";
export const resizeLayer = "resizeLayer";
export const updateSubVideoMap = "updateSubVideoMap";
export const updatePubVideoMap = "updatePubVideoMap";
export const updatePosition = "updatePosition"
export const setDegree = "setDegree"
export const setScale = "setScale"

export const setMainCanvasAction = (res) => {
  return {
    type : setMainCanvas,
    payload : res,
  }
};

export const resizeLayerAction = (res) => {
  return {
    type : resizeLayer,
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

export const updatePositionAction = (res) => {
  return {
    type : updatePosition,
    payload : res,
  }
};

export const setDegreeAction = (res) => {
  return {
    type : setDegree,
    payload : res,
  }
};
export const setScaleAction = (res) => {
  return {
    type : setScale,
    payload : res,
  }
};
