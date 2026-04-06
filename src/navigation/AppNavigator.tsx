// ─────────────────────────────────────────────
//  navigation/AppNavigator.tsx
//  Chef d'orchestre de toute la navigation
//  → Déclare toutes les routes de l'app
//  → Associe chaque URL→composant
//  → gere les redirections  
//  → Utilise PrivateRoute pour protéger les pages
//  conclusion : il decide  quelle page afficher selon URL
//   CONCEPTS UTILISEES : React Routing , Routing Dynaming , Protection des routes(auth) , Composants imbriqués (PrivateRoute) 
// ─────────────────────────────────────────────

import { Routes, Route, Navigate } from "react-router-dom";
//Ce sont les elements principales : //Routes → conteneur de toutes les routes 
                                     //Route  → une route (URL →composant)
                                     //Navigate→redirection
import { ROUTES } from "./routes";
import PrivateRoute from "./PrivateRoute"; //Sert à verifier si user connecté sinon redirigr vers login 

// ── Import des pages (chaque page correspond à un composant React──────────────────────────
// Pages publiques
import Login from "../containers/Login";
import SignUp from "../containers/SignUp";

// Pages privées

import Dashboard from "../containers/Dashboard";
import Upload from "../containers/Upload";
import Editor from "../containers/Editor";
import Verification from "../containers/Verification";
import DataExport from "../containers/DataExport";

// ─────────────────────────────────────────────
export default function AppNavigator() {   //Composant principal de navigation 
  return (
    <Routes>   

      {/* ── Page par défaut → Login ── */}
      <Route
        path={ROUTES.DEFAULT}
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

      {/* ══════════════════════════════════════
           PAGES PUBLIQUES
           Accessibles sans connexion
          ══════════════════════════════════════ */}
      <Route
        path={ROUTES.LOGIN}
        element={<Login />}
      />
      <Route
        path={ROUTES.SIGNUP}
        element={<SignUp />}
      />

      {/* ══════════════════════════════════════
           PAGES PRIVÉES
           PrivateRoute vérifie le token
           Si pas connecté → redirige /login
          ══════════════════════════════════════ */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.UPLOAD}
        element={
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.EDITOR}
        element={
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.VERIFICATION}
        element={
          <PrivateRoute>
            <Verification />
          </PrivateRoute>
        }
      />
      <Route
        path={ROUTES.EXPORT}
        element={
          <PrivateRoute>
            <DataExport />
          </PrivateRoute>
        }
      />

      {/* ── Route inconnue → Login ── */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.LOGIN} replace />}
      />

    </Routes>
  );
}
//URL → AppNavigator →Route →PrivateRoute? →Page