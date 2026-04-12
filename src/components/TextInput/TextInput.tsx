// src/components/TextInput/TextInput.tsx

import React from "react"

type InputType = "text" | "email" | "password" | "number" | "search"

// ── Type exporté pour pouvoir l'utiliser ailleurs ─
// onChange accepte un ChangeEvent natif React
// → compatible avec react-hook-form register()
// → compatible avec un onChange manuel aussi
export interface TextInputProps {
  label?:       string
  placeholder?: string
  value?:       string
  onChange?:    React.ChangeEventHandler<HTMLInputElement>
  onBlur?:      React.FocusEventHandler<HTMLInputElement>
  name?:        string
  type?:        InputType
  disabled?:    boolean
  error?:       string
  icon?:        React.ReactNode
  fullWidth?:   boolean
  min?:         string | number
  max?:         string | number
}

export default function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  type      = "text",
  disabled  = false,
  error,
  icon,
  fullWidth = false,
  min,
  max,
}: TextInputProps) {
  return (
    <div style={{ width: fullWidth ? "100%" : "auto" }}>

      {/* ── Label ── */}
      {label && (
        <label style={styles.label}>{label}</label>
      )}

      {/* ── Input + Icône ── */}
      <div style={styles.inputWrapper}>
        {icon && (
          <span style={styles.iconLeft}>{icon}</span>
        )}
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
            ...styles.input,
            paddingLeft:  icon ? "38px" : "12px",
            borderColor:  error ? "#dc2626" : "#e5e7eb",
            opacity:      disabled ? 0.5 : 1,
            cursor:       disabled ? "not-allowed" : "text",
          }}
        />
      </div>

      {/* ── Message d'erreur ── */}
      {error && (
        <p style={styles.error}>{error}</p>
      )}

    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  label: {
    display:      "block",
    fontSize:     "13px",
    fontWeight:   "600",
    color:        "#374151",
    marginBottom: "6px",
  },
  inputWrapper: {
    position: "relative",
  },
  iconLeft: {
    position:   "absolute",
    left:       "12px",
    top:        "50%",
    transform:  "translateY(-50%)",
    color:      "#9ca3af",
    display:    "flex",
    alignItems: "center",
  },
  input: {
    width:           "100%",
    padding:         "10px 12px",
    fontSize:        "14px",
    color:           "#111827",
    backgroundColor: "#ffffff",
    border:          "1px solid #e5e7eb",
    borderRadius:    "8px",
    outline:         "none",
    boxSizing:       "border-box",
    transition:      "border-color 0.15s",
  },
  error: {
    fontSize:  "12px",
    color:     "#dc2626",
    marginTop: "4px",
    margin:    "4px 0 0",
  },
}