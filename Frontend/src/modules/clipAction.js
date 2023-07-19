export const Clip2Frame = "Clip2Frame";
export const Frame2Clip = "Frame2Clip";
export const AddClip = "AddClip";
export const DragStart = "DragStart";
export const DragEnd = "DragEnd";
export const DragClear = "DragClear";
export const Frame2Frame = "Frame2Frame";

export const Clip2FrameAction = (res) => {
  return {
    type: Clip2Frame,
    payload: res
  }
}

export const Frame2ClipAction = (res) => {
  return {
    type: Frame2Clip,
    payload: res
  }
}

export const Frame2FrameAction = (res) => {
  return {
    type: Frame2Frame,
    payload: res
  }
}

export const AddClipAction = (res) => {
  return {
    type: AddClip,
    payload: res
  }
}

export const DragStartAction = (res) => {
  return {
    type: DragStart,
    payload: res
  }
}

export const DragEndAction = (res) => {
  return {
    type: DragEnd,
    payload: res
  }
}

export const DragClearAction = (res) => {
  return {
    type: DragClear,
    payload: res
  }
}