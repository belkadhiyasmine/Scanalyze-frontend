// ─────────────────────────────────────────────
//  themes/typography.ts
//  Typographie — fonts, tailles, poids, hauteurs
// ─────────────────────────────────────────────

// ── Fonts ─────────────────────────────────────
// Inter → moderne, lisible, parfaite pour les dashboards
// importée via index.css avec Google Fonts
//
// • primary → fonte principale de l'UI (textes, labels, nav…)
// • sans    → alias de primary, utilisable dans les composants
//             qui référencent explicitement theme.fontFamily.sans
// • mono    → fonte à chasse fixe pour codes / tokens / snippets
export const fontFamily = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  sans:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", // alias de primary
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
} as const

// ── Tailles ───────────────────────────────────
// Échelle cohérente du plus petit au plus grand :
//   xs  → labels uppercase, badges discrets
//   sm  → textes secondaires, captions, métadonnées
//   base→ texte courant (défaut dans les paragraphes)
//   md  → paragraphes principaux, items de navigation
//   lg  → sous-titres de section
//   xl  → titres de section
//   xxl → titres de page
//   xxxl→ métriques dashboard (MetricCard)
//   huge→ grands chiffres mis en avant (KPIs, hero numbers)
export const fontSize = {
  xs:   "11px",
  sm:   "12px",
  base: "13px",
  md:   "14px",
  lg:   "16px",
  xl:   "18px",
  xxl:  "24px",
  xxxl: "28px",
  huge: "36px",
} as const

// ── Poids ─────────────────────────────────────
// Du plus léger au plus lourd :
//   regular   → texte courant, descriptions
//   medium    → texte légèrement mis en valeur
//   semibold  → labels, items de nav, boutons
//   bold      → titres, valeurs numériques importantes
//   extrabold → grands titres, héros, accroches
export const fontWeight = {
  regular:   "400",
  medium:    "500",
  semibold:  "600",
  bold:      "700",
  extrabold: "800",
} as const

// ── Hauteurs de ligne ─────────────────────────
//   tight  → titres (évite l'excès d'espace entre lignes courtes)
//   normal → texte courant (lisibilité standard)
//   loose  → paragraphes longs (améliore la lecture dense)
export const lineHeight = {
  tight:  "1.2",
  normal: "1.5",
  loose:  "1.8",
} as const

// ── Letter spacing ────────────────────────────
//   tight  → grands titres (resserre pour un effet impactant)
//   normal → texte courant (pas de modification)
//   wide   → labels uppercase (aération pour la lisibilité)
//   wider  → labels très espacés, accroches visuelles
export const letterSpacing = {
  tight:  "-0.5px",
  normal: "0px",
  wide:   "0.5px",
  wider:  "1px",
} as const