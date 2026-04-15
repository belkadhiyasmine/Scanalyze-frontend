// ─────────────────────────────────────────────
//  themes/spacing.ts
//  Espacements, border-radius, dimensions fixes
// ─────────────────────────────────────────────

// ── Espacements (padding, margin, gap) ────────
export const spacing = {
  0:  "0px",
  1:  "4px",
  2:  "8px",
  3:  "12px",
  4:  "16px",
  5:  "20px",
  6:  "24px",
  7:  "28px",
  8:  "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const

// ── Border radius ─────────────────────────────
export const radius = {
  sm:   "4px",   // petits éléments
  md:   "8px",   // boutons, inputs, cards (utilisé dans ta Sidebar)
  lg:   "12px",  // grandes cards (MetricCard)
  xl:   "16px",  // modals
  full: "99px",  // badges, pills (StatusBadge)
  round:"50%",   // avatars (comme dans ta Sidebar)
} as const

// ── Dimensions fixes ──────────────────────────
export const dimensions = {
  sidebarWidth:   "220px",  // largeur Sidebar — cohérent avec ton code
  headerHeight:   "64px",
  inputHeight:    "40px",
  buttonHeightSm: "32px",
  buttonHeightMd: "40px",
  buttonHeightLg: "48px",
  avatarSm:       "32px",
  avatarMd:       "36px",  // taille avatar dans ta Sidebar
  avatarLg:       "48px",
} as const