// ─────────────────────────────────────────────
//  components/StatusBadge/StatusBadge.tsx
//  Child Component — utilisé dans :
//  Dashboard (tableau), Verification
//  Affiche un badge coloré selon le statut
// ─────────────────────────────────────────────

import React from "react"
import { StatusBadgeProps } from "../../types"

// ── Couleurs selon le statut ──────────────────
const STATUS_CONFIG = {
  Success: {
    bg:    "#dcfce7",
    color: "#15803d",
    dot:   "#16a34a",
  },
  Processing: {
    bg:    "#eff6ff",
    color: "#1d4ed8",
    dot:   "#2563eb",
  },
  Error: {
    bg:    "#fef2f2",
    color: "#dc2626",
    dot:   "#ef4444",
  },
}

// StatusBadgeProps = "Success" | "Processing" | "Error"
// On l'enveloppe dans un objet Props pour pouvoir destructurer
type Props = {
  status: StatusBadgeProps
}

// ─────────────────────────────────────────────
export default function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      style={{
        ...styles.badge,
        backgroundColor: config.bg,
        color:           config.color,
      }}
    >
      {/* Point coloré */}
      <span
        style={{
          ...styles.dot,
          backgroundColor: config.dot,
        }}
      />
      {status}
    </span>
  )
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  badge: {
    display:     "inline-flex",
    alignItems:  "center",
    gap:         "6px",
    padding:     "4px 10px",
    borderRadius: "99px",
    fontSize:    "12px",
    fontWeight:  "500",
  },
  dot: {
    width:        "6px",
    height:       "6px",
    borderRadius: "50%",
    flexShrink:   0,
  },
}