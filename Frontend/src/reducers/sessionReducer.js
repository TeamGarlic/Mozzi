import {
  setMainStreamManager,
  setPublisher,
  setSession, setSessionId,
  setSubscribers,
  setUserName,
} from '@/modules/sessionAction.js';

const sessionState = {
  session : undefined,
  mainStreamManager : undefined,
  publisher : undefined,
  subscribers : undefined,
  userName : "Anonymous",
  sessionId : "SessionA",
}

const sessionReducer = (state = sessionState, action) => {
  switch (action.type){
    case setSession:
      state.session = action.payload.session;
      return {...state}
    case setMainStreamManager:
      state.mainStreamManager = action.payload.mainStreamManager;
      return {...state}
    case setPublisher:
      state.publisher = action.payload.publisher;
      return {...state}
    case setSubscribers:
      state.subscribers = action.payload.subscribers;
      return {...state}
    case setUserName:
      state.userName = action.payload.userName;
      return {...state}
    case setSessionId:
      state.sessionId = action.payload.sessionId;
      return {...state}
    default :
      return {...state}
  }
}

export default sessionReducer;