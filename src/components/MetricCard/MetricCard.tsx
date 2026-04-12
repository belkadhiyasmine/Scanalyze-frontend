// ─────────────────────────────────────────────
//  components/MetricCard/MetricCard.tsx
//  Child Component — utilisé 4 fois dans Dashboard
//  Affiche une métrique avec valeur et tendance
// ─────────────────────────────────────────────


interface MetricCardProps {
  label:   string
  value:   string
  trend:   string
  trendUp: boolean
  icon:    React.ReactNode
}


// ─────────────────────────────────────────────
export default function MetricCard({
  label,
  value,
  trend,
  trendUp,
  icon,
}: MetricCardProps) {
  return (
    <div style={styles.card}>

      {/* ── En-tête : label + icône ── */}
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        <span style={styles.icon}>{icon}</span>
      </div>

      {/* ── Valeur principale ── */}
      <p style={styles.value}>{value}</p>

      {/* ── Tendance colorée ── */}
      <p
        style={{
          ...styles.trend,
          color: trendUp ? "#16a34a" : "#dc2626",
        }}
      >
        {trendUp ? "↑" : "↓"} {trend}
      </p>

    </div>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  label: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#9ca3af",
    letterSpacing: "0.5px",
  },
  icon: {
    display: "flex",
    alignItems: "center",
  },
  value: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 6px",
  },
  trend: {
    fontSize: "13px",
    fontWeight: "500",
    margin: 0,
  },
};
