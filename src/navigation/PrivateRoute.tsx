// ─────────────────────────────────────────────
//  navigation/PrivateRoute.tsx
//  Protège les pages privées
//  → Lit le token depuis REDUX (plus localStorage)
// ─────────────────────────────────────────────

// Navigate → composant React Router qui redirige
// vers une autre URL sans que l'user clique sur rien
import { Navigate } from "react-router-dom";

// useSelector → hook Redux pour lire une valeur
// depuis le state global du store
import { useSelector } from "react-redux";

// selectIsAuthenticated → selector qu'on a créé dans authSelectors.ts
// retourne true si token existe dans Redux, false sinon
// !!token → null = false / "eyJ..." = true
import { selectIsAuthenticated } from "../store/auth/authSelectors";

// ROUTES → chemins centralisés
// on utilise ROUTES.LOGIN au lieu d'écrire "/login" en dur
import { ROUTES } from "./routes";

// ─────────────────────────────────────────────
// Type des props de ce composant
// children → tout ce qu'on met entre les balises
// ex: <PrivateRoute><Dashboard /></PrivateRoute>
//     children = <Dashboard />
// ─────────────────────────────────────────────
interface PrivateRouteProps {
  children: React.ReactNode; // accepte n'importe quel composant React
}

// ─────────────────────────────────────────────
// Composant PrivateRoute
// Reçoit un composant enfant (children)
// et décide si on l'affiche ou on redirige
// ─────────────────────────────────────────────
export default function PrivateRoute({ children }: PrivateRouteProps) {

  // Lit isAuthenticated depuis Redux
  // → true  : l'user a un token valide → il est connecté
  // → false : pas de token → il n'est pas connecté
  // Se met à jour automatiquement si le token change
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Si l'user n'est PAS connecté →
  // on affiche Navigate qui redirige vers /login
  // replace → remplace l'historique au lieu d'ajouter une entrée
  // (empêche l'user de revenir en arrière vers la page protégée)
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Si l'user EST connecté →
  // on affiche le composant enfant passé en prop
  // <></> → Fragment React — enveloppe sans ajouter de div dans le DOM
  return <>{children}</>;
}