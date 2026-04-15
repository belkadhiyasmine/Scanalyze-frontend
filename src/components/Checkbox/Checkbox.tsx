// ─────────────────────────────────────────────
//  src/components/Checkbox/Checkbox.tsx
//  Case à cocher personnalisée
//  Connectée au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }  from "../../themes/ThemeContext"
import { spacing, radius } from "../../themes/spacing"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
// ─────────────────────────────────────────────

interface CheckboxProps {
  label:     string                     // texte affiché à côté de la case (obligatoire)
  checked:   boolean                    // true = cochée / false = décochée
  onChange:  (checked: boolean) => void // appelée à chaque changement d'état
  disabled?: boolean                    // désactive la checkbox si true — défaut : false
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false, // active par défaut
}: CheckboxProps) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Rendu ──────────────────────────────────
  return (
    <label
      style={{
        ...WRAPPER_STYLE,
        opacity: disabled ? 0.5 : 1,           // grisé à 50% si désactivé
        cursor:  disabled ? "not-allowed" : "pointer", // curseur adapté
      }}
    >
      {/* ── Case à cocher custom ───────────────
          Un div stylisé qui remplace la checkbox
          moche du navigateur                   */}
      <div
        style={{
          ...BOX_STYLE,
          // Fond bleu si cochée, fond surface (blanc/dark) si décochée
          backgroundColor: checked ? colors.primary : colors.bgSurface,
          // Bordure bleue si cochée, bordure normale si décochée
          borderColor:     checked ? colors.primary : colors.border,
        }}
        onClick={() => !disabled && onChange(!checked)} // inverse l'état au clic
      >
        {/* ── Checkmark SVG ──────────────────────
            Affiché seulement quand checked = true
            Dessiné à la main avec des coordonnées SVG */}
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"      // forme du trait ✓
              stroke={colors.textInverse}      // blanc — lisible sur fond bleu
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* ── Label ──────────────────────────────
          Texte affiché à droite de la case    */}
      <span
        style={{
          fontSize:   theme.fontSize.sm,      // taille depuis typography.ts
          color:      colors.textPrimary,     // couleur texte selon le theme
          fontWeight: theme.fontWeight.medium,// poids depuis typography.ts
        }}
      >
        {label}
      </span>

      {/* ── Input caché ────────────────────────
          Invisible mais nécessaire pour :
          - les lecteurs d'écran (accessibilité)
          - la soumission de formulaires HTML   */}
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
    </label>
  )
}

// ─────────────────────────────────────────────
//  STYLES FIXES
//  Ne dépendent pas du theme
//  → définis hors du composant pour éviter
//    de les recréer à chaque rendu
// ─────────────────────────────────────────────

// Style du conteneur principal (label + case + texte)
const WRAPPER_STYLE: React.CSSProperties = {
  display:    "inline-flex",
  alignItems: "center",
  gap:        spacing[2],   // 8px — espace entre la case et le texte
  userSelect: "none",       // empêche la sélection du texte au clic
}

// Style de la case carrée
const BOX_STYLE: React.CSSProperties = {
  width:          "18px",
  height:         "18px",
  borderRadius:   radius.sm,          // 4px — légèrement arrondi
  border:         "1.5px solid",      // épaisseur de bordure fixe
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  flexShrink:     0,                  // ne rétrécit pas si l'espace est limité
  transition:     "background 0.15s, border-color 0.15s", // animation douce
}
