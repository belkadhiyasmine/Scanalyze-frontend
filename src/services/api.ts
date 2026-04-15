// ─────────────────────────────────────────────
//  services/api.ts
//  Instance Axios centrale — utilisée par TOUS
//  les services de l'app
//  Rôle :
//  → Configure l'URL de base du backend
//  → Ajoute le token JWT automatiquement
//  → Gère les erreurs globalement (401, 500...)
//  → Redirige vers /login si token expiré
// ─────────────────────────────────────────────

import axios from "axios"

// ── URL de base du backend ────────────────────
// Tous les appels utiliseront cette URL comme préfixe
// ex: "/api/auth/login" → "http://localhost:8000/api/auth/login"
// En production → remplacer par l'URL du serveur réel
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"

// ── Création de l'instance Axios ──────────────
// Au lieu d'utiliser axios directement, on crée
// une instance avec une configuration par défaut
const api = axios.create({
  baseURL: BASE_URL,      // ← préfixe de toutes les requêtes
  timeout: 10000,         // ← annule la requête après 10 secondes
  headers: {
    "Content-Type": "application/json",  // ← format JSON par défaut
  },
})

// ─────────────────────────────────────────────
//  INTERCEPTEUR DE REQUÊTE
//  S'exécute AVANT chaque requête envoyée
//  → Lit le token depuis localStorage
//  → L'ajoute dans le header Authorization
//  Avantage : on ne répète jamais ce code
//             dans chaque service
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Lit le token JWT stocké après le login
    const token = localStorage.getItem("token")

    // Si token existe → l'ajoute dans le header
    // Format standard : "Bearer eyJhbGci..."
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config   // ← retourne la config modifiée
  },
  (error) => {
    // Erreur avant l'envoi (ex: pas de réseau)
    return Promise.reject(error)
  }
)

// ─────────────────────────────────────────────
//  INTERCEPTEUR DE RÉPONSE
//  S'exécute APRÈS chaque réponse reçue
//  → Gère les erreurs globalement
//  → 401 → token expiré → redirige vers login
//  → 500 → erreur serveur → message générique
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    // Réponse OK (2xx) → retourne directement
    return response
  },
  (error) => {
    // ── Récupère le code d'erreur HTTP ────────
    const status = error.response?.status

    if (status === 401) {
      // 401 Unauthorized → token expiré ou invalide
      // On nettoie le localStorage et on redirige
      localStorage.removeItem("token")
      localStorage.removeItem("userName")
      localStorage.removeItem("userRole")
      // Redirige vers login sans React Router
      // (on est en dehors des composants React)
      window.location.href = "/login"
    }

    if (status === 403) {
      // 403 Forbidden → pas les droits nécessaires
      console.error("Accès refusé — droits insuffisants")
    }

    if (status === 500) {
      // 500 Internal Server Error → problème backend
      console.error("Erreur serveur — réessayez plus tard")
    }

    // Rejette l'erreur pour que le catch des services la reçoive
    return Promise.reject(error)
  }
)

export default api