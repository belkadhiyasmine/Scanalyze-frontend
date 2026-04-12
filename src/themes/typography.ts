// ─────────────────────────────────────────────
//  themes/typography.ts
//  Typographie — fonts, tailles, poids, hauteurs
// ─────────────────────────────────────────────

// ── Fonts ─────────────────────────────────────
// Inter → moderne, lisible, parfaite pour les dashboards
// importée via index.css avec Google Fonts
export const fontFamily = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', monospace", // pour les codes/tokens
} as const

// ── Tailles ───────────────────────────────────
export const fontSize = {
  xs:   "11px",  // labels uppercase, badges
  sm:   "12px",  // textes secondaires, captions
  base: "13px",  // texte courant
  md:   "14px",  // paragraphes, nav items
  lg:   "16px",  // sous-titres
  xl:   "18px",  // titres de section
  xxl:  "24px",  // titres de page
  xxxl: "28px",  // métriques dashboard (MetricCard)
  huge: "36px",  // grands chiffres
} as const

// ── Poids ─────────────────────────────────────
export const fontWeight = {
  regular:   "400",  // texte normal
  medium:    "500",  // texte légèrement mis en valeur
  semibold:  "600",  // labels, nav items
  bold:      "700",  // titres, valeurs importantes
  extrabold: "800",  // grands titres
} as const

// ── Hauteurs de ligne ─────────────────────────
export const lineHeight = {
  tight:  "1.2",  // titres
  normal: "1.5",  // texte courant
  loose:  "1.8",  // paragraphes longs
} as const

// ── Letter spacing ────────────────────────────
export const letterSpacing = {
  tight:  "-0.5px",  // grands titres
  normal: "0px",
  wide:   "0.5px",   // labels uppercase (comme dans MetricCard)
  wider:  "1px",
} as const