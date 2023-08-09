import { observable } from "mobx";

export const AppStore = observable({
  isRunnig: false,

  /* 스피너 작동 */
  setRunningSpinner() {
    this.isRunnig = true;
  },

  /* 스피너 중지 */
  setStopSpinner() {
    this.isRunnig = false;
  },
})