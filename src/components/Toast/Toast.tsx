// ─────────────────────────────────────────────
//  components/Toast/Toast.tsx
//  Child Component — utilisé dans :
//  Upload, DataExport
//  Affiche une notification en bas à droite
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }        from "../../themes/ThemeContext"
import { spacing, radius } from "../../themes/spacing"
import { ToastProps }      from "../../types"

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Toast({ message, onClose }: ToastProps) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Rendu ──────────────────────────────────
  return (
    <div
      style={{
        position:        "fixed",
        bottom:          spacing[6],              // 24px depuis le bas
        right:           spacing[6],              // 24px depuis la droite
        backgroundColor: colors.bgSurface,        // blanc light / sombre dark
        border:          `1px solid ${colors.border}`, // bordure selon le theme
        borderRadius:    radius.lg,               // 12px — grandes cards
        padding:         `${spacing[3]} ${spacing[4]}`, // 14px 16px
        display:         "flex",
        alignItems:      "center",
        gap:             spacing[3],              // 12px entre les éléments
        boxShadow:       theme.shadows.lg,        // ombre depuis shadows.ts
        maxWidth:        "320px",
        zIndex:          1000,                    // au dessus du contenu
      }}
    >

      {/* ── Icône succès ───────────────────────
          Cercle vert avec checkmark blanc      */}
      <div
        style={{
          width:           "32px",
          height:          "32px",
          borderRadius:    radius.round,    // 50% — cercle parfait
          backgroundColor: colors.successBg, // fond vert clair selon le theme
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          flexShrink:      0,               // ne rétrécit pas
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill={colors.success}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* ── Message ────────────────────────────
          Texte de la notification              */}
      <p
        style={{
          fontSize:   theme.fontSize.sm,          // depuis typography.ts
          fontWeight: theme.fontWeight.medium,     // depuis typography.ts
          color:      colors.textPrimary,          // foncé selon le theme
          margin:     0,
          flex:       1,                           // prend l'espace disponible
        }}
      >
        {message}
      </p>

      {/* ── Bouton fermer ──────────────────────
          Croix ✕ à droite de la notification  */}
      <button
        style={{
          background:  "none",
          border:      "none",
          color:       colors.textSecondary,  // gris discret selon le theme
          cursor:      "pointer",
          fontSize:    theme.fontSize.sm,     // depuis typography.ts
          padding:     "0",
          flexShrink:  0,                     // ne rétrécit pas
        }}
        onClick={onClose}
      >
        ✕
      </button>

    </div>
  )
}
