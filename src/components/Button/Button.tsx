// ─────────────────────────────────────────────
//  components/Button/Button.tsx
//  Composant bouton réutilisable
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }                    from "../../themes/ThemeContext"
import { spacing, radius, dimensions } from "../../themes/spacing"

// ─────────────────────────────────────────────
//  TYPES
//  Valeurs autorisées pour variant et size
// ─────────────────────────────────────────────

// Les 4 apparences visuelles possibles du bouton
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"

// Les 3 tailles possibles du bouton
type ButtonSize = "sm" | "md" | "lg"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
//  Toutes les propriétés acceptées par Button
// ─────────────────────────────────────────────

interface ButtonProps {
  label:      string           // Texte affiché dans le bouton (obligatoire)
  onClick?:   () => void       // Fonction déclenchée au clic (optionnel)
  variant?:   ButtonVariant    // Apparence visuelle — défaut : "primary"
  size?:      ButtonSize       // Taille du bouton   — défaut : "md"
  disabled?:  boolean          // Désactive le bouton si true — défaut : false
  fullWidth?: boolean          // Prend toute la largeur disponible — défaut : false
  type?:      "button" | "submit" | "reset"  // Type HTML natif — défaut : "button"
  icon?:      React.ReactNode  // Icône affichée à gauche du texte (optionnel)
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Button({
  label,
  onClick,
  variant   = "primary",  // valeur par défaut si variant non fourni
  size      = "md",       // valeur par défaut si size non fourni
  disabled  = false,      // bouton actif par défaut
  fullWidth = false,      // largeur auto par défaut
  type      = "button",   // type HTML natif par défaut
  icon,
}: ButtonProps) {

  // ── Lecture du theme actif ─────────────────
  // useTheme() retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Config des variantes ───────────────────
  // Chaque variante utilise les couleurs du theme actif
  // → s'adapte automatiquement au mode light/dark
  const VARIANT_CONFIG: Record<ButtonVariant, React.CSSProperties> = {

    // Bouton principal — action la plus importante
    // Ex : "Confirmer", "Envoyer", "Se connecter"
    primary: {
      backgroundColor: colors.primary,       // bleu marine light / bleu clair dark
      color:           colors.textInverse,   // toujours blanc (lisible sur fond bleu)
      border:          `1px solid ${colors.primary}`,
    },

    // Bouton secondaire — action alternative moins importante
    // Ex : "Modifier", "Voir les détails", "Retour"
    secondary: {
      backgroundColor: colors.bgSurface,     // blanc light / gris foncé dark
      color:           colors.primary,       // texte bleu — même teinte que primary
      border:          `1px solid ${colors.primary}`,
    },

    // Bouton danger — action destructive et irréversible
    // Ex : "Supprimer", "Désactiver le compte", "Vider"
    danger: {
      backgroundColor: colors.error,         // rouge light / rouge clair dark
      color:           colors.textInverse,   // texte blanc pour contraste sur rouge
      border:          `1px solid ${colors.error}`,
    },

    // Bouton ghost — action peu importante, visuellement discret
    // Ex : "Annuler", "Fermer", "Plus tard"
    ghost: {
      backgroundColor: "transparent",        // aucun fond
      color:           colors.textSecondary, // texte gris discret
      border:          `1px solid ${colors.border}`, // bordure légère
    },
  }

  // ── Config des tailles ─────────────────────
  // Utilise spacing et dimensions depuis spacing.ts
  // → valeurs cohérentes avec tout le projet
  const SIZE_CONFIG: Record<ButtonSize, React.CSSProperties> = {

    // Petit — pour espaces réduits (tableaux, toolbars, badges)
    sm: {
      padding:  `${spacing[1]} ${spacing[3]}`,  // 4px 12px
      fontSize: "12px",
      height:   dimensions.buttonHeightSm,       // 32px — défini dans spacing.ts
    },

    // Moyen — taille standard, utilisée par défaut
    md: {
      padding:  `${spacing[2]} ${spacing[5]}`,  // 8px 20px
      fontSize: "14px",
      height:   dimensions.buttonHeightMd,       // 40px
    },

    // Grand — pour les zones d'appel à l'action importantes
    lg: {
      padding:  `${spacing[3]} ${spacing[7]}`,  // 12px 28px
      fontSize: "16px",
      height:   dimensions.buttonHeightLg,       // 48px
    },
  }

  // ── Rendu ──────────────────────────────────
  return (
    <button
      type={type}         // type HTML natif du bouton
      onClick={onClick}   // fonction appelée au clic
      disabled={disabled} // désactive le bouton si true
      style={{
        ...BASE_STYLES,             // styles fixes communs à tous les boutons
        ...VARIANT_CONFIG[variant], // styles de la variante choisie
        ...SIZE_CONFIG[size],       // styles de la taille choisie

        // Pleine largeur si fullWidth=true, sinon s'adapte au contenu
        width: fullWidth ? "100%" : "auto",

        // Opacité réduite à 50% pour indiquer visuellement que le bouton est désactivé
        opacity: disabled ? 0.5 : 1,

        // Curseur interdit si désactivé, pointeur normal sinon
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* Icône — affichée seulement si la prop icon est fournie */}
      {icon && <span style={ICON_STYLE}>{icon}</span>}

      {/* Texte du bouton */}
      {label}
    </button>
  )
}

// ─────────────────────────────────────────────
//  STYLES FIXES
//  Ne dépendent pas du theme
//  → identiques en mode light et dark
//  → définis hors du composant pour éviter
//    de les recréer à chaque rendu
// ─────────────────────────────────────────────

// Styles de base appliqués à tous les boutons sans exception
const BASE_STYLES: React.CSSProperties = {
  display:        "inline-flex",   // aligne icône + texte sur la même ligne
  alignItems:     "center",        // centrage vertical
  justifyContent: "center",        // centrage horizontal
  gap:            spacing[2],      // 8px — espace entre icône et texte
  borderRadius:   radius.md,       // 8px — coins arrondis (cohérent avec Sidebar)
  fontWeight:     "600",           // texte semi-gras pour meilleure lisibilité
  transition:     "opacity 0.15s", // animation douce sur changement d'opacité
  outline:        "none",          // supprime le contour focus par défaut du navigateur
  whiteSpace:     "nowrap",        // empêche le texte de se couper sur deux lignes
}

// Style du conteneur d'icône
const ICON_STYLE: React.CSSProperties = {
  display:    "flex",
  alignItems: "center",  // centre l'icône verticalement par rapport au texte
}