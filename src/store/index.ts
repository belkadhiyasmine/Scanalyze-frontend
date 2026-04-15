//ce fichier est le coeur de Redux dans monn app il fais 3 choses ( creer le store , configure Saga , export les types)
//importation de fonction qui crée le store 
import { configureStore } from "@reduxjs/toolkit";
//importation de fonction qui crée le middleware saga qui gere les appels API asynchrones
import createSagaMiddleware from "redux-saga";
//importation de rootreducer qui combine les reducers lkol
import rootReducer from "./rootReducer";
//importation de saga principale qui va ecouter toutes les actions liées à l'auth(login, logout)
import { authSaga } from "./auth/authSaga";
//on créer une instance de middleware saga (n'est pas encore activetr)
const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  //on a brancher tous les reducers dans le store 
  reducer: rootReducer,
  //retourne les middlewares par defaut de redux et desactiver Thunk(il fait la meme chose que Saga)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});
//activer saga pour ecouter les actions 
sagaMiddleware.run(authSaga);
//la fonction qui retourne le state donne le type de cette fonction et extrait le type de retour 
export type RootState   = ReturnType<typeof store.getState>;
//creer le type du dispatch
export type AppDispatch = typeof store.dispatch;