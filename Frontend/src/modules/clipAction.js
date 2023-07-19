export const Clip2Frame = "Clip2Frame";
export const Frame2Clip = "Frame2Clip";
export const AddClip = "AddClip";

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

export const AddClipAction = (res) => {
  return {
    type: AddClip,
    payload: res
  }
}