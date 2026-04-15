// ─────────────────────────────────────────────
//  src/components/TextInput/TextInput.tsx
//  Champ de saisie réutilisable
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import React                   from "react"
import { useTheme }            from "../../themes/ThemeContext"
import { spacing, radius }     from "../../themes/spacing"

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

// Les 5 types de champ acceptés
type InputType = "text" | "email" | "password" | "number" | "search"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
//  Exportée — utilisée par react-hook-form
//  et les formulaires manuels
// ─────────────────────────────────────────────

export interface TextInputProps {
  label?:       string                                  // label affiché au-dessus du champ
  placeholder?: string                                  // texte indicatif dans le champ vide
  value?:       string                                  // valeur contrôlée du champ
  onChange?:    React.ChangeEventHandler<HTMLInputElement> // appelé à chaque frappe
  onBlur?:      React.FocusEventHandler<HTMLInputElement>  // appelé quand le champ perd le focus
  name?:        string                                  // nom du champ — utile pour les formulaires
  type?:        InputType                               // type HTML du champ — défaut : "text"
  disabled?:    boolean                                 // désactive le champ si true
  error?:       string                                  // message d'erreur affiché sous le champ
  icon?:        React.ReactNode                         // icône affichée à gauche du champ
  fullWidth?:   boolean                                 // prend toute la largeur — défaut : false
  min?:         string | number                         // valeur minimum (type number)
  max?:         string | number                         // valeur maximum (type number)
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  type      = "text",   // champ texte par défaut
  disabled  = false,    // actif par défaut
  error,
  icon,
  fullWidth = false,    // largeur auto par défaut
  min,
  max,
}: TextInputProps) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Rendu ──────────────────────────────────
  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>

      {/* ── Label ──────────────────────────────
          Affiché au-dessus du champ si fourni  */}
      {label && (
        <label
          style={{
            display:      "block",
            fontSize:     theme.fontSize.sm,         // depuis typography.ts
            fontWeight:   theme.fontWeight.semibold,  // depuis typography.ts
            color:        colors.textPrimary,         // foncé selon le theme
            marginBottom: spacing[1],                 // 4px
          }}
        >
          {label}
        </label>
      )}

      {/* ── Wrapper input + icône ──────────────
          Position relative pour placer
          l'icône en absolu à gauche            */}
      <div style={{ position: "relative" }}>

        {/* Icône à gauche — affichée seulement si fournie */}
        {icon && (
          <span
            style={{
              position:   "absolute",
              left:       spacing[3],       // 12px depuis le bord gauche
              top:        "50%",
              transform:  "translateY(-50%)", // centrage vertical parfait
              color:      colors.textSecondary, // gris discret selon le theme
              display:    "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </span>
        )}

        {/* Champ de saisie */}
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          min={min}
          max={max}
          style={{
            width:           "100%",
            // Padding gauche agrandi si icône présente
            // pour ne pas écrire sous l'icône
            paddingLeft:     icon ? "38px" : spacing[3],  // 38px ou 12px
            paddingRight:    spacing[3],                   // 12px
            paddingTop:      spacing[2],                   // 8px
            paddingBottom:   spacing[2],                   // 8px
            fontSize:        theme.fontSize.sm,            // depuis typography.ts
            color:           colors.textPrimary,           // texte foncé selon le theme
            backgroundColor: colors.bgInput,               // blanc light / sombre dark
            // Bordure rouge si erreur, normale sinon
            border:          `1px solid ${error ? colors.error : colors.border}`,
            borderRadius:    radius.md,                    // 8px
            outline:         "none",
            boxSizing:       "border-box",                 // padding inclus dans la largeur
            transition:      "border-color 0.15s",         // animation douce au focus
            // Grisé si désactivé
            opacity:         disabled ? 0.5 : 1,
            cursor:          disabled ? "not-allowed" : "text",
          }}
        />
      </div>

      {/* ── Message d'erreur ───────────────────
          Affiché sous le champ si error fourni */}
      {error && (
        <p
          style={{
            fontSize:  theme.fontSize.xs,   // très petit
            color:     colors.error,        // rouge selon le theme
            margin:    `${spacing[1]} 0 0`, // 4px en haut seulement
          }}
        >
          {error}
        </p>
      )}

    </div>
  )
}