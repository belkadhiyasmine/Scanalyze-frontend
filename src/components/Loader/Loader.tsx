// src/components/Loader/Loader.tsx

type LoaderSize = "sm" | "md" | "lg"

interface LoaderProps {
  size?:    LoaderSize
  fullPage?: boolean
  label?:   string
}

const SIZE_CONFIG: Record<LoaderSize, number> = {
  sm: 20,
  md: 36,
  lg: 52,
}

export default function Loader({
  size     = "md",
  fullPage = false,
  label,
}: LoaderProps) {
  const dim = SIZE_CONFIG[size]

  const spinner = (
    <div style={{ textAlign: "center" }}>

      {/* ── Spinner SVG animé ── */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 36 36"
        fill="none"
        style={{ animation: "spin 0.8s linear infinite" }}
      >
        <circle
          cx="18" cy="18" r="15"
          stroke="#e5e7eb"
          strokeWidth="3"
        />
        <path
          d="M18 3 a15 15 0 0 1 15 15"
          stroke="#1a3a8f"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {/* ── Label optionnel ── */}
      {label && (
        <p style={styles.label}>{label}</p>
      )}

      {/* ── Keyframe CSS injecté ── */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
      `}</style>

    </div>
  )

  if (fullPage) {
    return <div style={styles.fullPage}>{spinner}</div>
  }

  return spinner
}

const styles: { [key: string]: React.CSSProperties } = {
  fullPage: {
    position:       "fixed",
    inset:          0,
    backgroundColor: "rgba(255,255,255,0.8)",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    zIndex:         9999,
  },
  label: {
    marginTop:  "12px",
    fontSize:   "14px",
    color:      "#6b7280",
    fontWeight: "500",
  },
}