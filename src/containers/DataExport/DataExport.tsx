// ─────────────────────────────────────────────
//  containers/DataExport/DataExport.tsx
//  Page privée — Parent Component
//  Rôle : exporter les données extraites
//         en JSON, CSV ou XML
//  Composants enfants :
//  → Sidebar : navigation
//  → Button  : boutons export + nouveau doc
//  → Loader  : spinner pendant l'export
//  Hooks :
//  → useState  : format sélectionné, état export
//  → useTheme  : theme actif
// ─────────────────────────────────────────────

import { useState }     from "react"
import { useNavigate }  from "react-router-dom"
import { useTheme }     from "../../themes/ThemeContext"

// ── Composants ────────────────────────────────
import Sidebar  from "../../components/Sidebar/Sidebar"
import Button   from "../../components/Button/Button"
import Loader   from "../../components/Loader/Loader"

// ── Navigation + Types ────────────────────────
import { ROUTES }        from "../../navigation/routes"
import { ExportFormat }  from "../../types"

// ── Données fictives (à remplacer par API) ────
const EXPORT_PREVIEW = {
  document_id:    "Invoice_X182",
  vendor_name:    "Global Logistics Inc.",
  invoice_number: "INV-2023-094",
  invoice_date:   "2023-10-14",
  currency:       "USD",
  subtotal:       57.5,
  tax:            0,
  total:          57.5,
  line_items: [
    { description: "Shipping & Handling",  qty: 1, price: 45.0, total: 45.0 },
    { description: "Express Delivery Fee", qty: 1, price: 12.5, total: 12.5 },
  ],
  validation_status: "approved",
  exported_by:       "user_admin",
}

// ─────────────────────────────────────────────
export default function DataExport() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  // ── États ────────────────────────────────────
  const [activeMenu,      setActiveMenu]      = useState<string>("export")
  const [selectedFormat,  setSelectedFormat]  = useState<ExportFormat>("JSON")
  const [isExporting,     setIsExporting]     = useState<boolean>(false)
  const [exported,        setExported]        = useState<boolean>(false)  // succès export

  // ── Génère le contenu selon le format ────────
  // Appelé à chaque changement de format
  const getPreviewContent = (): string => {
    if (selectedFormat === "JSON") {
      return JSON.stringify(EXPORT_PREVIEW, null, 2)  // JSON indenté
    }
    if (selectedFormat === "CSV") {
      // Format CSV : headers + valeurs séparées par virgules
      const headers = "document_id,vendor_name,invoice_number,invoice_date,currency,total"
      const values  = `${EXPORT_PREVIEW.document_id},${EXPORT_PREVIEW.vendor_name},${EXPORT_PREVIEW.invoice_number},${EXPORT_PREVIEW.invoice_date},${EXPORT_PREVIEW.currency},${EXPORT_PREVIEW.total}`
      return `${headers}\n${values}`
    }
    // XML — balises autour de chaque valeur
    return `<?xml version="1.0" encoding="UTF-8"?>
<invoice>
  <document_id>${EXPORT_PREVIEW.document_id}</document_id>
  <vendor_name>${EXPORT_PREVIEW.vendor_name}</vendor_name>
  <invoice_number>${EXPORT_PREVIEW.invoice_number}</invoice_number>
  <invoice_date>${EXPORT_PREVIEW.invoice_date}</invoice_date>
  <currency>${EXPORT_PREVIEW.currency}</currency>
  <total>${EXPORT_PREVIEW.total}</total>
</invoice>`
  }

  // ── Export → téléchargement fichier ──────────
  const handleExport = async () => {
    setIsExporting(true)
    try {
      // TODO : remplacer par le vrai appel API
      // await axios.post("/api/documents/export", { documentId: EXPORT_PREVIEW.document_id, format: selectedFormat })

      await new Promise((res) => setTimeout(res, 1200))

      // Crée un lien de téléchargement temporaire
      const blob = new Blob([getPreviewContent()], { type: "text/plain" })
      const url  = URL.createObjectURL(blob)       // crée une URL temporaire
      const a    = document.createElement("a")     // crée un lien <a>
      a.href     = url
      a.download = `${EXPORT_PREVIEW.document_id}.${selectedFormat.toLowerCase()}`
      a.click()                                    // déclenche le téléchargement
      URL.revokeObjectURL(url)                     // libère la mémoire

      setExported(true)   // affiche le badge de succès
    } catch {
      alert("Erreur lors de l'export. Réessayez.")
    } finally {
      setIsExporting(false)
    }
  }

  // ── Rendu ─────────────────────────────────────
  return (
    <div style={{
      display:         "flex",
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",
      fontFamily:      "var(--font-primary)",
    }}>

      {/* ── Loader pleine page pendant l'export ── */}
      {isExporting && <Loader fullPage label="Export en cours..." />}

      {/* ── Sidebar ── */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(menu: string) => setActiveMenu(menu)}
      />

      {/* ── Contenu principal ── */}
      <main style={{ flex: 1, padding: `${theme.spacing[6]} ${theme.spacing[8]}` }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[1], fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)", marginBottom: theme.spacing[4] }}>
          <span>🏠 Home</span>
          <span style={{ color: "var(--color-border-strong)" }}>›</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: theme.fontWeight.medium }}>Data Export</span>
        </div>

        {/* En-tête + badge succès */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: theme.spacing[6] }}>
          <div>
            <h1 style={{ fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.extrabold, color: "var(--color-text-primary)", margin: `0 0 ${theme.spacing[1]}`, letterSpacing: theme.letterSpacing.wide }}>
              DATA EXPORT
            </h1>
            <p style={{ fontSize: theme.fontSize.md, color: "var(--color-text-secondary)", margin: 0 }}>
              Export your extracted document data in your preferred format.
            </p>
          </div>

          {/* Badge succès — affiché après export réussi */}
          {exported && (
            <div style={{
              backgroundColor: "var(--color-success-bg)",
              border:          `1px solid var(--color-success)`,
              color:           "var(--color-success)",
              borderRadius:    theme.radius.md,
              padding:         `${theme.spacing[2]} ${theme.spacing[4]}`,
              fontSize:        theme.fontSize.sm,
              fontWeight:      theme.fontWeight.semibold,
            }}>
              ✅ Export successful !
            </div>
          )}
        </div>

        {/* ── Layout 2 colonnes ── */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1.4fr",   // colonne droite plus large
          gap:                 theme.spacing[5],
        }}>

          {/* ════════════════════════════════
               COLONNE GAUCHE
               Résumé document + format + boutons
              ════════════════════════════════ */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[5],
            display:         "flex",
            flexDirection:   "column",
            gap:             theme.spacing[4],
          }}>
            <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)", margin: 0 }}>
              📋 Document Summary
            </h2>

            {/* Tableau résumé */}
            <div style={{ border: "1px solid var(--color-border)", borderRadius: theme.radius.md, overflow: "hidden" }}>
              {[
                { label: "Document ID",  value: EXPORT_PREVIEW.document_id    },
                { label: "Vendor",       value: EXPORT_PREVIEW.vendor_name    },
                { label: "Invoice #",    value: EXPORT_PREVIEW.invoice_number },
                { label: "Date",         value: EXPORT_PREVIEW.invoice_date   },
                { label: "Currency",     value: EXPORT_PREVIEW.currency       },
              ].map((row, i) => (
                // .map() → génère les lignes dynamiquement
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${theme.spacing[2]} ${theme.spacing[3]}`, borderBottom: "1px solid var(--color-border)" }}>
                  <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)" }}>{row.label}</span>
                  <span style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: "var(--color-text-primary)" }}>{row.value}</span>
                </div>
              ))}
              {/* Ligne Total — style spécial */}
              <div style={{ display: "flex", justifyContent: "space-between", padding: `${theme.spacing[2]} ${theme.spacing[3]}`, backgroundColor: "var(--color-bg-app)" }}>
                <span style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)" }}>Total Amount</span>
                <span style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: theme.colors.primary }}>${EXPORT_PREVIEW.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Badge statut Approved */}
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2], backgroundColor: "var(--color-success-bg)", border: "1px solid var(--color-success)", borderRadius: theme.radius.md, padding: `${theme.spacing[2]} ${theme.spacing[3]}` }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--color-success)", flexShrink: 0 }} />
              <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-success)" }}>
                Validation status : <strong>Approved</strong>
              </span>
            </div>

            {/* Sélecteur de format ────────────────
                3 boutons — celui sélectionné → fond bleu
                onClick → met à jour selectedFormat     */}
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[2] }}>
              <p style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.bold, color: "var(--color-text-secondary)", letterSpacing: theme.letterSpacing.wider, margin: 0 }}>
                SELECT EXPORT FORMAT
              </p>
              <div style={{ display: "flex", gap: theme.spacing[2] }}>
                {(["JSON", "CSV", "XML"] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      flex:            1,
                      padding:         theme.spacing[2],
                      border:          `1.5px solid ${selectedFormat === fmt ? theme.colors.primary : "var(--color-border)"}`,
                      borderRadius:    theme.radius.md,
                      fontSize:        theme.fontSize.sm,
                      fontWeight:      theme.fontWeight.semibold,
                      cursor:          "pointer",
                      letterSpacing:   theme.letterSpacing.wide,
                      // Couleurs dynamiques selon sélection
                      backgroundColor: selectedFormat === fmt ? theme.colors.primary : "var(--color-bg-surface)",
                      color:           selectedFormat === fmt ? "#ffffff" : "var(--color-text-primary)",
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[2] }}>
              {/* Export — Button remplace <button> natif */}
              <Button
                label={isExporting ? "Exporting..." : `⬇ Export as ${selectedFormat}`}
                variant="primary"
                size="md"
                fullWidth
                onClick={handleExport}
                disabled={isExporting}
              />
              {/* Nouveau document */}
              <Button
                label="+ New Document"
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => navigate(ROUTES.UPLOAD)}
              />
            </div>
          </div>

          {/* ════════════════════════════════
               COLONNE DROITE — Preview
               Contenu du fichier avant export
              ════════════════════════════════ */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[5],
            display:         "flex",
            flexDirection:   "column",
          }}>
            <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)", margin: `0 0 ${theme.spacing[2]}` }}>
              <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                &lt;/&gt;{" "}
              </span>
              Preview — {selectedFormat}
            </h2>

            {/* Bloc de prévisualisation — fond sombre type terminal */}
            <div style={{
              flex:            1,
              backgroundColor: "#1e1e2e",
              borderRadius:    theme.radius.md,
              padding:         theme.spacing[4],
              overflow:        "auto",
              minHeight:       "400px",
            }}>
              {/* pre → préserve l'indentation du JSON/CSV/XML */}
              <pre style={{
                margin:     0,
                fontSize:   theme.fontSize.sm,
                lineHeight: "1.7",
                fontFamily: "var(--font-mono)",
                color:      "#cdd6f4",
                whiteSpace: "pre-wrap",
                wordBreak:  "break-word",
              }}>
                {getPreviewContent()}
              </pre>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}