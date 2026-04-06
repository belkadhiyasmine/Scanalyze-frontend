// ─────────────────────────────────────────────
//  pages/DataExport/DataExport.tsx
//  Page privée — Parent Component
//  Permet à l'utilisateur d'exporter les données
//  extraites dans différents formats
//  Utilise : Sidebar
// ─────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ROUTES } from "../../navigation/routes";
import { ExportFormat } from "../../types";

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
    { description: "Shipping & Handling", qty: 1, price: 45.0,  total: 45.0  },
    { description: "Express Delivery Fee", qty: 1, price: 12.5, total: 12.5  },
  ],
  validation_status: "approved",
  exported_by:       "user_admin",
};

// ─────────────────────────────────────────────
export default function DataExport() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [activeMenu, setActiveMenu]       = useState<string>("export");
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("JSON");
  const [isExporting, setIsExporting]     = useState<boolean>(false);
  const [exported, setExported]           = useState<boolean>(false);

  // ── Génère le contenu selon le format ────────
  const getPreviewContent = (): string => {
    if (selectedFormat === "JSON") {
      return JSON.stringify(EXPORT_PREVIEW, null, 2);
    }
    if (selectedFormat === "CSV") {
      const headers = "document_id,vendor_name,invoice_number,invoice_date,currency,total";
      const values  = `${EXPORT_PREVIEW.document_id},${EXPORT_PREVIEW.vendor_name},${EXPORT_PREVIEW.invoice_number},${EXPORT_PREVIEW.invoice_date},${EXPORT_PREVIEW.currency},${EXPORT_PREVIEW.total}`;
      return `${headers}\n${values}`;
    }
    // XML
    return `<?xml version="1.0" encoding="UTF-8"?>
<invoice>
  <document_id>${EXPORT_PREVIEW.document_id}</document_id>
  <vendor_name>${EXPORT_PREVIEW.vendor_name}</vendor_name>
  <invoice_number>${EXPORT_PREVIEW.invoice_number}</invoice_number>
  <invoice_date>${EXPORT_PREVIEW.invoice_date}</invoice_date>
  <currency>${EXPORT_PREVIEW.currency}</currency>
  <total>${EXPORT_PREVIEW.total}</total>
</invoice>`;
  };

  // ── Export ────────────────────────────────────
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // TODO : remplacer par votre vrai appel API
      // await axios.post("/api/documents/export", {
      //   documentId: EXPORT_PREVIEW.document_id,
      //   format: selectedFormat
      // });

      await new Promise((res) => setTimeout(res, 1200));

      // Téléchargement simulé
      const blob = new Blob([getPreviewContent()], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${EXPORT_PREVIEW.document_id}.${selectedFormat.toLowerCase()}`;
      a.click();
      URL.revokeObjectURL(url);

      setExported(true);
    } catch (err) {
      alert("Erreur lors de l'export. Réessayez.");
    } finally {
      setIsExporting(false);
    }
  };

  // ── Nouveau document ──────────────────────────
  const handleNewDocument = () => {
    navigate(ROUTES.UPLOAD);
  };

  // ── Rendu ─────────────────────────────────────
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
          <span style={styles.current}>Data Export</span>
        </div>

        {/* Titre */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>DATA EXPORT</h1>
            <p style={styles.pageSubtitle}>
              Export your extracted document data in your preferred format.
            </p>
          </div>
          {exported && (
            <div style={styles.successBadge}>
              ✅ Export successful !
            </div>
          )}
        </div>

        {/* ── Layout 2 colonnes ── */}
        <div style={styles.twoColumns}>

          {/* ── Colonne gauche : Résumé document ── */}
          <div style={styles.leftCol}>
            <h2 style={styles.colTitle}>📋 Document Summary</h2>

            <div style={styles.summaryCard}>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Document ID</span>
                <span style={styles.summaryValue}>{EXPORT_PREVIEW.document_id}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Vendor</span>
                <span style={styles.summaryValue}>{EXPORT_PREVIEW.vendor_name}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Invoice #</span>
                <span style={styles.summaryValue}>{EXPORT_PREVIEW.invoice_number}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Date</span>
                <span style={styles.summaryValue}>{EXPORT_PREVIEW.invoice_date}</span>
              </div>
              <div style={styles.summaryRow}>
                <span style={styles.summaryLabel}>Currency</span>
                <span style={styles.summaryValue}>{EXPORT_PREVIEW.currency}</span>
              </div>
              <div style={{ ...styles.summaryRow, ...styles.summaryTotal }}>
                <span style={styles.summaryTotalLabel}>Total Amount</span>
                <span style={styles.summaryTotalValue}>
                  ${EXPORT_PREVIEW.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Status */}
            <div style={styles.statusBox}>
              <span style={styles.statusDot} />
              <span style={styles.statusText}>
                Validation status : <strong>Approved</strong>
              </span>
            </div>

            {/* Format selector */}
            <div style={styles.formatSection}>
              <p style={styles.formatLabel}>SELECT EXPORT FORMAT</p>
              <div style={styles.formatButtons}>
                {(["JSON", "CSV", "XML"] as ExportFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    style={{
                      ...styles.formatBtn,
                      backgroundColor:
                        selectedFormat === fmt ? "#1a3a8f" : "#ffffff",
                      color:
                        selectedFormat === fmt ? "#ffffff" : "#374151",
                      borderColor:
                        selectedFormat === fmt ? "#1a3a8f" : "#e5e7eb",
                    }}
                    onClick={() => setSelectedFormat(fmt)}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Boutons action */}
            <div style={styles.actionButtons}>
              <button
                style={{
                  ...styles.exportBtn,
                  opacity: isExporting ? 0.7 : 1,
                  cursor: isExporting ? "not-allowed" : "pointer",
                }}
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? "Exporting..." : `⬇ Export as ${selectedFormat}`}
              </button>
              <button
                style={styles.newDocBtn}
                onClick={handleNewDocument}
              >
                + New Document
              </button>
            </div>
          </div>

          {/* ── Colonne droite : Preview ── */}
          <div style={styles.rightCol}>
            <div style={styles.previewHeader}>
              <h2 style={styles.colTitle}>
                <span style={styles.codeIcon}>&lt;/&gt;</span>
                Preview — {selectedFormat}
              </h2>
            </div>
            <div style={styles.previewBox}>
              <pre style={styles.previewContent}>
                {getPreviewContent()}
              </pre>
            </div>
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
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "16px",
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
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827",
    margin: "0 0 6px",
    letterSpacing: "0.5px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  successBadge: {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: "600",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "20px",
  },
  leftCol: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  rightCol: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  colTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  codeIcon: {
    fontSize: "13px",
    color: "#6b7280",
    fontFamily: "monospace",
  },
  summaryCard: {
    border: "1px solid #f3f4f6",
    borderRadius: "8px",
    overflow: "hidden",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    borderBottom: "1px solid #f9fafb",
  },
  summaryLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#111827",
  },
  summaryTotal: {
    backgroundColor: "#f9fafb",
    borderBottom: "none",
  },
  summaryTotalLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#111827",
  },
  summaryTotalValue: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1a3a8f",
  },
  statusBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    flexShrink: 0,
  },
  statusText: {
    fontSize: "13px",
    color: "#15803d",
  },
  formatSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  formatLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: "0.8px",
    margin: 0,
  },
  formatButtons: {
    display: "flex",
    gap: "8px",
  },
  formatBtn: {
    flex: 1,
    padding: "10px",
    border: "1.5px solid",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.15s",
    letterSpacing: "0.5px",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "4px",
  },
  exportBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
  newDocBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#ffffff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  previewHeader: {
    marginBottom: "8px",
  },
  previewBox: {
    flex: 1,
    backgroundColor: "#1e1e2e",
    borderRadius: "8px",
    padding: "16px",
    overflow: "auto",
    minHeight: "400px",
  },
  previewContent: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "1.7",
    fontFamily: "'Courier New', monospace",
    color: "#cdd6f4",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};