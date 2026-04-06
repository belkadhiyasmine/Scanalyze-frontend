import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  // documents: documentsReducer  ← à ajouter plus tard
});

export default rootReducer;