// ─────────────────────────────────────────────
//  navigation/routes.ts
//  Centralise tous les noms de routes de mon application 
//  → on évite d'écrire "/dashboard" partout on ecrit  (navigate(ROUTES.DASHBOARD))
//    dans le code, on utilise ROUTES.DASHBOARD
// Avantages : eviter les erreurs(typo) ; faciliter la maintenance ; rendre le code propore et professionnel
// ─────────────────────────────────────────────

export const ROUTES = {   //declaration de l'objet ROUTES qui contient toutes les routes  (export permet de l'utiliser dans tous le projet )
  // ── Pages publiques (sans connexion) ────────
  LOGIN:  "/login",
  SIGNUP: "/signup",

  // ── Pages privées (connexion obligatoire)  elles seronts utilisées avec PrivateRoute.tsx ───
  DASHBOARD:    "/dashboard",
  UPLOAD:       "/upload",
  EDITOR:       "/editor",
  VERIFICATION: "/verification",
  EXPORT:       "/export",

  // ── Page par défaut ──────────────────────────
  DEFAULT: "/",
} as const;

// ── Type généré automatiquement depuis ROUTES ─
// Permet d'utiliser les valeurs comme type TypeScript
export type RouteKeys   = keyof typeof ROUTES;
export type RouteValues = (typeof ROUTES)[RouteKeys];