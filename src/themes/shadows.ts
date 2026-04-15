// ─────────────────────────────────────────────
//  themes/shadows.ts
//  Ombres portées — light + dark
// ─────────────────────────────────────────────

export const lightShadows = {
  none: "none",
  sm:   "0 1px 2px rgba(0,0,0,0.05)",
  md:   "0 4px 6px rgba(0,0,0,0.07)",
  lg:   "0 10px 15px rgba(0,0,0,0.1)",
  xl:   "0 20px 25px rgba(0,0,0,0.1)",
  card: "0 1px 3px rgba(0,0,0,0.08)",  // cards du dashboard
} as const

export const darkShadows = {
  none: "none",
  sm:   "0 1px 2px rgba(0,0,0,0.3)",
  md:   "0 4px 6px rgba(0,0,0,0.4)",
  lg:   "0 10px 15px rgba(0,0,0,0.5)",
  xl:   "0 20px 25px rgba(0,0,0,0.5)",
  card: "0 1px 3px rgba(0,0,0,0.3)",
} as const

// ✅ APRÈS : clés explicites en string
//    → les deux thèmes acceptés
export type ShadowTheme = {
  none: string
  sm:   string
  md:   string
  lg:   string
  xl:   string
  card: string
}