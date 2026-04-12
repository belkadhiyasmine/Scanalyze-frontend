// ─────────────────────────────────────────────
//  themes/ThemeContext.tsx
//  Contexte React pour switcher light / dark
//  → Accessible depuis n'importe quel composant
// ─────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from "react"
import { AppTheme, lightTheme, darkTheme } from "./theme"

// ── Type du contexte ──────────────────────────
interface ThemeContextType {
  theme:       AppTheme           // thème actif complet
  mode:        "light" | "dark"   // mode actif
  toggleTheme: () => void         // fonction pour switcher
}

// ── Création du contexte ──────────────────────
const ThemeContext = createContext<ThemeContextType>({
  theme:       lightTheme,
  mode:        "light",
  toggleTheme: () => {},
})

// ── Provider — entoure toute l'app ────────────
export function ThemeProvider({ children }: { children: React.ReactNode }) {

  // Lit le mode sauvegardé dans localStorage
  // Si rien → light par défaut
  const [mode, setMode] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "light"
  })

  // Sauvegarde le mode dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("theme", mode)
  }, [mode])

  // Fonction pour switcher entre light et dark
  const toggleTheme = () => {
    setMode((prev) => prev === "light" ? "dark" : "light")
  }

  // Thème actif selon le mode
  const theme = mode === "light" ? lightTheme : darkTheme

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ── Hook custom — utilisation simplifiée ──────
// Au lieu de useContext(ThemeContext) partout
// on utilise juste useTheme()
export function useTheme() {
  return useContext(ThemeContext)
}