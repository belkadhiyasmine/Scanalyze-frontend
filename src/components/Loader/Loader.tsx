// ─────────────────────────────────────────────
//  src/components/Loader/Loader.tsx
//  Spinner de chargement réutilisable
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useTheme }        from "../../themes/ThemeContext"
import { spacing }         from "../../themes/spacing"

// ─────────────────────────────────────────────
//  TYPES
// ─────────────────────────────────────────────

// Les 3 tailles possibles du spinner
type LoaderSize = "sm" | "md" | "lg"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
// ─────────────────────────────────────────────

interface LoaderProps {
  size?:     LoaderSize // taille du spinner        — défaut : "md"
  fullPage?: boolean    // occupe tout l'écran       — défaut : false
  label?:    string     // texte sous le spinner     — défaut : aucun
}

// ─────────────────────────────────────────────
//  CONFIG DES TAILLES
//  Dimensions en pixels pour chaque taille
// ─────────────────────────────────────────────

const SIZE_CONFIG: Record<LoaderSize, number> = {
  sm: 20,  // petit  — dans des boutons, tableaux
  md: 36,  // moyen  — chargement de section (défaut)
  lg: 52,  // grand  — chargement de page entière
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Loader({
  size     = "md",
  fullPage = false,
  label,
}: LoaderProps) {

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // Dimension en pixels selon la taille choisie
  const dim = SIZE_CONFIG[size]

  // ── Spinner + label ────────────────────────
  // Bloc réutilisé dans les deux modes (inline et fullPage)
  const spinner = (
    <div style={{ textAlign: "center" }}>

      {/* ── Spinner SVG animé ──────────────────
          Deux éléments superposés :
          - un cercle gris complet (piste)
          - un arc bleu qui tourne (indicateur) */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 36 36"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }} // rotation continue
      >
        {/* Cercle de fond — piste grise fixe */}
        <circle
          cx="18" cy="18" r="15"
          stroke={colors.border}   // gris clair selon le theme
          strokeWidth="3"
        />

        {/* Arc animé — indicateur de chargement */}
        <path
          d="M18 3 a15 15 0 0 1 15 15"  // quart de cercle en haut à droite
          stroke={colors.primary}         // bleu selon le theme
          strokeWidth="3"
          strokeLinecap="round"           // extrémité arrondie
        />
      </svg>

      {/* ── Label optionnel ────────────────────
          Affiché sous le spinner si fourni     */}
      {label && (
        <p
          style={{
            marginTop:  spacing[3],              // 12px — espace entre spinner et texte
            fontSize:   theme.fontSize.sm,       // taille depuis typography.ts
            color:      colors.textSecondary,    // gris selon le theme
            fontWeight: theme.fontWeight.medium, // poids depuis typography.ts
          }}
        >
          {label}
        </p>
      )}

      {/* ── Keyframe CSS ───────────────────────
          Injecté une seule fois dans le DOM
          Définit l'animation de rotation 360°  */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )

  // ── Mode fullPage ──────────────────────────
  // Overlay qui couvre tout l'écran
  // utilisé pendant un chargement global (ex: login)
  if (fullPage) {
    return (
      <div
        style={{
          position:        "fixed",
          inset:           0,         // couvre top/right/bottom/left = 0
          // Fond semi-transparent selon le theme (blanc light / sombre dark)
          backgroundColor: colors.bgApp + "cc", // "cc" = 80% opacité en hex
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          zIndex:          9999,      // au dessus de tout le reste
        }}
      >
        {spinner}
      </div>
    )
  }

  // ── Mode inline ────────────────────────────
  // Affiché directement dans le flux de la page
  return spinner
}