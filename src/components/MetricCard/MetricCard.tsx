// ─────────────────────────────────────────────
//  components/MetricCard/MetricCard.tsx
//  Child Component — utilisé 4 fois dans Dashboard
//  Affiche une métrique avec valeur et tendance
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }        from "../../themes/ThemeContext"
import { spacing, radius } from "../../themes/spacing"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
// ─────────────────────────────────────────────

interface MetricCardProps {
  label:   string           // titre de la métrique   ex : "Documents traités"
  value:   string           // valeur principale       ex : "1 284"
  trend:   string           // texte de tendance       ex : "+12% ce mois"
  trendUp: boolean          // true = hausse (vert) / false = baisse (rouge)
  icon:    React.ReactNode  // icône affichée en haut à droite
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function MetricCard({
  label,
  value,
  trend,
  trendUp,
  icon,
}: MetricCardProps) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  return (
    <div
      style={{
        backgroundColor: colors.bgSurface,   // blanc light / gris foncé dark
        borderRadius:    radius.lg,           // 12px — grandes cards
        border:          `1px solid ${colors.border}`, // bordure selon le theme
        padding:         spacing[5],          // 20px
      }}
    >

      {/* ── En-tête : label + icône ────────────
          Label à gauche, icône à droite       */}
      <div
        style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "center",
          marginBottom:   spacing[2],         // 8px
        }}
      >
        {/* Label de la métrique — petit texte gris en majuscules */}
        <span
          style={{
            fontSize:      theme.fontSize.xs,        // petit — depuis typography.ts
            fontWeight:    theme.fontWeight.semibold, // semi-gras
            color:         colors.textSecondary,      // gris selon le theme
            letterSpacing: theme.letterSpacing.wide,  // espacement depuis typography.ts
          }}
        >
          {label}
        </span>

        {/* Icône en haut à droite */}
        <span
          style={{
            display:    "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </span>
      </div>

      {/* ── Valeur principale ──────────────────
          Chiffre mis en avant — grande taille  */}
      <p
        style={{
          fontSize:   "28px",                      // taille fixe — pas dans typography.ts
          fontWeight: theme.fontWeight.bold,        // gras — depuis typography.ts
          color:      colors.textPrimary,           // titre foncé selon le theme
          margin:     `0 0 ${spacing[1]}`,          // 0 haut, 0 côtés, 4px bas
        }}
      >
        {value}
      </p>

      {/* ── Tendance colorée ───────────────────
          Vert si hausse (trendUp = true)
          Rouge si baisse (trendUp = false)     */}
      <p
        style={{
          fontSize:   theme.fontSize.sm,            // 13-14px depuis typography.ts
          fontWeight: theme.fontWeight.medium,       // depuis typography.ts
          // Vert succès ou rouge erreur selon le theme
          color:      trendUp ? colors.success : colors.error,
          margin:     0,
        }}
      >
        {/* Flèche haut ou bas selon la tendance */}
        {trendUp ? "↑" : "↓"} {trend}
      </p>

    </div>
  )
}
