// ─────────────────────────────────────────────
//  navigation/routes.ts
//  Centralise tous les noms de routes de l'application
//  → on évite d'écrire "/dashboard" partout dans le code
//  → on utilise ROUTES.DASHBOARD à la place
//  Avantages :
//  - éviter les erreurs de frappe (typo)
//  - faciliter la maintenance (changer 1 seul endroit)
//  - rendre le code propre et professionnel
// ─────────────────────────────────────────────

// export       → rend ROUTES accessible dans tous les fichiers du projet
// const ROUTES → objet qui regroupe TOUS les chemins de l'app
// as const     → dit à TypeScript que les valeurs ne changeront JAMAIS
//                sans "as const" : type = string (trop large)
//                avec "as const" : type = "/login" (exact, précis)
export const ROUTES = {

  // ── Pages publiques ──────────────────────────
  // Accessibles SANS connexion — pas de PrivateRoute

  LOGIN:  "/login",   // page de connexion — seule page publique
  SIGNUP: "/signup",  // création de compte — public dans ROUTES
                      // mais protégé par PrivateRoute (Admin only)

  // ── Pages privées ────────────────────────────
  // Toutes protégées par PrivateRoute dans AppNavigator.tsx
  // → si pas connecté : redirigé vers /login automatiquement

  DASHBOARD:    "/dashboard",    // page d'accueil après connexion
  UPLOAD:       "/upload",       // upload de documents PDF
  EDITOR:       "/editor",       // édition des données extraites
  VERIFICATION: "/verification", // validation des documents scannés
  EXPORT:       "/export",       // export JSON / CSV / XML

  // ── Page par défaut ──────────────────────────
  // Quand l'user va sur "/" → redirigé vers /login
  // déclaré dans AppNavigator : <Navigate to={ROUTES.LOGIN} />
  DEFAULT: "/",

} as const; // ← gèle l'objet — aucune valeur ne peut être modifiée
            //   ROUTES.LOGIN = "/autre" → ❌ erreur TypeScript immédiate

// ─────────────────────────────────────────────
// Types générés AUTOMATIQUEMENT depuis ROUTES
// TypeScript les déduit tout seul grâce à "as const"
// ─────────────────────────────────────────────

// RouteKeys → type de toutes les CLÉS de ROUTES
// keyof typeof ROUTES = "LOGIN" | "SIGNUP" | "DASHBOARD" | ...
// Utilité : t'assurer qu'on utilise seulement des clés qui existent
export type RouteKeys = keyof typeof ROUTES;
// résultat : "LOGIN" | "SIGNUP" | "DASHBOARD" | "UPLOAD" |
//            "EDITOR" | "VERIFICATION" | "EXPORT" | "DEFAULT"

// RouteValues → type de toutes les VALEURS de ROUTES
// (typeof ROUTES)[RouteKeys] = "/login" | "/signup" | "/dashboard" | ...
// Utilité : typer une variable qui doit contenir un chemin valide
export type RouteValues = (typeof ROUTES)[RouteKeys];
// résultat : "/login" | "/signup" | "/dashboard" | "/upload" |
//            "/editor" | "/verification" | "/export" | "/"