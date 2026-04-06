// ─────────────────────────────────────────────
//  App.tsx
//  Point d'entrée de l'application
//  Délègue toute la navigation à AppNavigator
// ─────────────────────────────────────────────

import { BrowserRouter } from "react-router-dom";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <BrowserRouter>
      <AppNavigator />
    </BrowserRouter>
  );
}
