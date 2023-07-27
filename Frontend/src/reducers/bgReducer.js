import {changeBg} from "@/modules/bgAction"

const bgState = {
  bgList: [],
  bgNow: {
    img: new Image()
  }
}

const bgReducer = (state=bgState, action) => {
  switch (action.type) {
    case changeBg:
      state.bgNow.img = action.payload.img
      return state

    default:
      return state
  }
}

export default bgReducer;