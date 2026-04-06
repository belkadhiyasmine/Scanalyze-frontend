// ─────────────────────────────────────────────
//  pages/Dashboard/Dashboard.tsx
//  Page privée — Parent Component
//  affiche un resume global des statistiques 
//  visualiser les documents recents 
//  permettre la navigation vers d'autres actions 
//c'est une page parent (parent Component)
//  Utilise(composants enfants): Sidebar , MetricCard , StatusBadge 
// ─────────────────────────────────────────────

import { useState } from "react";   //permet de gerer l'eata local du composant utilise pour : menu actif , nombre de doc affichés 
import { useNavigate } from "react-router-dom";  // permet de changer des pages 
import Sidebar from "../../components/Sidebar/Sidebar";  //menu lateral
import MetricCard from "../../components/MetricCard/MetricCard";  //cartes statiques 
import StatusBadge from "../../components/StatusBadge/StatusBadge";  //affichages de status (Succeess , Error)
import { ROUTES } from "../../navigation/routes";  //centralisation des chemins 
import { Document, DashboardStats } from "../../types";  //typages TypeScript (securite + clarté)

// ── Données fictives (à remplacer par API) ────
const STATS: DashboardStats = {  //contient les statiques globales 
  totalDocs:    12450,   //total de documents 
  successRate:  98.2,    // taux de succés 
  failureRate:  1.8,    //taux déchec
  avgProcTime:  4.2,    //temps moyen
};

const RECENT_DOCS: Document[] = [   //liste des documents recents(un tableau dynamique)
  { id: "DOC-001", name: "Invoice_001.pdf",    status: "Success",    date: "Oct 24, 2023, 14:20" },
  { id: "DOC-002", name: "Invoice_002.pdf",    status: "Processing", date: "Oct 24, 2023, 14:22" },
  { id: "DOC-003", name: "Receipt_44.jpg",     status: "Error",      date: "Oct 24, 2023, 14:25" },
  { id: "DOC-004", name: "Tax_Doc_Final.pdf",  status: "Success",    date: "Oct 24, 2023, 14:35" },
];

// ─────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [activeMenu, setActiveMenu] = useState<string>("dashboard"); //gere quel menu est actif dans le sidbar 
  const [docsVisible, setDocsVisible] = useState<number>(4); //gere combien de documents sont affciés (initiallemnt 4 mais on peut augmenter )

  // ── Metric Cards data ─────────────────────────
  //  tableay contenant des cartes statistiques 
  const metricCards = [
    {
      label: "TOTAL DOCS",  //titre 
      value: STATS.totalDocs.toLocaleString(),  //valeur affiché
      trend: "+12.5%",  //evolution 
      trendUp: true,  //indique si la tendance est positive 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#1a3a8f">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
    },
    {
      label: "SUCCESS RATE",
      value: `${STATS.successRate}%`,
      trend: "+0.3%",
      trendUp: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#16a34a">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
    {
      label: "FAILURE RATE",
      value: `${STATS.failureRate}%`,
      trend: "-0.5%",
      trendUp: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#dc2626">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
    {
      label: "AVG PROC TIME",
      value: `${STATS.avgProcTime}s`,
      trend: "+1.1s",
      trendUp: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
      ),
    },
  ];

  // ── Rendu ─────────────────────────────────────
  //STRUCTURE DE RENDU(JSX)
  return (
    <div style={styles.layout}>

      {/* ── Child Component : Sidebar ── */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(menu: string) => setActiveMenu(menu)}
      />

      {/* ── Contenu principal ── */}
      <main style={styles.main}>

        {/* Breadcrumb */}
        <div style={styles.breadcrumb}>
          <span>🏠 Home</span>
          <span style={styles.sep}>›</span>
          <span style={styles.current}>Analytics Dashboard</span>
        </div>

        {/* En-tête */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Analytics Overview</h1>
            <p style={styles.pageSubtitle}>
              Track and monitor your document processing efficiency.
            </p>
          </div>
          <button style={styles.filterBtn}>📅 Last 30 Days</button>
        </div>

        {/* ── Child Components : 4 MetricCards ── */}
        <div style={styles.metricsGrid}>
          {metricCards.map((card, index) => (
            <MetricCard
              key={index}
              label={card.label}
              value={card.value}
              trend={card.trend}
              trendUp={card.trendUp}
              icon={card.icon}
            />
          ))}
        </div>

        {/* ── Tableau Recent Documents ── */}
        <div style={styles.tableSection}>

          {/* Header tableau */}
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Recent Documents</h2>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate(ROUTES.UPLOAD)}
            >
              View All
            </button>
          </div>

          {/* Colonnes */}
          <div style={styles.tableHead}>
            <span style={{ ...styles.col, flex: 1 }}>ID</span>
            <span style={{ ...styles.col, flex: 3 }}>Name</span>
            <span style={{ ...styles.col, flex: 2 }}>Status</span>
            <span style={{ ...styles.col, flex: 2 }}>Date</span>
            <span style={{ ...styles.col, flex: 1, textAlign: "right" }}>Action</span>
          </div>

          {/* Lignes */}
          {RECENT_DOCS.slice(0, docsVisible).map((doc, index) => (
            <div
              key={doc.id}
              style={{
                ...styles.tableRow,
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
              }}
            >
              <span style={{ ...styles.col, flex: 1, color: "#6b7280", fontSize: "13px" }}>
                {doc.id}
              </span>
              <span style={{ ...styles.col, flex: 3 }}>
                <span style={styles.fileIcon}>📄</span>
                {doc.name}
              </span>
              <span style={{ ...styles.col, flex: 2 }}>
                {/* ── Child Component : StatusBadge ── */}
                <StatusBadge status={doc.status} />
              </span>
              <span style={{ ...styles.col, flex: 2, color: "#6b7280", fontSize: "13px" }}>
                {doc.date}
              </span>
              <span style={{ ...styles.col, flex: 1, textAlign: "right" }}>
                <button
                  style={styles.actionBtn}
                  onClick={() => alert(`Actions pour ${doc.name}`)}
                >
                  ⋮
                </button>
              </span>
            </div>
          ))}

          {/* Load More */}
          <div style={styles.loadMoreContainer}>
            <button
              style={styles.loadMoreBtn}
              onClick={() => setDocsVisible((prev) => prev + 4)}
            >
              Load More ∨
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
  },
  main: {
    flex: 1,
    padding: "24px 32px",
    overflowY: "auto",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "16px",
    fontSize: "13px",
    color: "#6b7280",
  },
  sep: { color: "#9ca3af" },
  current: { color: "#374151", fontWeight: "500" },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  pageTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  filterBtn: {
    padding: "8px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    color: "#374151",
    cursor: "pointer",
    fontWeight: "500",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "28px",
  },
  tableSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid #f3f4f6",
  },
  tableTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  viewAllBtn: {
    background: "none",
    border: "none",
    color: "#1a3a8f",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  tableHead: {
    display: "flex",
    padding: "10px 20px",
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #f3f4f6",
  },
  col: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    display: "flex",
    alignItems: "center",
  },
  tableRow: {
    display: "flex",
    padding: "14px 20px",
    borderBottom: "1px solid #f3f4f6",
    alignItems: "center",
  },
  fileIcon: {
    marginRight: "8px",
    fontSize: "14px",
  },
  actionBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#6b7280",
    padding: "4px 8px",
    borderRadius: "4px",
  },
  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
    padding: "14px",
    borderTop: "1px solid #f3f4f6",
  },
  loadMoreBtn: {
    background: "none",
    border: "none",
    color: "#374151",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
};
