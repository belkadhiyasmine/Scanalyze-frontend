//c le cerveau de l'auth il definit la forme de state auth , les actions possibles , comment les state se change pour chaque action
//
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userName: string | null;
  userRole: string | null;
  isLoading: boolean;
  error: string | null;
}
//l'etat au démarrage de l'app (avec localstorage le user reste connecté aprés refresh)
const initialState: AuthState = {
  token:    localStorage.getItem("token"),
  userName: localStorage.getItem("userName"),
  userRole: localStorage.getItem("userRole"),
  isLoading: false,
  error:    null,
};

const authSlice = createSlice({
  //le nom du slice auth
  name: "auth",
  //l'etat de depart qu'on a initialiser
  initialState,
  //tous les fonctions qui modifient le state
  reducers: {
    //declenché quand le user clique sur se connecter
    loginRequest(state, _action: PayloadAction<{ email: string; password: string }>) {
      //affiche un spinner dans l'UI 
      state.isLoading = true;
      //efface l'erreur precedente si elle existait
      state.error     = null;
    },
    //declenché quand l'api repend avec succés
    loginSuccess(state, action: PayloadAction<{ token: string; userName: string; userRole: string }>) {
      //cache le spinner
      state.isLoading = false;
      //cache le token , username , userrole dans le state
      state.token     = action.payload.token;
      state.userName  = action.payload.userName;
      state.userRole  = action.payload.userRole;
    },
    //déclenche quand l'API repond par une erreur 
    loginFailure(state, action: PayloadAction<string>) {
      //cache le spinner
      state.isLoading = false;
      //cache le msg d'erreur a afficher
      state.error     = action.payload;
    },
    //declenché quand l'user clique sur deconnexion 
    logout(state) {
      //remet tous a null dans Redux
      state.token    = null;
      state.userName = null;
      state.userRole = null;
      //supprime les données du localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRole");
    },
  },
});
//export les actions pour les utiliser dans mes composants et saga
export const { loginRequest, loginSuccess, loginFailure, logout } = authSlice.actions;
//on exporte le reducer pour le brancher dans rootReducer
export default authSlice.reducer;