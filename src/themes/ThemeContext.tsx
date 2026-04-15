// ─────────────────────────────────────────────
//  themes/ThemeContext.tsx
//  Contexte React pour switcher light / dark
//  → Accessible depuis n'importe quel composant
// ─────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react"
import { AppTheme, lightTheme, darkTheme } from "./theme"

// ─────────────────────────────────────────────
//  TYPE DU CONTEXTE
//  Ce que useTheme() retourne à chaque composant
// ─────────────────────────────────────────────

interface ThemeContextType {
  theme:       AppTheme         // theme complet actif (colors, spacing, fonts...)
  mode:        "light" | "dark" // mode actif — utile pour afficher une icône soleil/lune
  toggleTheme: () => void       // fonction pour basculer entre light et dark
}

// ─────────────────────────────────────────────
//  CRÉATION DU CONTEXTE
//  Valeurs par défaut utilisées si un composant
//  est rendu en dehors du ThemeProvider
// ─────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextType>({
  theme:       lightTheme,  // light par défaut
  mode:        "light",
  toggleTheme: () => {},    // fonction vide par défaut
})

// ─────────────────────────────────────────────
//  THEME PROVIDER
//  Entoure toute l'app dans App.tsx
//  → rend le theme accessible partout
// ─────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {

  // ── Initialisation du mode ─────────────────
  // Lit le mode sauvegardé dans localStorage
  // Si rien n'est sauvegardé → "light" par défaut
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light"
  })

  // ── Sauvegarde automatique ─────────────────
  // À chaque changement de mode → sauvegarde dans localStorage
  // → le choix est conservé même après fermeture du navigateur
  useEffect(() => {
    localStorage.setItem("theme", mode)
  }, [mode])

  // ── Fonction de bascule ────────────────────
  // Appelée au clic sur le bouton light/dark
  // "light" → "dark" et inversement
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"))
  }

  // ── Theme actif ────────────────────────────
  // Sélectionne lightTheme ou darkTheme
  // selon le mode actuel
  const theme = mode === "light" ? lightTheme : darkTheme

  // ── Rendu ──────────────────────────────────
  // Fournit theme, mode et toggleTheme
  // à tous les composants enfants via le contexte
  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─────────────────────────────────────────────
//  HOOK CUSTOM useTheme()
//  Simplifie l'accès au theme dans les composants
//
//  ❌ Sans hook : const { theme } = useContext(ThemeContext)
//  ✅ Avec hook : const { theme } = useTheme()
// ─────────────────────────────────────────────

export function useTheme() {
  return useContext(ThemeContext)
}