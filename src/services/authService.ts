// ─────────────────────────────────────────────
//  services/authService.ts
//  Gère tous les appels API liés à l'auth
//  → login    : connexion utilisateur
//  → register : création de compte
//  Utilisé par : authSaga.ts
// ─────────────────────────────────────────────

import api from "./api"
import { LoginResponse, User } from "../types"

// ── Type des données de login ─────────────────
// Ce que le composant Login envoie
interface LoginPayload {
  email:    string
  password: string
}

// ── Type des données d'inscription ────────────
// Ce que le composant SignUp envoie
interface RegisterPayload {
  fullName: string
  email:    string
  password: string
  role:     string
}

// ─────────────────────────────────────────────
const authService = {

  // ── Login ─────────────────────────────────
  // Envoie email + password → reçoit token + user
  // Appelé par authSaga via yield call(authService.login, payload)
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    // POST /api/auth/login
    // body : { email: "...", password: "..." }
    const response = await api.post<LoginResponse>(
      "/api/auth/login",
      payload
    )
    // response.data → { token: "eyJ...", user: { id, fullName, email, role } }
    return response.data
  },

  // ── Register ──────────────────────────────
  // Crée un nouveau compte utilisateur
  // Retourne le User créé
  register: async (payload: RegisterPayload): Promise<User> => {
    // POST /api/auth/register
    // body : { fullName, email, password, role }
    const response = await api.post<User>(
      "/api/auth/register",
      payload
    )
    // response.data → { id, fullName, email, role }
    return response.data
  },

  // ── Logout ────────────────────────────────
  // Informe le backend que l'user se déconnecte
  // (invalide le token côté serveur si blacklist)
  logout: async (): Promise<void> => {
    // POST /api/auth/logout
    // Pas de body — le token est dans le header Authorization
    await api.post("/api/auth/logout")
  },

}

export default authService