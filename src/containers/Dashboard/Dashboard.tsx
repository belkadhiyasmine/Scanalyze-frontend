// ─────────────────────────────────────────────
//  containers/Dashboard/Dashboard.tsx
//  Page privée — Parent Component
//  Rôle : afficher un résumé global des statistiques
//         et visualiser les documents récents
//  Composants enfants utilisés :
//  → Sidebar     : navigation latérale
//  → MetricCard  : cartes de statistiques (x4)
//  → StatusBadge : badge coloré de statut
//  → Button      : boutons d'action
//  → Loader      : spinner de chargement
//  Hooks utilisés :
//  → useState    : état local (menu actif, docs visibles)
//  → useNavigate : navigation entre pages
//  → useTheme    : accès au theme actif (light/dark)
// ─────────────────────────────────────────────

import { useState }         from "react"
import { useNavigate }      from "react-router-dom"
import { useTheme }         from "../../themes/ThemeContext"  // ← theme light/dark

// ── Composants enfants ────────────────────────
import Sidebar      from "../../components/Sidebar/Sidebar"
import MetricCard   from "../../components/MetricCard/MetricCard"
import StatusBadge  from "../../components/StatusBadge/StatusBadge"
import Button       from "../../components/Button/Button"

// ── Navigation + Types ────────────────────────
import { ROUTES }                    from "../../navigation/routes"
import { Document, DashboardStats }  from "../../types"

// ─────────────────────────────────────────────
//  DONNÉES FICTIVES — à remplacer par appel API
//  Ces données simulent ce que le backend retourne
// ─────────────────────────────────────────────

// Statistiques globales du dashboard
const STATS: DashboardStats = {
  totalDocs:   12450,  // nombre total de documents traités
  successRate: 98.2,   // taux de succès en %
  failureRate: 1.8,    // taux d'échec en %
  avgProcTime: 4.2,    // temps moyen de traitement en secondes
}

// Liste des documents récents
const RECENT_DOCS: Document[] = [
  { id: "DOC-001", name: "Invoice_001.pdf",   status: "Success",    date: "Oct 24, 2023, 14:20" },
  { id: "DOC-002", name: "Invoice_002.pdf",   status: "Processing", date: "Oct 24, 2023, 14:22" },
  { id: "DOC-003", name: "Receipt_44.jpg",    status: "Error",      date: "Oct 24, 2023, 14:25" },
  { id: "DOC-004", name: "Tax_Doc_Final.pdf", status: "Success",    date: "Oct 24, 2023, 14:35" },
]

// ─────────────────────────────────────────────
export default function Dashboard() {
  const navigate    = useNavigate()
  const { theme }   = useTheme()   // accès au theme actif (couleurs, spacing, etc.)

  // ── États locaux ──────────────────────────
  // activeMenu  → quel item de la Sidebar est surligné
  // docsVisible → combien de lignes afficher dans le tableau
  const [activeMenu,   setActiveMenu]   = useState<string>("dashboard")
  const [docsVisible,  setDocsVisible]  = useState<number>(4)

  // ── Configuration des MetricCards ─────────
  // Tableau d'objets — chaque objet = une carte
  // Avantage : ajouter une carte = ajouter un objet
  const metricCards = [
    {
      label:   "TOTAL DOCS",
      value:   STATS.totalDocs.toLocaleString(),  // "12,450"
      trend:   "+12.5%",
      trendUp: true,                               // vert ↑
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
    },
    {
      label:   "SUCCESS RATE",
      value:   `${STATS.successRate}%`,
      trend:   "+0.3%",
      trendUp: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.success}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
    },
    {
      label:   "FAILURE RATE",
      value:   `${STATS.failureRate}%`,
      trend:   "-0.5%",
      trendUp: false,                              // rouge ↓
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.error}>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      ),
    },
    {
      label:   "AVG PROC TIME",
      value:   `${STATS.avgProcTime}s`,
      trend:   "+1.1s",
      trendUp: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={theme.colors.primary}>
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
        </svg>
      ),
    },
  ]

  // ── Rendu ─────────────────────────────────
  return (

    // Layout principal — Sidebar à gauche + contenu à droite
    <div style={{
      display:         "flex",
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",   // ← CSS Variable theme
      fontFamily:      "var(--font-primary)",   // ← Inter
    }}>

      {/* ── Composant enfant : Sidebar ────────
          activeMenu  → quel item est surligné
          onMenuClick → met à jour activeMenu   */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(menu: string) => setActiveMenu(menu)}
      />

      {/* ── Contenu principal ── */}
      <main style={{
        flex:      1,
        padding:   `${theme.spacing[6]} ${theme.spacing[8]}`,
        overflowY: "auto",
      }}>

        {/* ── Breadcrumb ── */}
        {/* Indique à l'user où il se trouve dans l'app */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          gap:          theme.spacing[1],
          marginBottom: theme.spacing[4],
          fontSize:     theme.fontSize.sm,
          color:        "var(--color-text-secondary)",
        }}>
          <span>🏠 Home</span>
          <span style={{ color: "var(--color-border-strong)" }}>›</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: theme.fontWeight.medium }}>
            Analytics Dashboard
          </span>
        </div>

        {/* ── En-tête de page ── */}
        <div style={{
          display:        "flex",
          justifyContent: "space-between",
          alignItems:     "flex-start",
          marginBottom:   theme.spacing[6],
        }}>
          <div>
            {/* Titre principal */}
            <h1 style={{
              fontSize:   theme.fontSize.xxl,
              fontWeight: theme.fontWeight.bold,
              color:      "var(--color-text-primary)",
              margin:     `0 0 ${theme.spacing[1]}`,
            }}>
              Analytics Overview
            </h1>
            {/* Sous-titre */}
            <p style={{
              fontSize: theme.fontSize.md,
              color:    "var(--color-text-secondary)",
              margin:   0,
            }}>
              Track and monitor your document processing efficiency.
            </p>
          </div>

          {/* Bouton filtre — Button remplace <button> natif */}
          <Button
            label="📅 Last 30 Days"
            variant="ghost"
            size="sm"
            onClick={() => {}}
          />
        </div>

        {/* ── Grille des MetricCards ────────────
            4 colonnes — chaque colonne = 1 MetricCard
            .map() → itère le tableau metricCards
            et retourne un composant MetricCard par item  */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "repeat(4, 1fr)",  // 4 colonnes égales
          gap:                 theme.spacing[4],
          marginBottom:        theme.spacing[7],
        }}>
          {metricCards.map((card, index) => (
            // MetricCard reçoit toutes ses données via props
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

        {/* ── Section tableau Recent Documents ── */}
        <div style={{
          backgroundColor: "var(--color-bg-surface)",
          borderRadius:    theme.radius.lg,
          border:          "1px solid var(--color-border)",
          overflow:        "hidden",
        }}>

          {/* Header du tableau */}
          <div style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            padding:        `${theme.spacing[4]} ${theme.spacing[5]}`,
            borderBottom:   "1px solid var(--color-border)",
          }}>
            <h2 style={{
              fontSize:   theme.fontSize.lg,
              fontWeight: theme.fontWeight.semibold,
              color:      "var(--color-text-primary)",
              margin:     0,
            }}>
              Recent Documents
            </h2>

            {/* Bouton "View All" → navigue vers Upload */}
            <Button
              label="View All"
              variant="ghost"
              size="sm"
              onClick={() => navigate(ROUTES.UPLOAD)}
            />
          </div>

          {/* ── En-tête des colonnes ── */}
          <div style={{
            display:         "flex",
            padding:         `${theme.spacing[2]} ${theme.spacing[5]}`,
            backgroundColor: "var(--color-bg-app)",
            borderBottom:    "1px solid var(--color-border)",
          }}>
            {/* Chaque colonne a un flex pour définir sa largeur relative */}
            <span style={{ ...colStyle(theme), flex: 1 }}>ID</span>
            <span style={{ ...colStyle(theme), flex: 3 }}>Name</span>
            <span style={{ ...colStyle(theme), flex: 2 }}>Status</span>
            <span style={{ ...colStyle(theme), flex: 2 }}>Date</span>
            <span style={{ ...colStyle(theme), flex: 1, justifyContent: "flex-end" }}>Action</span>
          </div>

          {/* ── Lignes du tableau ─────────────────
              slice(0, docsVisible) → affiche seulement N docs
              index % 2 → alternance de couleur de fond (zebrastripe) */}
          {RECENT_DOCS.slice(0, docsVisible).map((doc, index) => (
            <div
              key={doc.id}
              style={{
                display:         "flex",
                padding:         `${theme.spacing[3]} ${theme.spacing[5]}`,
                borderBottom:    "1px solid var(--color-border)",
                alignItems:      "center",
                // Alternance : lignes paires → surface / impaires → bg-app
                backgroundColor: index % 2 === 0
                  ? "var(--color-bg-surface)"
                  : "var(--color-bg-app)",
              }}
            >
              {/* ID du document */}
              <span style={{ ...colStyle(theme), flex: 1, color: "var(--color-text-secondary)", fontSize: theme.fontSize.sm }}>
                {doc.id}
              </span>

              {/* Nom du fichier avec icône */}
              <span style={{ ...colStyle(theme), flex: 3 }}>
                <span style={{ marginRight: theme.spacing[2] }}>📄</span>
                {doc.name}
              </span>

              {/* StatusBadge — composant enfant qui colore selon le statut */}
              <span style={{ ...colStyle(theme), flex: 2 }}>
                <StatusBadge status={doc.status} />
              </span>

              {/* Date */}
              <span style={{ ...colStyle(theme), flex: 2, color: "var(--color-text-secondary)", fontSize: theme.fontSize.sm }}>
                {doc.date}
              </span>

              {/* Bouton action ⋮ */}
              <span style={{ ...colStyle(theme), flex: 1, justifyContent: "flex-end" }}>
                <button
                  onClick={() => alert(`Actions pour ${doc.name}`)}
                  style={{
                    background:   "none",
                    border:       "none",
                    cursor:       "pointer",
                    fontSize:     "18px",
                    color:        "var(--color-text-secondary)",
                    padding:      `${theme.spacing[1]} ${theme.spacing[2]}`,
                    borderRadius: theme.radius.sm,
                  }}
                >
                  ⋮
                </button>
              </span>
            </div>
          ))}

          {/* ── Load More ──────────────────────
              Augmente docsVisible de 4 à chaque clic
              prev → valeur précédente du state        */}
          <div style={{
            display:        "flex",
            justifyContent: "center",
            padding:        theme.spacing[3],
            borderTop:      "1px solid var(--color-border)",
          }}>
            <Button
              label="Load More ∨"
              variant="ghost"
              size="sm"
              onClick={() => setDocsVisible((prev) => prev + 4)}
            />
          </div>

        </div>
      </main>
    </div>
  )
}

// ── Helper — styles des colonnes du tableau ───
// Fonction utilitaire pour éviter la répétition
const colStyle = (theme: any): React.CSSProperties => ({
  fontSize:   theme.fontSize.sm,
  fontWeight: theme.fontWeight.medium,
  color:      "var(--color-text-primary)",
  display:    "flex",
  alignItems: "center",
})
