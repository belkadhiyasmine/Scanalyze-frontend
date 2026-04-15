// ─────────────────────────────────────────────
//  Editor.tsx — VERSION FINALE CORRIGÉE
//  ✔ Compatible avec ton theme réel
//  ✔ Aucune erreur TypeScript
//  ✔ Bien commenté (PFE ready)
// ─────────────────────────────────────────────

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../themes/ThemeContext"

// ── Composants UI ─────────────────────────────
import Sidebar from "../../components/Sidebar/Sidebar"
import TextInput from "../../components/TextInput/TextInput"
import Button from "../../components/Button/Button"
import Loader from "../../components/Loader/Loader"

// ── Navigation + Types ────────────────────────
import { ROUTES } from "../../navigation/routes"
import { ExtractedData } from "../../types"

// ── Données simulées (OCR)
const INITIAL_DATA: ExtractedData = {
  amount: 1240.50,
  currency: "USD",
  entity: "Acme Corp International",
  date: "2023-10-24",
  clauses: [
    "Clause 1.4: Payment net 30 days.",
    "Clause 2.1: Jurisdiction is New York.",
    "Clause 3.0: Force Majeure applicable.",
  ],
}

export default function Editor() {

  // Navigation
  const navigate = useNavigate()

  // Theme global
  const { theme } = useTheme()

  // ───────────── STATES ─────────────
  const [activeMenu, setActiveMenu] = useState("upload")

  const [amount, setAmount] = useState(String(INITIAL_DATA.amount))
  const [name, setName] = useState(INITIAL_DATA.entity)
  const [date, setDate] = useState(INITIAL_DATA.date)
  const [clauses, setClauses] = useState(INITIAL_DATA.clauses.join("\n"))

  const [isFormatted, setIsFormatted] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // ───────────── JSON GENERATION ─────────────
  const getJsonPreview = (): string => {
    const data = {
      document_id: "Invoice_X182",

      extracted_data: {
        amount: parseFloat(amount.replace(",", "")) || 0,
        currency: INITIAL_DATA.currency,
        entity: name,
        date: date,
        clauses: clauses.split("\n").filter(c => c.trim() !== ""),
      },

      validation_status: "warning",
      last_edited_by: "user_admin",
    }

    return isFormatted
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data)
  }

  // ───────────── JSON COLORIZATION ─────────────
  const colorizeJson = (jsonStr: string): string => {
    return jsonStr
      // clés
      .replace(/(".*?")\s*:/g,
        `<span style="color:${theme.colors.primary}">$1</span>:`)

      // string
      .replace(/:\s*(".*?")/g,
        `: <span style="color:${theme.colors.textSecondary}">$1</span>`)

      // bool
      .replace(/:\s*(true|false)/g,
        `: <span style="color:${theme.colors.success}">$1</span>`)

      // number
      .replace(/:\s*(\d+\.?\d*)/g,
        `: <span style="color:${theme.colors.success}">$1</span>`)
  }

  // ───────────── NEXT ACTION ─────────────
  const handleNext = async () => {
    setIsSaving(true)

    try {
      await new Promise(res => setTimeout(res, 1000))
      navigate(ROUTES.VERIFICATION)
    } catch {
      alert("Erreur lors de la sauvegarde.")
    } finally {
      setIsSaving(false)
    }
  }

  // ───────────── UI ─────────────
  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      backgroundColor: theme.colors.bgApp,

      // ✔ FIX fontFamily
      fontFamily: theme.fontFamily.primary,
    }}>

      {/* Loader global */}
      {isSaving && <Loader fullPage label="Sauvegarde en cours..." />}

      {/* Sidebar */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      />

      {/* MAIN */}
      <main style={{
        flex: 1,
        padding: `${theme.spacing[6]} ${theme.spacing[7]}`,
        display: "flex",
        flexDirection: "column",
      }}>

        {/* Breadcrumb */}
        <div style={{
          display: "flex",
          gap: theme.spacing[1],
          fontSize: theme.fontSize.sm,
          color: theme.colors.textSecondary,
          marginBottom: theme.spacing[4],
        }}>
          <span>🏠 Home</span>
          <span>›</span>
          <span>Editor</span>
        </div>

        {/* GRID */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: theme.spacing[5],
          flex: 1,
        }}>

          {/* ───────── LEFT PANEL ───────── */}
          <div style={{
            backgroundColor: theme.colors.bgSurface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            padding: theme.spacing[5],
          }}>

            <h2 style={{
              fontSize: theme.fontSize.lg,
              color: theme.colors.textPrimary
            }}>
              Extracted Fields
            </h2>

            <TextInput
              label="💰 AMOUNT"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              fullWidth
            />

            <TextInput
              label="👤 NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />

            <TextInput
              label="📅 DATE"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
            />

            {/* Textarea */}
            <textarea
              value={clauses}
              onChange={(e) => setClauses(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radius.md,
                backgroundColor: theme.colors.bgSurface,
                color: theme.colors.textPrimary,

                // ✔ FIX font
                fontFamily: theme.fontFamily.sans,
              }}
            />
          </div>

          {/* ───────── RIGHT PANEL ───────── */}
          <div style={{
            backgroundColor: theme.colors.bgSurface,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radius.lg,
            padding: theme.spacing[5],
            display: "flex",
            flexDirection: "column",
          }}>

            <h2 style={{
              fontSize: theme.fontSize.lg,
              color: theme.colors.textPrimary
            }}>
              Output Preview
            </h2>

            {/* JSON */}
            <div style={{
              flex: 1,
              marginTop: theme.spacing[3],
              padding: theme.spacing[4],
              backgroundColor: theme.colors.bgSurface,
              borderRadius: theme.radius.md,
              overflow: "auto",
            }}>
              <pre
                style={{
                  margin: 0,
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textPrimary,

                  // ✔ FIX font mono
                  fontFamily: theme.fontFamily.mono,

                  whiteSpace: "pre-wrap",
                }}
                dangerouslySetInnerHTML={{
                  __html: colorizeJson(getJsonPreview())
                }}
              />
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: theme.spacing[4],
        }}>
          <Button
            label={isSaving ? "Saving..." : "→ Next"}
            onClick={handleNext}
            disabled={isSaving}
          />
        </div>

      </main>
    </div>
  )
}