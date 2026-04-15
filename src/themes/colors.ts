// ─────────────────────────────────────────────
//  themes/colors.ts
//  Palette de couleurs complète — Light + Dark
//  Couleur principale : Bleu marine #1a3a8f
// ─────────────────────────────────────────────

// ── Couleurs de base (primitives) ────────────
// Ces couleurs ne changent jamais — elles servent
// de base pour construire les thèmes light et dark
const palette = {

  // Bleu — couleur principale de Scanalyze
  blue50:  "#eff6ff",
  blue100: "#dbeafe",
  blue200: "#bfdbfe",
  blue500: "#3b82f6",
  blue700: "#1d4ed8",
  blue900: "#1a3a8f",  // ← couleur principale de ta Sidebar

  // Gris — pour les textes, bordures, fonds
  gray50:  "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray500: "#6b7280",
  gray600: "#4b5563",
  gray700: "#374151",
  gray800: "#1f2937",
  gray900: "#111827",

  // Vert — succès
  green50:  "#dcfce7",
  green600: "#16a34a",
  green700: "#15803d",

  // Rouge — erreur
  red50:  "#fef2f2",
  red500: "#ef4444",
  red600: "#dc2626",

  // Orange — avertissement
  orange50:  "#fff7ed",
  orange500: "#f97316",
  orange600: "#ea580c",

  // Blanc / Noir
  white: "#ffffff",
  black: "#000000",
} as const

// ─────────────────────────────────────────────
// Thème LIGHT
// ─────────────────────────────────────────────
export const lightColors = {

  // ── Brand ──────────────────────────────────
  primary:        palette.blue900,   // #1a3a8f — boutons, liens actifs
  primaryHover:   palette.blue700,   // #1d4ed8 — hover sur bouton primary
  primaryLight:   palette.blue50,    // #eff6ff — fond badge, highlight

  // ── Fonds ──────────────────────────────────
  bgApp:          palette.gray50,    // #f9fafb — fond de toute l'app
  bgSurface:      palette.white,     // #ffffff — cards, sidebar, modals
  bgHover:        palette.gray100,   // #f3f4f6 — hover sur nav items
  bgInput:        palette.white,     // #ffffff — fond des inputs

  // ── Textes ─────────────────────────────────
  textPrimary:    palette.gray900,   // #111827 — titres, valeurs importantes
  textSecondary:  palette.gray500,   // #6b7280 — labels, descriptions
  textDisabled:   palette.gray300,   // #d1d5db — texte désactivé
  textInverse:    palette.white,     // #ffffff — texte sur fond bleu

  // ── Bordures ───────────────────────────────
  border:         palette.gray200,   // #e5e7eb — bordures normales
  borderFocus:    palette.blue900,   // #1a3a8f — bordure input focus
  borderStrong:   palette.gray300,   // #d1d5db — bordures marquées

  // ── Statuts ────────────────────────────────
  success:        palette.green600,  // texte vert
  successBg:      palette.green50,   // fond vert clair
  error:          palette.red600,    // texte rouge
  errorBg:        palette.red50,     // fond rouge clair
  warning:        palette.orange600, // texte orange
  warningBg:      palette.orange50,  // fond orange clair

  // ── Sidebar ────────────────────────────────
  sidebarBg:      palette.white,
  sidebarActive:  palette.blue900,
  sidebarText:    palette.gray500,
  sidebarActiveText: palette.white,

} as const

// ─────────────────────────────────────────────
// Thème DARK
// ─────────────────────────────────────────────
export const darkColors = {

  // ── Brand ──────────────────────────────────
  primary:        palette.blue500,   // bleu plus clair sur dark
  primaryHover:   palette.blue200,
  primaryLight:   "#1e3a5f",         // bleu très foncé pour highlights

  // ── Fonds ──────────────────────────────────
  bgApp:          "#0f172a",         // fond très sombre (bleu nuit)
  bgSurface:      "#1e293b",         // cards, sidebar
  bgHover:        "#334155",         // hover
  bgInput:        "#1e293b",         // fond inputs

  // ── Textes ─────────────────────────────────
  textPrimary:    "#f1f5f9",         // blanc cassé — titres
  textSecondary:  "#94a3b8",         // gris clair — labels
  textDisabled:   "#475569",         // gris foncé — désactivé
  textInverse:    palette.white,

  // ── Bordures ───────────────────────────────
  border:         "#334155",         // bordures sombres
  borderFocus:    palette.blue500,
  borderStrong:   "#475569",

  // ── Statuts ────────────────────────────────
  success:        "#4ade80",
  successBg:      "#052e16",
  error:          "#f87171",
  errorBg:        "#450a0a",
  warning:        "#fb923c",
  warningBg:      "#431407",

  // ── Sidebar ────────────────────────────────
  sidebarBg:      "#1e293b",
  sidebarActive:  palette.blue500,
  sidebarText:    "#94a3b8",
  sidebarActiveText: palette.white,

} as const

// ✅ APRÈS : on déclare explicitement les clés en string
//    → les deux thèmes peuvent avoir n'importe quelle valeur hex
export type ColorTheme = {
  primary:          string
  primaryHover:     string
  primaryLight:     string

  bgApp:            string
  bgSurface:        string
  bgHover:          string
  bgInput:          string

  textPrimary:      string
  textSecondary:    string
  textDisabled:     string
  textInverse:      string

  border:           string
  borderFocus:      string
  borderStrong:     string

  success:          string
  successBg:        string
  error:            string
  errorBg:          string
  warning:          string
  warningBg:        string

  sidebarBg:        string
  sidebarActive:    string
  sidebarText:      string
  sidebarActiveText: string
}