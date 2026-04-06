// ─────────────────────────────────────────────
//  navigation/PrivateRoute.tsx
//  Protège les pages privées
//  → Lit le token depuis REDUX (plus localStorage)
// ─────────────────────────────────────────────

import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";               // ← Redux
import { selectIsAuthenticated } from "../store/auth/authSelectors"; // ← selector
import { ROUTES } from "./routes";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {

  // ← lit depuis Redux au lieu de localStorage directement
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
