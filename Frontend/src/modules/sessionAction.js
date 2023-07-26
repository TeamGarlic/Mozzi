export const setSession = "setSession";
export const setMainStreamManager = "setMainStreamManager";
export const setPublisher = "setPublisher";
export const setSubscribers = "setSubscribers";
export const setUserName = "setUserName";
export const setSessionId = "setSessionId";

export const setSessionAction = (res) => {
  return {
    type : setSession,
    payload : res,
  }
}
export const setMainStreamManagerAction = (res) => {
  return {
    type : setMainStreamManager,
    payload : res,
  }
}
export const setPublisherAction = (res) => {
  return {
    type : setPublisher,
    payload : res,
  }
}
export const setSubscribersAction = (res) => {
  return {
    type : setSubscribers,
    payload : res,
  }
}
export const setUserNameAction = (res) => {
  return {
    type : setUserName,
    payload : res,
  }
}
export const setSessionIdAction = (res) => {
  return {
    type : setSessionId,
    payload : res,
  }
}