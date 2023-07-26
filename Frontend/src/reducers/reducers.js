import { combineReducers } from "redux";
import clipReducer from "@/reducers/clipReducer.js"
import canvasReducer from '@/reducers/canvasReducer.js';
import sessionReducer from '@/reducers/sessionReducer.js';

const rootReducer = combineReducers({
  clipReducer,
  canvasReducer,
  sessionReducer,
});
export default rootReducer;
