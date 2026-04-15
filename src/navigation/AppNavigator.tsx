// ─────────────────────────────────────────────
//  navigation/AppNavigator.tsx
//  Chef d'orchestre de toute la navigation
//  → Déclare toutes les routes de l'app
//  → Associe chaque URL → composant
//  → Gère les redirections
//  → Utilise PrivateRoute pour protéger les pages
//  → SignUp est privée (Admin seulement)
// ─────────────────────────────────────────────

import { Routes, Route, Navigate } from "react-router-dom"
import { ROUTES }                  from "./routes"
import PrivateRoute                from "./PrivateRoute"

// ── Pages publiques ───────────────────────────
import Login          from "../containers/Login/Login"

// ── Pages privées ─────────────────────────────
import SignUp         from "../containers/SignUp/SignUp"
import Dashboard      from "../containers/Dashboard/Dashboard"
import Upload         from "../containers/Upload/Upload"
import Editor         from "../containers/Editor/Editor"
import Verification   from "../containers/Verification/Verification"
import DataExport     from "../containers/DataExport/DataExport"

// ── Pages Admin uniquement ────────────────────
// UserManagement → accessible uniquement aux admins
// protégée par PrivateRoute comme les autres pages privées
// la restriction admin est gérée dans la page elle-même
// via AdminRoute ou via la Sidebar (lien visible admin only)
import UserManagement from "../containers/UserManagement/UserManagement"

// ─────────────────────────────────────────────
export default function AppNavigator() {
  return (
    <Routes>

      {/* ── Route par défaut ── */}
      {/* "/" → redirige vers "/login" */}
      <Route
        path={ROUTES.DEFAULT}
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

      {/* ══════════════════════════════════════
           PAGE PUBLIQUE
          ══════════════════════════════════════ */}

      {/* "/login" → accessible sans connexion */}
      <Route
        path={ROUTES.LOGIN}
        element={<Login />}
      />

      {/* ══════════════════════════════════════
           PAGES PRIVÉES — nécessitent un token
          ══════════════════════════════════════ */}

      {/* "/signup" → création de compte (Admin only) */}
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PrivateRoute>
            <SignUp />
          </PrivateRoute>
        }
      />

      {/* "/dashboard" → page d'accueil après login */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* "/upload" → upload de documents */}
      <Route
        path={ROUTES.UPLOAD}
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />

      {/* "/editor" → édition des données extraites */}
      <Route
        path={ROUTES.EDITOR}
        element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        }
      />

      {/* "/verification" → validation des documents */}
      <Route
        path={ROUTES.VERIFICATION}
        element={
          <PrivateRoute>
            <Verification />
          </PrivateRoute>
        }
      />

      {/* "/export" → export des données */}
      <Route
        path={ROUTES.EXPORT}
        element={
          <PrivateRoute>
            <DataExport />
          </PrivateRoute>
        }
      />

      {/* "/admin/users" → gestion des utilisateurs
          Accessible uniquement aux admins
          PrivateRoute vérifie le token
          La Sidebar cache le lien aux non-admins */}
      <Route
        path={ROUTES.USER_MANAGEMENT}
        element={
          <PrivateRoute>
            <UserManagement />
          </PrivateRoute>
        }
      />

      {/* ── Route inconnue (404) ── */}
      {/* Toute URL inconnue → redirige vers "/login" */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

    </Routes>
  )
}