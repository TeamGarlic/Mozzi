import { combineReducers } from "redux";
import clipReducer from "@/reducers/clipReducer.js"
import canvasReducer from '@/reducers/canvasReducer.js';
import bgReducer from "@/reducers/bgReducer.js"

const rootReducer = combineReducers({
  clipReducer,
  canvasReducer,
  bgReducer,
});
export default rootReducer;
