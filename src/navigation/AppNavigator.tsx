// ─────────────────────────────────────────────
//  navigation/AppNavigator.tsx
//  Chef d'orchestre de toute la navigation
//  → Déclare toutes les routes de l'app
//  → Associe chaque URL → composant
//  → Gère les redirections
//  → Utilise PrivateRoute pour protéger les pages
//  → SignUp est privée (Admin seulement)
// ─────────────────────────────────────────────

// Routes    → le conteneur qui lit l'URL et choisit quelle Route afficher
// Route     → associe un chemin URL à un composant React
// Navigate  → redirige automatiquement vers une autre URL
import { Routes, Route, Navigate } from "react-router-dom";

// ROUTES → objet centralisé qui contient tous les chemins
// ex: ROUTES.LOGIN = "/login", ROUTES.DASHBOARD = "/dashboard"
// on n'écrit jamais les chemins en dur dans le code
import { ROUTES } from "./routes";

// Composant wrapper qui vérifie si l'user est connecté
// Si oui → affiche la page | Si non → redirige vers /login
import PrivateRoute from "./PrivateRoute";

// ─────────────────────────────────────────────
// Pages publiques — accessibles SANS connexion
// ─────────────────────────────────────────────

// Seule page publique de l'app
import Login from "../containers/Login/Login";

// ─────────────────────────────────────────────
// Pages privées — accessibles AVEC connexion uniquement
// ─────────────────────────────────────────────

// Page de création de compte — réservée à l'Admin
import SignUp       from "../containers/SignUp/SignUp";

// Page d'accueil après connexion — métriques et tableau
import Dashboard    from "../containers/Dashboard/Dashboard";

// Page d'upload de documents PDF
import Upload       from "../containers/Upload/Upload";

// Page d'édition des données extraites
import Editor       from "../containers/Editor/Editor";

// Page de vérification et validation des documents
import Verification from "../containers/Verification/Verification";

// Page d'export des données en JSON / CSV / XML
import DataExport   from "../containers/DataExport/DataExport";

// ─────────────────────────────────────────────
// Composant principal — déclare toutes les routes
// ─────────────────────────────────────────────
export default function AppNavigator() {
  return (
    // Routes → lit l'URL du navigateur et affiche
    // la première Route dont le path correspond
    <Routes>

      {/* ── Route par défaut ── */}
      {/* Quand l'user va sur "/" → redirige vers "/login" */}
      {/* replace → remplace l'entrée dans l'historique    */}
      {/* au lieu d'en ajouter une nouvelle                */}
      <Route
        path={ROUTES.DEFAULT}  // "/"
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

      {/* ══════════════════════════════════════
           PAGE PUBLIQUE
           Seul Login est accessible sans connexion
          ══════════════════════════════════════ */}

      {/* URL "/login" → affiche le composant Login */}
      {/* Pas de PrivateRoute → accessible sans token */}
      <Route
        path={ROUTES.LOGIN}    // "/login"
        element={<Login />}
      />

      {/* ══════════════════════════════════════
           PAGES PRIVÉES
           Toutes nécessitent une connexion
           SignUp → réservé à l'Admin
          ══════════════════════════════════════ */}

      {/* URL "/signup" → réservé Admin */}
      {/* PrivateRoute vérifie le token ET le rôle Admin */}
      <Route
        path={ROUTES.SIGNUP}   // "/signup"
        element={
          // PrivateRoute entoure SignUp comme un gardien
          // Si pas connecté → redirect /login
          <PrivateRoute>
            <SignUp />         {/* affiché seulement si connecté */}
          </PrivateRoute>
        }
      />

      {/* URL "/dashboard" → page principale après login */}
      <Route
        path={ROUTES.DASHBOARD}  // "/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* URL "/upload" → upload de documents */}
      <Route
        path={ROUTES.UPLOAD}   // "/upload"
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />

      {/* URL "/editor" → édition des données extraites */}
      <Route
        path={ROUTES.EDITOR}   // "/editor"
        element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        }
      />

      {/* URL "/verification" → validation des documents */}
      <Route
        path={ROUTES.VERIFICATION}  // "/verification"
        element={
          <PrivateRoute>
            <Verification />
          </PrivateRoute>
        }
      />

      {/* URL "/export" → export des données */}
      <Route
        path={ROUTES.EXPORT}   // "/export"
        element={
          <PrivateRoute>
            <DataExport />
          </PrivateRoute>
        }
      />

      {/* ── Route inconnue (404) ── */}
      {/* Si l'URL ne correspond à aucune route déclarée  */}
      {/* ex: "/abc", "/blabla" → redirige vers "/login"  */}
      {/* * = wildcard = "tout ce qui n'a pas matché"     */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

    </Routes>
  );
}