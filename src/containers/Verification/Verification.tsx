// ─────────────────────────────────────────────
//  containers/Verification/Verification.tsx
//  Page privée — Parent Component
//  Rôle : vérifier et valider les données
//         extraites d'un document scanné
//  Composants enfants :
//  → TextInput : champs éditables (vendor, invoice...)
//  → Button    : Skip, Correct, Approve
//  → Loader    : spinner pendant l'approbation
//  Hooks :
//  → useState  : états des champs et ligne items
//  → useTheme  : theme actif (light/dark)
// ─────────────────────────────────────────────

import { useState }    from "react"
import { useNavigate } from "react-router-dom"
import { useTheme }    from "../../themes/ThemeContext"

import TextInput from "../../components/TextInput/TextInput"
import Button    from "../../components/Button/Button"
import Loader    from "../../components/Loader/Loader"

import { ROUTES }   from "../../navigation/routes"
import { LineItem } from "../../types"

// ── Données fictives ──────────────────────────
const INITIAL_LINE_ITEMS: LineItem[] = [
  { id: 1, description: "Shipping & Handling",  qty: 1, price: 45.0 },
  { id: 2, description: "Express Delivery Fee", qty: 1, price: 12.5 },
]

const CURRENCIES = [
  "USD - US Dollar",
  "EUR - Euro",
  "GBP - British Pound",
  "TND - Tunisian Dinar",
]

// ─────────────────────────────────────────────
export default function Verification() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  // ── États des champs ──────────────────────
  const [vendorName,    setVendorName]    = useState<string>("Global Logistics Inc.")
  const [invoiceDate,   setInvoiceDate]   = useState<string>("2023-10-14")
  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2023-094")
  const [currency,      setCurrency]      = useState<string>("USD - US Dollar")
  const [lineItems,     setLineItems]     = useState<LineItem[]>(INITIAL_LINE_ITEMS)
  const [dateFixed,     setDateFixed]     = useState<boolean>(false)
  const [isApproving,   setIsApproving]   = useState<boolean>(false)

  // ── Calculs ───────────────────────────────
  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.price, 0)
  const tax      = 0
  const total    = subtotal + tax

  // ── Modifier une ligne ────────────────────
  const updateLineItem = (id: number, field: keyof LineItem, value: string) => {
    setLineItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "qty" || field === "price"
                ? parseFloat(value) || 0
                : value,
            }
          : item
      )
    )
  }

  const addLineItem = () => {
    const newId = lineItems.length + 1
    setLineItems((prev) => [...prev, { id: newId, description: "", qty: 1, price: 0 }])
  }

  const removeLineItem = (id: number) => {
    setLineItems((prev) => prev.filter((item) => item.id !== id))
  }

  const formatMoney = (n: number): string =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await new Promise((res) => setTimeout(res, 1000))
      navigate(ROUTES.EXPORT)
    } catch {
      alert("Erreur lors de l'approbation.")
    } finally {
      setIsApproving(false)
    }
  }

  const handleSkip    = () => navigate(ROUTES.UPLOAD)
  const handleCorrect = () => { setInvoiceDate("2023-10-14"); setDateFixed(true) }

  return (
    <div style={{
      display:         "flex",
      flexDirection:   "column",
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",
      fontFamily:      "var(--font-primary)",
    }}>

      {isApproving && <Loader fullPage label="Approbation en cours..." />}

      {/* ── Header ── */}
      <header style={{
        display:         "flex",
        justifyContent:  "space-between",
        alignItems:      "center",
        backgroundColor: "var(--color-bg-surface)",
        borderBottom:    "1px solid var(--color-border)",
        padding:         `${theme.spacing[3]} ${theme.spacing[6]}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[5] }}>
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
            <div style={{
              width:           "30px",
              height:          "30px",
              backgroundColor: theme.colors.primary,
              borderRadius:    theme.radius.sm,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
            }}>
              <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
                <path d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z" fill="white" />
              </svg>
            </div>
            <span style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)" }}>
              Scanalyze
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[1], fontSize: theme.fontSize.sm }}>
            <span style={{ color: "var(--color-text-secondary)", cursor: "pointer" }}>Batch 402</span>
            <span style={{ color: "var(--color-border-strong)" }}>›</span>
            <span style={{ color: "var(--color-text-primary)", fontWeight: theme.fontWeight.medium }}>Doc #12941</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
          <span style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: "var(--color-text-primary)" }}>
            Alex Carter
          </span>
          <div style={{
            width:           "32px",
            height:          "32px",
            borderRadius:    theme.radius.round,
            backgroundColor: theme.colors.primary,
            color:           "white",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            fontSize:        theme.fontSize.xs,
            fontWeight:      theme.fontWeight.bold,
          }}>
            AC
          </div>
        </div>
      </header>

      {/* ── Corps 2 colonnes ── */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* ── Colonne gauche — Aperçu document ── */}
        <div style={{
          width:           "45%",
          backgroundColor: "var(--color-bg-app)",
          borderRight:     "1px solid var(--color-border)",
          padding:         theme.spacing[4],
          display:         "flex",
          flexDirection:   "column",
        }}>
          <p style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)", margin: `0 0 ${theme.spacing[3]}` }}>
            Page 1 of 1
          </p>

          <div style={{
            flex:            1,
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.md,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[5],
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[4] }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ width: "60px", height: "40px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm }} />
                <p style={{ fontSize: "18px", fontWeight: theme.fontWeight.bold, color: "var(--color-border-strong)", margin: 0, letterSpacing: "2px" }}>
                  INVOICE
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[2] }}>
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "60%"  }} />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: theme.spacing[3] }}>
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "40%" }} />
                <div style={{ border: "2px solid #f59e0b", borderRadius: theme.radius.sm, padding: `4px ${theme.spacing[2]}`, backgroundColor: "#fffbeb" }}>
                  <p style={{ fontSize: theme.fontSize.xs, color: "#b45309", margin: 0, fontWeight: theme.fontWeight.medium }}>
                    Invoice Date (?)
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[2] }}>
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: "var(--color-bg-hover)", borderRadius: theme.radius.sm, width: "80%"  }} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ border: "2px solid #2563eb", borderRadius: theme.radius.sm, padding: `4px ${theme.spacing[4]}`, backgroundColor: "#eff6ff" }}>
                  <p style={{ fontSize: theme.fontSize.sm, color: "#1d4ed8", margin: 0, fontWeight: theme.fontWeight.semibold }}>
                    Total Amount
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barre raccourcis */}
          <div style={{
            display:         "flex",
            alignItems:      "center",
            gap:             theme.spacing[4],
            marginTop:       theme.spacing[3],
            backgroundColor: "#1f2937",
            borderRadius:    theme.radius.md,
            padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
          }}>
            <span style={{ fontSize: theme.fontSize.sm, color: "#9ca3af", display: "flex", alignItems: "center", gap: theme.spacing[1] }}>
              <kbd style={{ backgroundColor: "#374151", color: "#f9fafb", padding: "2px 6px", borderRadius: theme.radius.sm, fontSize: theme.fontSize.xs, fontFamily: "var(--font-mono)", border: "1px solid #4b5563" }}>TAB</kbd>
              Next Field
            </span>
            <span style={{ fontSize: theme.fontSize.sm, color: "#9ca3af", display: "flex", alignItems: "center", gap: theme.spacing[1] }}>
              <kbd style={{ backgroundColor: "#374151", color: "#f9fafb", padding: "2px 6px", borderRadius: theme.radius.sm, fontSize: theme.fontSize.xs, fontFamily: "var(--font-mono)", border: "1px solid #4b5563" }}>ALT+Z</kbd>
              Zoom
            </span>
            <span style={{ fontSize: theme.fontSize.sm, color: "#6b7280", marginLeft: "auto" }}>
              Batch Progress: 44/110
            </span>
          </div>
        </div>

        {/* ── Colonne droite — Verification Editor ── */}
        <div style={{
          flex:          1,
          padding:       `${theme.spacing[5]} ${theme.spacing[6]}`,
          overflowY:     "auto",
          display:       "flex",
          flexDirection: "column",
          gap:           theme.spacing[4],
        }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)", margin: 0 }}>
              Verification Editor
            </h2>
            <span style={{
              fontSize:        theme.fontSize.sm,
              fontWeight:      theme.fontWeight.semibold,
              backgroundColor: "#fef3c7",
              color:           "#b45309",
              border:          "1px solid #fde68a",
              borderRadius:    theme.radius.md,
              padding:         `4px ${theme.spacing[2]}`,
            }}>
              2 ISSUES FOUND
            </span>
          </div>

          {/* Section 1 — Header Information */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[4],
            display:         "flex",
            flexDirection:   "column",
            gap:             theme.spacing[3],
          }}>
            <p style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.bold, color: "var(--color-text-secondary)", letterSpacing: theme.letterSpacing.wider, margin: 0 }}>
              📋 HEADER INFORMATION
            </p>

            {/* Vendor Name
                onChange : e => setVendorName(e.target.value) */}
            <div style={{ position: "relative" }}>
              <TextInput
                label="Vendor Name"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                fullWidth
              />
              <span style={{ position: "absolute", right: "12px", bottom: "10px", fontSize: "14px" }}>
                ✅
              </span>
            </div>

            {/* Invoice Date — input natif gardé pour type="date" */}
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
              <label style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: "var(--color-text-primary)" }}>
                Invoice Date
              </label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => { setInvoiceDate(e.target.value); setDateFixed(true) }}
                style={{
                  width:           "100%",
                  padding:         "9px 12px",
                  fontSize:        theme.fontSize.sm,
                  border:          `1.5px solid ${dateFixed ? "var(--color-border)" : "#f59e0b"}`,
                  backgroundColor: dateFixed ? "var(--color-bg-input)" : "#fffbeb",
                  borderRadius:    theme.radius.md,
                  outline:         "none",
                  color:           "var(--color-text-primary)",
                  boxSizing:       "border-box",
                  transition:      "border-color var(--transition-normal)",
                  fontFamily:      "var(--font-primary)",
                }}
              />

              {!dateFixed && (
                <>
                  <div style={{
                    fontSize:        theme.fontSize.xs,
                    color:           "#b45309",
                    backgroundColor: "#fef3c7",
                    border:          "1px solid #fde68a",
                    borderRadius:    theme.radius.sm,
                    padding:         `3px ${theme.spacing[2]}`,
                    display:         "inline-block",
                  }}>
                    ⚠️ Low Confidence (62%)
                  </div>
                  <div style={{
                    display:         "flex",
                    gap:             theme.spacing[2],
                    alignItems:      "flex-start",
                    backgroundColor: "#fffbeb",
                    border:          "1px solid #fde68a",
                    borderRadius:    theme.radius.md,
                    padding:         `${theme.spacing[2]} ${theme.spacing[2]}`,
                  }}>
                    <span>⚠</span>
                    <p style={{ fontSize: theme.fontSize.sm, color: "#92400e", margin: 0, lineHeight: "1.5" }}>
                      <strong>CORRECTION NEEDED:</strong> IA suggested 'Oct 14, 2023', OCR read 'Oct 14, 202x'
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Invoice # + Currency */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: theme.spacing[3] }}>

              {/* Invoice Number
                  onChange : e => setInvoiceNumber(e.target.value) */}
              <TextInput
                label="Invoice #"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                fullWidth
              />

              {/* Currency — select natif */}
              <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
                <label style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.medium, color: "var(--color-text-primary)" }}>
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width:           "100%",
                    padding:         "9px 12px",
                    fontSize:        theme.fontSize.sm,
                    border:          "1px solid var(--color-border)",
                    borderRadius:    theme.radius.md,
                    outline:         "none",
                    color:           "var(--color-text-primary)",
                    backgroundColor: "var(--color-bg-input)",
                    boxSizing:       "border-box",
                    cursor:          "pointer",
                    fontFamily:      "var(--font-primary)",
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2 — Line Items */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[4],
            display:         "flex",
            flexDirection:   "column",
            gap:             theme.spacing[3],
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.bold, color: "var(--color-text-secondary)", letterSpacing: theme.letterSpacing.wider, margin: 0 }}>
                📦 LINE ITEMS
              </p>
              <Button label="+ Add Row" variant="ghost" size="sm" onClick={addLineItem} />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ display: "flex", padding: `${theme.spacing[1]} 0`, borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ ...thStyle(theme), flex: 4 }}>Description</th>
                  <th style={{ ...thStyle(theme), flex: 1 }}>Qty</th>
                  <th style={{ ...thStyle(theme), flex: 2 }}>Price</th>
                  <th style={{ ...thStyle(theme), flex: 2 }}>Total</th>
                  <th style={{ ...thStyle(theme), flex: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item) => (
                  <tr key={item.id} style={{ display: "flex", alignItems: "center", padding: `${theme.spacing[1]} 0`, borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ flex: 4, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                        style={tableInputStyle(theme)}
                      />
                    </td>
                    <td style={{ flex: 1, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateLineItem(item.id, "qty", e.target.value)}
                        style={tableInputStyle(theme)}
                        min="1"
                      />
                    </td>
                    <td style={{ flex: 2, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateLineItem(item.id, "price", e.target.value)}
                        style={tableInputStyle(theme)}
                        step="0.01"
                      />
                    </td>
                    <td style={{ flex: 2, padding: `0 ${theme.spacing[1]}`, fontSize: theme.fontSize.sm, color: "var(--color-text-primary)" }}>
                      ${formatMoney(item.qty * item.price)}
                    </td>
                    <td style={{ flex: 1, padding: `0 ${theme.spacing[1]}` }}>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        style={{ background: "none", border: "none", color: "var(--color-text-secondary)", cursor: "pointer", fontSize: "12px" }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux */}
            <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: theme.spacing[2], display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)" }}>Subtotal</span>
                <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-primary)" }}>${formatMoney(subtotal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)" }}>Tax (0%)</span>
                <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-primary)" }}>${formatMoney(tax)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border)", paddingTop: theme.spacing[2], marginTop: theme.spacing[1] }}>
                <span style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)" }}>
                  Total Amount
                </span>
                <span style={{ fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.bold, color: theme.colors.primary }}>
                  ${formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          {/* Barre d'actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: theme.spacing[2], paddingTop: theme.spacing[1] }}>
            <Button label="▶ Skip  ALT+S"  variant="ghost"     size="md" onClick={handleSkip} />
            <Button label="✎ Correct  ALT+C" variant="secondary" size="md" onClick={handleCorrect} />
            <Button
              label={isApproving ? "Approving..." : "✓ Approve  ALT+A"}
              variant="primary"
              size="md"
              onClick={handleApprove}
              disabled={isApproving}
            />
          </div>

        </div>
      </div>
    </div>
  )
}

// ── Helpers styles ────────────────────────────
const thStyle = (theme: any): React.CSSProperties => ({
  fontSize:   theme.fontSize.sm,
  fontWeight: theme.fontWeight.semibold,
  color:      "var(--color-text-secondary)",
  flex:       1,
  textAlign:  "left",
  padding:    `0 ${theme.spacing[1]}`,
})

const tableInputStyle = (theme: any): React.CSSProperties => ({
  width:           "100%",
  padding:         `${theme.spacing[1]} ${theme.spacing[2]}`,
  fontSize:        theme.fontSize.sm,
  border:          "1px solid var(--color-border)",
  borderRadius:    theme.radius.sm,
  outline:         "none",
  color:           "var(--color-text-primary)",
  backgroundColor: "var(--color-bg-app)",
  boxSizing:       "border-box",
  fontFamily:      "var(--font-primary)",
})