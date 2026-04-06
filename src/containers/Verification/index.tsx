// ─────────────────────────────────────────────
//  pages/Verification/Verification.tsx
//  Page privée — Parent Component
//  Utilise : StatusBadge
// ─────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../navigation/routes";
import { LineItem } from "../../types";

// ── Données initiales (à remplacer par API) ───
const INITIAL_LINE_ITEMS: LineItem[] = [
  { id: 1, description: "Shipping & Handling", qty: 1, price: 45.0  },
  { id: 2, description: "Express Delivery Fee", qty: 1, price: 12.5 },
];

const CURRENCIES = [
  "USD - US Dollar",
  "EUR - Euro",
  "GBP - British Pound",
  "TND - Tunisian Dinar",
];

// ─────────────────────────────────────────────
export default function Verification() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [vendorName, setVendorName]       = useState<string>("Global Logistics Inc.");
  const [invoiceDate, setInvoiceDate]     = useState<string>("2023-10-14");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2023-094");
  const [currency, setCurrency]           = useState<string>("USD - US Dollar");
  const [lineItems, setLineItems]         = useState<LineItem[]>(INITIAL_LINE_ITEMS);
  const [dateFixed, setDateFixed]         = useState<boolean>(false);
  const [isApproving, setIsApproving]     = useState<boolean>(false);

  // ── Calculs ───────────────────────────────────
  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.qty * item.price, 0
  );
  const tax   = 0;
  const total = subtotal + tax;

  // ── Modifier une ligne ────────────────────────
  const updateLineItem = (
    id: number,
    field: keyof LineItem,
    value: string
  ) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "qty" || field === "price"
                  ? parseFloat(value) || 0
                  : value,
            }
          : item
      )
    );
  };

  // ── Ajouter une ligne ─────────────────────────
  const addLineItem = () => {
    const newId = lineItems.length + 1;
    setLineItems((prev) => [
      ...prev,
      { id: newId, description: "", qty: 1, price: 0 },
    ]);
  };

  // ── Supprimer une ligne ───────────────────────
  const removeLineItem = (id: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ── Format monétaire ──────────────────────────
  const formatMoney = (n: number): string =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ── Approve ───────────────────────────────────
  const handleApprove = async () => {
    setIsApproving(true);
    try {
      // TODO : remplacer par votre vrai appel API
      // await axios.post("/api/documents/approve", {
      //   vendorName, invoiceDate, invoiceNumber,
      //   currency, lineItems
      // });

      await new Promise((res) => setTimeout(res, 1000));
      navigate(ROUTES.EXPORT);

    } catch (err) {
      alert("Erreur lors de l'approbation.");
    } finally {
      setIsApproving(false);
    }
  };

  // ── Skip ──────────────────────────────────────
  const handleSkip = () => {
    navigate(ROUTES.UPLOAD);
  };

  // ── Correct ───────────────────────────────────
  const handleCorrect = () => {
    setInvoiceDate("2023-10-14");
    setDateFixed(true);
  };

  // ── Rendu ─────────────────────────────────────
  return (
    <div style={styles.layout}>

      {/* ════════════════════════════════
           HEADER
          ════════════════════════════════ */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerLogo}>
            <div style={styles.logoIcon}>
              <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
                <path
                  d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
                  fill="white"
                />
              </svg>
            </div>
            <span style={styles.logoText}>Scanalyze</span>
          </div>
          <div style={styles.headerBreadcrumb}>
            <span style={styles.batchLink}>Batch 402</span>
            <span style={styles.batchSep}>›</span>
            <span style={styles.batchCurrent}>Doc #12941</span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.headerUserName}>Alex Carter</span>
          <div style={styles.headerAvatar}>AC</div>
        </div>
      </header>

      {/* ════════════════════════════════
           CORPS
          ════════════════════════════════ */}
      <div style={styles.body}>

        {/* ── Colonne gauche : aperçu document ── */}
        <div style={styles.leftCol}>
          <p style={styles.pageInfo}>Page 1 of 1</p>

          {/* Document scanné simulé */}
          <div style={styles.docPreview}>
            <div style={styles.docInner}>
              <div style={styles.docHeader}>
                <div style={styles.docLogoPlaceholder} />
                <p style={styles.docTitle}>INVOICE</p>
              </div>
              <div style={styles.docLines}>
                <div style={styles.docLine} />
                <div style={styles.docLine} />
                <div style={{ ...styles.docLine, width: "60%" }} />
              </div>
              {/* Zone Invoice Date — orange */}
              <div style={styles.docFieldRow}>
                <div style={styles.docLineShort} />
                <div style={styles.docFieldHighlight}>
                  <p style={styles.docFieldLabel}>Invoice Date (?)</p>
                </div>
              </div>
              <div style={styles.docLines}>
                <div style={styles.docLine} />
                <div style={{ ...styles.docLine, width: "80%" }} />
              </div>
              {/* Zone Total Amount — bleu */}
              <div style={styles.docTotalRow}>
                <div style={styles.docTotalHighlight}>
                  <p style={styles.docTotalLabel}>Total Amount</p>
                </div>
              </div>
            </div>
          </div>

          {/* Raccourcis clavier */}
          <div style={styles.shortcutsBar}>
            <span style={styles.shortcut}>
              <kbd style={styles.kbd}>TAB</kbd> Next Field
            </span>
            <span style={styles.shortcut}>
              <kbd style={styles.kbd}>ALT+Z</kbd> Zoom
            </span>
            <span style={styles.shortcutProgress}>
              Batch Progress: 44/110
            </span>
          </div>
        </div>

        {/* ── Colonne droite : Verification Editor ── */}
        <div style={styles.rightCol}>

          {/* Titre + badge */}
          <div style={styles.rightHeader}>
            <h2 style={styles.rightTitle}>Verification Editor</h2>
            <span style={styles.issuesBadge}>2 ISSUES FOUND</span>
          </div>

          {/* ── HEADER INFORMATION ── */}
          <div style={styles.section}>
            <p style={styles.sectionTitle}>📋 HEADER INFORMATION</p>

            {/* Vendor Name */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Vendor Name</label>
              <div style={styles.inputWithIcon}>
                <input
                  type="text"
                  value={vendorName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setVendorName(e.target.value)
                  }
                  style={styles.fieldInput}
                />
                <span style={styles.okIcon}>✅</span>
              </div>
            </div>

            {/* Invoice Date — Low Confidence */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setInvoiceDate(e.target.value);
                  setDateFixed(true);
                }}
                style={{
                  ...styles.fieldInput,
                  borderColor: dateFixed ? "#d1d5db" : "#f59e0b",
                  backgroundColor: dateFixed ? "#fff" : "#fffbeb",
                }}
              />
              {!dateFixed && (
                <>
                  <div style={styles.confidenceBadge}>
                    ⚠️ Low Confidence (62%)
                  </div>
                  <div style={styles.correctionBox}>
                    <span>⚠</span>
                    <p style={styles.correctionText}>
                      <strong>CORRECTION NEEDED:</strong> IA suggested
                      'Oct 14, 2023', OCR read 'Oct 14, 202x'
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Invoice # + Currency */}
            <div style={styles.twoFields}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Invoice #</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setInvoiceNumber(e.target.value)
                  }
                  style={styles.fieldInput}
                />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Currency</label>
                <select
                  value={currency}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCurrency(e.target.value)
                  }
                  style={styles.fieldSelect}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── LINE ITEMS ── */}
          <div style={styles.section}>
            <div style={styles.lineItemsHeader}>
              <p style={styles.sectionTitle}>📦 LINE ITEMS</p>
              <button style={styles.addRowBtn} onClick={addLineItem}>
                + Add Row
              </button>
            </div>

            {/* Tableau */}
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHead}>
                  <th style={{ ...styles.th, flex: 4 }}>Description</th>
                  <th style={{ ...styles.th, flex: 1 }}>Qty</th>
                  <th style={{ ...styles.th, flex: 2 }}>Price</th>
                  <th style={{ ...styles.th, flex: 2 }}>Total</th>
                  <th style={{ ...styles.th, flex: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} style={styles.tableRow}>
                    <td style={{ ...styles.td, flex: 4 }}>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        style={styles.tableInput}
                      />
                    </td>
                    <td style={{ ...styles.td, flex: 1 }}>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) =>
                          updateLineItem(item.id, "qty", e.target.value)
                        }
                        style={styles.tableInput}
                        min="1"
                      />
                    </td>
                    <td style={{ ...styles.td, flex: 2 }}>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateLineItem(item.id, "price", e.target.value)
                        }
                        style={styles.tableInput}
                        step="0.01"
                      />
                    </td>
                    <td style={{ ...styles.td, flex: 2, color: "#374151" }}>
                      ${formatMoney(item.qty * item.price)}
                    </td>
                    <td style={{ ...styles.td, flex: 1 }}>
                      <button
                        style={styles.removeBtn}
                        onClick={() => removeLineItem(item.id)}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div style={styles.totals}>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Subtotal</span>
                <span style={styles.totalValue}>${formatMoney(subtotal)}</span>
              </div>
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Tax (0%)</span>
                <span style={styles.totalValue}>${formatMoney(tax)}</span>
              </div>
              <div style={{ ...styles.totalRow, ...styles.totalFinal }}>
                <span style={styles.totalFinalLabel}>Total Amount</span>
                <span style={styles.totalFinalValue}>
                  ${formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Boutons d'action ── */}
          <div style={styles.actionBar}>
            <button style={styles.skipBtn} onClick={handleSkip}>
              ▶ Skip
              <span style={styles.shortcutHint}>ALT+S</span>
            </button>
            <button style={styles.correctBtn} onClick={handleCorrect}>
              ✎ Correct
              <span style={styles.shortcutHint}>ALT+C</span>
            </button>
            <button
              style={{
                ...styles.approveBtn,
                opacity: isApproving ? 0.7 : 1,
                cursor: isApproving ? "not-allowed" : "pointer",
              }}
              onClick={handleApprove}
              disabled={isApproving}
            >
              ✓ {isApproving ? "Approving..." : "Approve"}
              {!isApproving && (
                <span style={styles.shortcutHint}>ALT+A</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  layout: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 24px",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "20px" },
  headerLogo: { display: "flex", alignItems: "center", gap: "8px" },
  logoIcon: {
    width: "30px", height: "30px",
    backgroundColor: "#1a3a8f", borderRadius: "6px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: "15px", fontWeight: "700", color: "#111827" },
  headerBreadcrumb: {
    display: "flex", alignItems: "center",
    gap: "6px", fontSize: "13px",
  },
  batchLink: { color: "#6b7280", cursor: "pointer" },
  batchSep: { color: "#9ca3af" },
  batchCurrent: { color: "#374151", fontWeight: "500" },
  headerRight: { display: "flex", alignItems: "center", gap: "10px" },
  headerUserName: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  headerAvatar: {
    width: "32px", height: "32px", borderRadius: "50%",
    backgroundColor: "#1a3a8f", color: "white",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700",
  },
  body: { display: "flex", flex: 1 },
  leftCol: {
    width: "45%",
    backgroundColor: "#f8f9fa",
    borderRight: "1px solid #e5e7eb",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
  },
  pageInfo: { fontSize: "12px", color: "#9ca3af", margin: "0 0 12px" },
  docPreview: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  },
  docInner: { display: "flex", flexDirection: "column", gap: "16px" },
  docHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  docLogoPlaceholder: {
    width: "60px", height: "40px",
    backgroundColor: "#f3f4f6", borderRadius: "4px",
  },
  docTitle: {
    fontSize: "18px", fontWeight: "700",
    color: "#d1d5db", margin: 0, letterSpacing: "2px",
  },
  docLines: { display: "flex", flexDirection: "column", gap: "8px" },
  docLine: {
    height: "8px", backgroundColor: "#f3f4f6",
    borderRadius: "4px", width: "100%",
  },
  docLineShort: {
    height: "8px", backgroundColor: "#f3f4f6",
    borderRadius: "4px", width: "40%",
  },
  docFieldRow: {
    display: "flex", justifyContent: "space-between",
    alignItems: "center", gap: "12px",
  },
  docFieldHighlight: {
    border: "2px solid #f59e0b", borderRadius: "4px",
    padding: "4px 10px", backgroundColor: "#fffbeb",
  },
  docFieldLabel: {
    fontSize: "11px", color: "#b45309",
    margin: 0, fontWeight: "500",
  },
  docTotalRow: { display: "flex", justifyContent: "flex-end" },
  docTotalHighlight: {
    border: "2px solid #2563eb", borderRadius: "4px",
    padding: "4px 16px", backgroundColor: "#eff6ff",
  },
  docTotalLabel: {
    fontSize: "12px", color: "#1d4ed8",
    margin: 0, fontWeight: "600",
  },
  shortcutsBar: {
    display: "flex", alignItems: "center",
    gap: "16px", marginTop: "12px",
    backgroundColor: "#1f2937",
    borderRadius: "8px", padding: "8px 14px",
  },
  shortcut: {
    fontSize: "12px", color: "#9ca3af",
    display: "flex", alignItems: "center", gap: "6px",
  },
  kbd: {
    backgroundColor: "#374151", color: "#f9fafb",
    padding: "2px 6px", borderRadius: "4px",
    fontSize: "11px", fontFamily: "monospace",
    border: "1px solid #4b5563",
  },
  shortcutProgress: {
    fontSize: "12px", color: "#6b7280", marginLeft: "auto",
  },
  rightCol: {
    flex: 1, padding: "20px 24px",
    overflowY: "auto",
    display: "flex", flexDirection: "column", gap: "16px",
  },
  rightHeader: {
    display: "flex",
    justifyContent: "space-between", alignItems: "center",
  },
  rightTitle: {
    fontSize: "18px", fontWeight: "700",
    color: "#111827", margin: 0,
  },
  issuesBadge: {
    fontSize: "12px", fontWeight: "600",
    backgroundColor: "#fef3c7", color: "#b45309",
    border: "1px solid #fde68a",
    borderRadius: "6px", padding: "4px 10px",
  },
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    border: "1px solid #e5e7eb",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  sectionTitle: {
    fontSize: "11px", fontWeight: "700",
    color: "#6b7280", letterSpacing: "0.8px", margin: 0,
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "5px" },
  fieldLabel: { fontSize: "13px", fontWeight: "500", color: "#374151" },
  inputWithIcon: {
    position: "relative", display: "flex", alignItems: "center",
  },
  fieldInput: {
    width: "100%", padding: "9px 12px",
    fontSize: "13px", border: "1.5px solid #d1d5db",
    borderRadius: "7px", outline: "none",
    color: "#111827", backgroundColor: "#fff",
    boxSizing: "border-box", transition: "border-color 0.2s",
  },
  fieldSelect: {
    width: "100%", padding: "9px 12px",
    fontSize: "13px", border: "1.5px solid #d1d5db",
    borderRadius: "7px", outline: "none",
    color: "#111827", backgroundColor: "#fff",
    boxSizing: "border-box", cursor: "pointer",
  },
  okIcon: { position: "absolute", right: "10px", fontSize: "14px" },
  confidenceBadge: {
    fontSize: "11px", color: "#b45309",
    backgroundColor: "#fef3c7",
    border: "1px solid #fde68a",
    borderRadius: "4px", padding: "3px 8px",
    display: "inline-block",
  },
  correctionBox: {
    display: "flex", gap: "8px", alignItems: "flex-start",
    backgroundColor: "#fffbeb", border: "1px solid #fde68a",
    borderRadius: "6px", padding: "8px 10px",
  },
  correctionText: {
    fontSize: "12px", color: "#92400e", margin: 0, lineHeight: "1.5",
  },
  twoFields: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px",
  },
  lineItemsHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  addRowBtn: {
    fontSize: "12px", color: "#1a3a8f", fontWeight: "600",
    background: "none", border: "none", cursor: "pointer",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHead: {
    display: "flex", padding: "6px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  th: {
    fontSize: "12px", fontWeight: "600",
    color: "#6b7280", flex: 1,
    textAlign: "left", padding: "0 4px",
  },
  tableRow: {
    display: "flex", alignItems: "center",
    padding: "6px 0", borderBottom: "1px solid #f9fafb",
  },
  td: { flex: 1, padding: "0 4px", fontSize: "13px", color: "#374151" },
  tableInput: {
    width: "100%", padding: "6px 8px",
    fontSize: "12px", border: "1px solid #e5e7eb",
    borderRadius: "5px", outline: "none",
    color: "#111827", backgroundColor: "#fafafa",
    boxSizing: "border-box",
  },
  removeBtn: {
    background: "none", border: "none",
    color: "#9ca3af", cursor: "pointer",
    fontSize: "12px", padding: "2px 4px",
  },
  totals: {
    borderTop: "1px solid #f3f4f6",
    paddingTop: "10px",
    display: "flex", flexDirection: "column", gap: "6px",
  },
  totalRow: {
    display: "flex", justifyContent: "space-between", padding: "2px 0",
  },
  totalLabel: { fontSize: "13px", color: "#6b7280" },
  totalValue: { fontSize: "13px", color: "#374151" },
  totalFinal: {
    borderTop: "1px solid #e5e7eb",
    paddingTop: "8px", marginTop: "4px",
  },
  totalFinalLabel: { fontSize: "15px", fontWeight: "700", color: "#111827" },
  totalFinalValue: { fontSize: "16px", fontWeight: "700", color: "#1a3a8f" },
  actionBar: {
    display: "flex", justifyContent: "flex-end",
    gap: "10px", paddingTop: "4px",
  },
  skipBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 16px", border: "1px solid #e5e7eb",
    borderRadius: "8px", background: "#fff",
    fontSize: "13px", fontWeight: "500",
    color: "#374151", cursor: "pointer",
  },
  correctBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 16px", border: "1px solid #e5e7eb",
    borderRadius: "8px", background: "#fff",
    fontSize: "13px", fontWeight: "500",
    color: "#374151", cursor: "pointer",
  },
  approveBtn: {
    display: "flex", alignItems: "center", gap: "6px",
    padding: "9px 20px",
    backgroundColor: "#1a3a8f", color: "#ffffff",
    border: "none", borderRadius: "8px",
    fontSize: "13px", fontWeight: "600", cursor: "pointer",
  },
  shortcutHint: {
    fontSize: "10px", opacity: 0.7,
    backgroundColor: "rgba(0,0,0,0.1)",
    padding: "1px 5px", borderRadius: "3px",
  },
};