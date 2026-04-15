// ─────────────────────────────────────────────
//  themes/theme.ts
//  Objet theme complet — assemble tout
// ─────────────────────────────────────────────

import { lightColors, darkColors, ColorTheme } from "./colors"
import { lightShadows, darkShadows, ShadowTheme } from "./shadows"
import { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from "./typography"
import { spacing, radius, dimensions } from "./spacing"

// Type du theme complet
export interface AppTheme {
  colors:        ColorTheme
  shadows:       ShadowTheme
  fontFamily:    typeof fontFamily
  fontSize:      typeof fontSize
  fontWeight:    typeof fontWeight
  lineHeight:    typeof lineHeight
  letterSpacing: typeof letterSpacing
  spacing:       typeof spacing
  radius:        typeof radius
  dimensions:    typeof dimensions
  mode:          "light" | "dark"
}

// ── Thème Light ───────────────────────────────
export const lightTheme: AppTheme = {
  colors:        lightColors,
  shadows:       lightShadows,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  radius,
  dimensions,
  mode: "light",
}

// ── Thème Dark ────────────────────────────────
export const darkTheme: AppTheme = {
  colors:        darkColors,
  shadows:       darkShadows,
  fontFamily,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  spacing,
  radius,
  dimensions,
  mode: "dark",
}