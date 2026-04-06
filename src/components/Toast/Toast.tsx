// ─────────────────────────────────────────────
//  components/Toast/Toast.tsx
//  Child Component — utilisé dans :
//  Upload, DataExport
//  Affiche une notification en bas à droite
// ─────────────────────────────────────────────

import { ToastProps } from "../../types";

// ─────────────────────────────────────────────
export default function Toast({ message, onClose }: ToastProps) {
  return (
    <div style={styles.toast}>

      {/* ── Icône succès ── */}
      <div style={styles.iconBox}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#16a34a">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* ── Message ── */}
      <p style={styles.message}>{message}</p>

      {/* ── Bouton fermer ── */}
      <button style={styles.closeBtn} onClick={onClose}>
        ✕
      </button>

    </div>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
    maxWidth: "320px",
    zIndex: 1000,
  },
  iconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#dcfce7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  message: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#111827",
    margin: 0,
    flex: 1,
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "14px",
    padding: "0",
    flexShrink: 0,
  },
};
