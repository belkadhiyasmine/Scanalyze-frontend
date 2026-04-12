// ─────────────────────────────────────────────
//  containers/Editor/Editor.tsx
//  Page privée — Parent Component
//  Rôle : éditer les données extraites du document
//         et prévisualiser le JSON en temps réel
//  Composants enfants :
//  → Sidebar   : navigation
//  → TextInput : champs éditables
//  → Button    : bouton NEXT
//  → Loader    : spinner pendant la sauvegarde
//  Hooks :
//  → useState  : valeurs des champs
//  → useTheme  : theme actif
// ─────────────────────────────────────────────

import { useState }     from "react"
import { useNavigate }  from "react-router-dom"
import { useTheme }     from "../../themes/ThemeContext"

import Sidebar    from "../../components/Sidebar/Sidebar"
import TextInput  from "../../components/TextInput/TextInput"
import Button     from "../../components/Button/Button"
import Loader     from "../../components/Loader/Loader"

import { ROUTES }        from "../../navigation/routes"
import { ExtractedData } from "../../types"

// ── Données initiales (à remplacer par API) ───
const INITIAL_DATA: ExtractedData = {
  amount:   1240.50,
  currency: "USD",
  entity:   "Acme Corp International",
  date:     "2023-10-24",
  clauses: [
    "Clause 1.4: Payment net 30 days.",
    "Clause 2.1: Jurisdiction is New York.",
    "Clause 3.0: Force Majeure applicable.",
  ],
}

// ─────────────────────────────────────────────
export default function Editor() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  // ── États des champs éditables ────────────
  const [activeMenu,  setActiveMenu]  = useState<string>("upload")
  const [amount,      setAmount]      = useState<string>(String(INITIAL_DATA.amount))
  const [name,        setName]        = useState<string>(INITIAL_DATA.entity)
  const [date,        setDate]        = useState<string>(INITIAL_DATA.date)
  const [clauses,     setClauses]     = useState<string>(INITIAL_DATA.clauses.join("\n"))
  const [isFormatted, setIsFormatted] = useState<boolean>(true)
  const [isSaving,    setIsSaving]    = useState<boolean>(false)

  // ── Génère le JSON en temps réel ──────────
  const getJsonPreview = (): string => {
    const data = {
      document_id:    "Invoice_X182",
      extracted_data: {
        amount:   parseFloat(amount.replace(",", "")) || 0,
        currency: INITIAL_DATA.currency,
        entity:   name,
        date:     date,
        clauses:  clauses.split("\n").filter((c) => c.trim() !== ""),
      },
      validation_status: "warning",
      last_edited_by:    "user_admin",
    }
    return isFormatted
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
  }

  // ── Colorisation syntaxique du JSON ───────
  const colorizeJson = (jsonStr: string): string => {
    return jsonStr
      .replace(/(".*?")\s*:/g, '<span style="color:#79b8ff">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span style="color:#f0a500">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span style="color:#56d364">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#56d364">$1</span>')
  }

  // ── Clic NEXT → sauvegarde + navigation ───
  const handleNext = async () => {
    setIsSaving(true)
    try {
      await new Promise((res) => setTimeout(res, 1000))
      navigate(ROUTES.VERIFICATION)
    } catch {
      alert("Erreur lors de la sauvegarde.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{
      display:         "flex",
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",
      fontFamily:      "var(--font-primary)",
    }}>

      {isSaving && <Loader fullPage label="Sauvegarde en cours..." />}

      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(menu: string) => setActiveMenu(menu)}
      />

      <main style={{
        flex:          1,
        padding:       `${theme.spacing[6]} ${theme.spacing[7]}`,
        display:       "flex",
        flexDirection: "column",
      }}>

        {/* Breadcrumb */}
        <div style={{
          display:      "flex",
          alignItems:   "center",
          gap:          theme.spacing[1],
          fontSize:     theme.fontSize.sm,
          color:        "var(--color-text-secondary)",
          marginBottom: theme.spacing[4],
        }}>
          <span>🏠 Home</span>
          <span style={{ color: "var(--color-border-strong)" }}>›</span>
          <span style={{ color: "var(--color-text-primary)", fontWeight: theme.fontWeight.medium }}>
            Editor
          </span>
        </div>

        {/* Layout 2 colonnes */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 theme.spacing[5],
          flex:                1,
        }}>

          {/* ── Colonne gauche — Extracted Fields ── */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[5],
            display:         "flex",
            flexDirection:   "column",
            gap:             theme.spacing[4],
          }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)", margin: 0 }}>
                Extracted Fields
              </h2>
              <span style={{
                fontSize:        theme.fontSize.xs,
                color:           "#b45309",
                backgroundColor: "#fef3c7",
                border:          "1px solid #fde68a",
                borderRadius:    theme.radius.sm,
                padding:         `3px ${theme.spacing[2]}`,
              }}>
                ⚠ Manual validation required
              </span>
            </div>

            {/* AMOUNT
                onChange : e => setAmount(e.target.value)
                → extrait la valeur du ChangeEvent natif */}
            <TextInput
              label="💰 AMOUNT"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              fullWidth
            />

            {/* NAME */}
            <TextInput
              label="👤 NAME"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company name"
              fullWidth
            />

            {/* DATE */}
            <TextInput
              label="📅 DATE"
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              fullWidth
            />

            {/* CLAUSES — textarea natif gardé car TextInput ne supporte pas textarea */}
            <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
              <label style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: "var(--color-text-secondary)", letterSpacing: theme.letterSpacing.wider }}>
                📄 CLAUSES
              </label>
              <textarea
                value={clauses}
                onChange={(e) => setClauses(e.target.value)}
                placeholder="Entrez les clauses..."
                rows={5}
                style={{
                  width:           "100%",
                  padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                  fontSize:        theme.fontSize.base,
                  border:          "1px solid var(--color-border)",
                  borderRadius:    theme.radius.md,
                  outline:         "none",
                  color:           "var(--color-text-primary)",
                  backgroundColor: "var(--color-bg-input)",
                  boxSizing:       "border-box",
                  resize:          "vertical",
                  lineHeight:      "1.6",
                  fontFamily:      "var(--font-primary)",
                }}
              />
            </div>
          </div>

          {/* ── Colonne droite — Output Preview ── */}
          <div style={{
            backgroundColor: "var(--color-bg-surface)",
            borderRadius:    theme.radius.lg,
            border:          "1px solid var(--color-border)",
            padding:         theme.spacing[5],
            display:         "flex",
            flexDirection:   "column",
          }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: theme.spacing[3] }}>
              <h2 style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.bold, color: "var(--color-text-primary)", margin: 0 }}>
                <span style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)", fontFamily: "var(--font-mono)" }}>
                  &lt;/&gt;{" "}
                </span>
                Output Preview
              </h2>

              {/* Toggle FORMATTED / JSON */}
              <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
                <span style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: "var(--color-text-secondary)" }}>
                  FORMATTED
                </span>
                <div
                  style={{
                    width:           "38px",
                    height:          "22px",
                    borderRadius:    "11px",
                    cursor:          "pointer",
                    position:        "relative",
                    backgroundColor: isFormatted ? theme.colors.primary : "var(--color-border-strong)",
                    transition:      "background-color var(--transition-normal)",
                    flexShrink:      0,
                  }}
                  onClick={() => setIsFormatted(!isFormatted)}
                >
                  <div style={{
                    position:        "absolute",
                    top:             "2px",
                    width:           "18px",
                    height:          "18px",
                    borderRadius:    "50%",
                    backgroundColor: "#ffffff",
                    transition:      "transform var(--transition-normal)",
                    transform:       isFormatted ? "translateX(18px)" : "translateX(2px)",
                    boxShadow:       theme.shadows.sm,
                  }} />
                </div>
                <span style={{ fontSize: theme.fontSize.xs, fontWeight: theme.fontWeight.semibold, color: "var(--color-text-secondary)" }}>
                  JSON
                </span>
              </div>
            </div>

            {/* Bloc JSON colorisé */}
            <div style={{
              flex:            1,
              backgroundColor: "#1e1e2e",
              borderRadius:    theme.radius.md,
              padding:         theme.spacing[4],
              overflow:        "auto",
              minHeight:       "280px",
            }}>
              <pre
                style={{
                  margin:     0,
                  fontSize:   theme.fontSize.sm,
                  lineHeight: "1.7",
                  fontFamily: "var(--font-mono)",
                  color:      "#cdd6f4",
                  whiteSpace: "pre-wrap",
                  wordBreak:  "break-word",
                }}
                dangerouslySetInnerHTML={{ __html: colorizeJson(getJsonPreview()) }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[1], marginTop: theme.spacing[2], fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.colors.success, flexShrink: 0 }} />
              Connected to API
            </div>
          </div>
        </div>

        {/* Footer — bouton NEXT */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: theme.spacing[4] }}>
          <Button
            label={isSaving ? "Saving..." : "→ Next"}
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={isSaving}
          />
        </div>

      </main>
    </div>
  )
}