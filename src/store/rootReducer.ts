//combine tous les reducers
// cette fonction fait le travail d'assemblage  des données de slices(auth, document, notif) dans le store
import { combineReducers } from "@reduxjs/toolkit";
// on importer le reducer du slice auth pour modifier state.auth
import authReducer from "./auth/authSlice";
//combineReducers crée un seul reducer a partir de plusieurs . la clé auth definit le nom dans le state global
const rootReducer = combineReducers({
  auth: authReducer,
  // documents: documentsReducer  ← à ajouter plus tard
});
//on exporte le rootReducer pour qu'il soit utilisé dans le store/index.ts
export default rootReducer;