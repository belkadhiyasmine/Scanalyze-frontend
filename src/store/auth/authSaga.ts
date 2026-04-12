// ─────────────────────────────────────────────
//  store/auth/authSaga.ts
//  Modification : utilise authService
//  au lieu de simuler l'appel API
// ─────────────────────────────────────────────

import { call, put, takeLatest }  from "redux-saga/effects"
import { loginRequest, loginSuccess, loginFailure } from "./authSlice"
import authService                from "../../services/authService"  // ← import du service

function* handleLogin(action: ReturnType<typeof loginRequest>): Generator {
  try {
    // ✅ Appel réel via authService au lieu de la simulation
    // call() → Saga appelle authService.login et attend la réponse
    const response: any = yield call(
      authService.login,   // ← fonction du service
      action.payload       // ← { email, password }
    )

    // Sauvegarde dans localStorage pour la persistance
    // response → { token, user: { fullName, role } }
    localStorage.setItem("token",    response.token)
    localStorage.setItem("userName", response.user.fullName)
    localStorage.setItem("userRole", response.user.role)

    // Dispatch loginSuccess → met à jour le state Redux
    yield put(loginSuccess({
      token:    response.token,
      userName: response.user.fullName,
      userRole: response.user.role,
    }))

  } catch (err: any) {
    // err.response.data.message → message d'erreur du backend
    // Si pas de message → message générique
    const errorMessage = err.response?.data?.message
      || "Email ou mot de passe incorrect."

    // Dispatch loginFailure → affiche l'erreur dans le formulaire
    yield put(loginFailure(errorMessage))
  }
}

// Écoute loginRequest — annule si double clic
export function* authSaga() {
  yield takeLatest(loginRequest.type, handleLogin)
}