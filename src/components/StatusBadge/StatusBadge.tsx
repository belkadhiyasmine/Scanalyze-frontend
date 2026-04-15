// ─────────────────────────────────────────────
//  components/StatusBadge/StatusBadge.tsx
//  Child Component — utilisé dans :
//  Dashboard (tableau), Verification
//  Affiche un badge coloré selon le statut
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }        from "../../themes/ThemeContext"
import { spacing, radius } from "../../themes/spacing"
import { StatusBadgeProps } from "../../types"

// ─────────────────────────────────────────────
//  TYPE DES PROPS
// ─────────────────────────────────────────────

// On enveloppe StatusBadgeProps dans un objet
// pour pouvoir le destructurer proprement
type Props = {
  status: StatusBadgeProps  // "Success" | "Processing" | "Error"
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function StatusBadge({ status }: Props) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Config des statuts ─────────────────────
  // Définie ici (dans le composant) car elle dépend
  // des couleurs du theme actif (light/dark)
  const STATUS_CONFIG = {

    // ✅ Succès — vert
    Success: {
      bg:    colors.successBg,   // fond vert clair selon le theme
      color: colors.success,     // texte vert selon le theme
      dot:   colors.success,     // point vert
    },

    // 🔄 En traitement — bleu
    Processing: {
      bg:    colors.primaryLight, // fond bleu très clair selon le theme
      color: colors.primary,      // texte bleu selon le theme
      dot:   colors.primary,      // point bleu
    },

    // ❌ Erreur — rouge
    Error: {
      bg:    colors.errorBg,   // fond rouge clair selon le theme
      color: colors.error,     // texte rouge selon le theme
      dot:   colors.error,     // point rouge
    },
  }

  // Récupère la config du statut reçu en prop
  const config = STATUS_CONFIG[status]

  // ── Rendu ──────────────────────────────────
  return (
    <span
      style={{
        display:         "inline-flex",
        alignItems:      "center",
        gap:             spacing[1],    // 4px — espace entre point et texte
        padding:         `${spacing[1]} ${spacing[2]}`, // 4px 8px
        borderRadius:    radius.full,   // 99px — forme pilule
        backgroundColor: config.bg,     // fond selon le statut et le theme
        color:           config.color,  // texte selon le statut et le theme
        fontSize:        theme.fontSize.xs,      // petit texte
        fontWeight:      theme.fontWeight.medium, // depuis typography.ts
      }}
    >
      {/* ── Point coloré ───────────────────────
          Petit cercle à gauche du texte        */}
      <span
        style={{
          width:           "6px",
          height:          "6px",
          borderRadius:    radius.round,  // 50% — cercle parfait
          backgroundColor: config.dot,    // couleur du point selon le statut
          flexShrink:      0,             // ne rétrécit pas
        }}
      />

      {/* Texte du statut — "Success", "Processing" ou "Error" */}
      {status}
    </span>
  )
}