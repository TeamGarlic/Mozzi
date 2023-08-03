export const changeBg = "changeBg";
export const getBgList = "getBgList";

export const changeBgAction = (res) => {
  return {
    type: changeBg,
    payload: res,
  }
};

export const getBgListAction = (res) => {
  return {
    type: getBgList,
    payload: res,
  }
}