// src/components/Checkbox/Checkbox.tsx

interface CheckboxProps {
  label:     string
  checked:   boolean
  onChange:  (checked: boolean) => void
  disabled?: boolean
}

export default function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
}: CheckboxProps) {
  return (
    <label
      style={{
        ...styles.wrapper,
        opacity: disabled ? 0.5 : 1,
        cursor:  disabled ? "not-allowed" : "pointer",
      }}
    >
      {/* ── Case à cocher custom ── */}
      <div
        style={{
          ...styles.box,
          backgroundColor: checked ? "#1a3a8f" : "#ffffff",
          borderColor:     checked ? "#1a3a8f" : "#d1d5db",
        }}
        onClick={() => !disabled && onChange(!checked)}
      >
        {/* ── Checkmark ── */}
        {checked && (
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <path
              d="M1.5 5L4 7.5L8.5 2.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* ── Label ── */}
      <span style={styles.label}>{label}</span>

      {/* Input caché pour accessibilité */}
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

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display:    "inline-flex",
    alignItems: "center",
    gap:        "10px",
    userSelect: "none",
  },
  box: {
    width:          "18px",
    height:         "18px",
    borderRadius:   "4px",
    border:         "1.5px solid #d1d5db",
    display:        "flex",
    alignItems:     "center",
    justifyContent: "center",
    flexShrink:     0,
    transition:     "background 0.15s, border-color 0.15s",
  },
  label: {
    fontSize:   "14px",
    color:      "#374151",
    fontWeight: "500",
  },
}
