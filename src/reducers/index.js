import { combineReducers } from "redux";
import initReducer from "./init.reducers";
const rootReducer = combineReducers({
  init: initReducer,
});

export default rootReducer;
