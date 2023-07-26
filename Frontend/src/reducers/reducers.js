import { combineReducers } from "redux";
import clipReducer from "@/reducers/clipReducer.js"
import canvasReducer from '@/reducers/canvasReducer.js';

const rootReducer = combineReducers({
  clipReducer,
  canvasReducer,
});
export default rootReducer;
