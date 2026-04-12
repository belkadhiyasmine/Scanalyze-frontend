// src/components/Button/Button.tsx

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost"
type ButtonSize    = "sm" | "md" | "lg"

interface ButtonProps {
  label:      string
  onClick?:   () => void
  variant?:   ButtonVariant
  size?:      ButtonSize
  disabled?:  boolean
  fullWidth?: boolean
  type?:      "button" | "submit" | "reset"
  icon?:      React.ReactNode
}

const VARIANT_CONFIG: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: "#1a3a8f",
    color:           "#ffffff",
    border:          "1px solid #1a3a8f",
  },
  secondary: {
    backgroundColor: "#ffffff",
    color:           "#1a3a8f",
    border:          "1px solid #1a3a8f",
  },
  danger: {
    backgroundColor: "#dc2626",
    color:           "#ffffff",
    border:          "1px solid #dc2626",
  },
  ghost: {
    backgroundColor: "transparent",
    color:           "#64748b",
    border:          "1px solid #e5e7eb",
  },
}

const SIZE_CONFIG: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: "6px 12px",  fontSize: "12px" },
  md: { padding: "10px 20px", fontSize: "14px" },
  lg: { padding: "14px 28px", fontSize: "16px" },
}

export default function Button({
  label,
  onClick,
  variant   = "primary",
  size      = "md",
  disabled  = false,
  fullWidth = false,
  type      = "button",
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        ...VARIANT_CONFIG[variant],
        ...SIZE_CONFIG[size],
        width:   fullWidth ? "100%" : "auto",
        opacity: disabled ? 0.5 : 1,
        cursor:  disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon && <span style={styles.icon}>{icon}</span>}
      {label}
    </button>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  base: {
    display:        "inline-flex",
    alignItems:     "center",
    justifyContent: "center",
    gap:            "8px",
    borderRadius:   "8px",
    fontWeight:     "600",
    transition:     "opacity 0.15s",
    outline:        "none",
    whiteSpace:     "nowrap",
  },
  icon: {
    display:    "flex",
    alignItems: "center",
  },
}