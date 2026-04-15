//ce fichier contient des fonctions de lecture du state auth . au lieu d'écrire state.auth.token partout dans tous les composants 
//un slector est une fonction qui reçoit le state depuis n'importe quel composant et retourne une valeur 

import { RootState } from "../index";

export const selectToken           = (state: RootState) => state.auth.token;
export const selectUserName        = (state: RootState) => state.auth.userName;
export const selectUserRole        = (state: RootState) => state.auth.userRole;
export const selectIsLoading       = (state: RootState) => state.auth.isLoading;
export const selectAuthError       = (state: RootState) => state.auth.error;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;