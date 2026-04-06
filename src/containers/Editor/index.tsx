// ─────────────────────────────────────────────
//  pages/Editor/Editor.tsx
//  Page privée — Parent Component
//  Utilise : Sidebar
// ─────────────────────────────────────────────

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import { ROUTES } from "../../navigation/routes";
import { ExtractedData } from "../../types";

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
};

// ─────────────────────────────────────────────
export default function Editor() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [activeMenu, setActiveMenu]   = useState<string>("upload");
  const [amount, setAmount]           = useState<string>(String(INITIAL_DATA.amount));
  const [name, setName]               = useState<string>(INITIAL_DATA.entity);
  const [date, setDate]               = useState<string>(INITIAL_DATA.date);
  const [clauses, setClauses]         = useState<string>(INITIAL_DATA.clauses.join("\n"));
  const [isFormatted, setIsFormatted] = useState<boolean>(true);
  const [isSaving, setIsSaving]       = useState<boolean>(false);

  // ── Génère le JSON en temps réel ─────────────
  const getJsonPreview = (): string => {
    const data = {
      document_id: "Invoice_X182",
      extracted_data: {
        amount:   parseFloat(amount.replace(",", "")) || 0,
        currency: INITIAL_DATA.currency,
        entity:   name,
        date:     date,
        clauses:  clauses.split("\n").filter((c) => c.trim() !== ""),
      },
      validation_status: "warning",
      last_edited_by:    "user_admin",
    };
    return isFormatted
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);
  };

  // ── Colorisation JSON ─────────────────────────
  const colorizeJson = (jsonStr: string): string => {
    return jsonStr
      .replace(/(".*?")\s*:/g, '<span style="color:#79b8ff">$1</span>:')
      .replace(/:\s*(".*?")/g, ': <span style="color:#f0a500">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span style="color:#56d364">$1</span>')
      .replace(/:\s*(\d+\.?\d*)/g, ': <span style="color:#56d364">$1</span>');
  };

  // ── Clic NEXT ─────────────────────────────────
  const handleNext = async () => {
    setIsSaving(true);
    try {
      // TODO : remplacer par votre vrai appel API
      // await axios.put("/api/documents/Invoice_X182", {
      //   amount, name, date, clauses
      // });

      await new Promise((res) => setTimeout(res, 1000));
      navigate(ROUTES.VERIFICATION);

    } catch (err) {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setIsSaving(false);
    }
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
          <span style={styles.current}>Editor</span>
        </div>

        {/* ── Layout 2 colonnes ── */}
        <div style={styles.twoColumns}>

          {/* ── Colonne gauche : Extracted Fields ── */}
          <div style={styles.leftCol}>
            <div style={styles.colHeader}>
              <h2 style={styles.colTitle}>Extracted Fields</h2>
              <span style={styles.warningBadge}>
                ⚠ Manual validation required
              </span>
            </div>

            {/* AMOUNT */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                <span>💰</span> AMOUNT
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                style={styles.fieldInput}
                placeholder="0.00"
              />
            </div>

            {/* NAME */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                <span>👤</span> NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setName(e.target.value)
                }
                style={styles.fieldInput}
                placeholder="Company name"
              />
            </div>

            {/* DATE */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                <span>📅</span> DATE
              </label>
              <input
                type="date"
                value={date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDate(e.target.value)
                }
                style={styles.fieldInput}
              />
            </div>

            {/* CLAUSES */}
            <div style={styles.fieldGroup}>
              <label style={styles.fieldLabel}>
                <span>📄</span> CLAUSES
              </label>
              <textarea
                value={clauses}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setClauses(e.target.value)
                }
                style={styles.fieldTextarea}
                placeholder="Entrez les clauses..."
                rows={5}
              />
            </div>

          </div>

          {/* ── Colonne droite : Output Preview ── */}
          <div style={styles.rightCol}>
            <div style={styles.colHeader}>
              <h2 style={styles.colTitle}>
                <span style={styles.codeIcon}>&lt;/&gt;</span>
                Output Preview
              </h2>
              {/* Toggle FORMATTED / JSON */}
              <div style={styles.toggleWrapper}>
                <span style={styles.toggleLabel}>FORMATTED</span>
                <div
                  style={{
                    ...styles.toggleTrack,
                    backgroundColor: isFormatted ? "#1a3a8f" : "#d1d5db",
                  }}
                  onClick={() => setIsFormatted(!isFormatted)}
                >
                  <div
                    style={{
                      ...styles.toggleThumb,
                      transform: isFormatted
                        ? "translateX(18px)"
                        : "translateX(2px)",
                    }}
                  />
                </div>
                <span style={styles.toggleLabel}>JSON</span>
              </div>
            </div>

            {/* JSON colorisé — mis à jour en temps réel */}
            <div style={styles.jsonBox}>
              <pre
                style={styles.jsonContent}
                dangerouslySetInnerHTML={{
                  __html: colorizeJson(getJsonPreview()),
                }}
              />
            </div>

            {/* Indicateur API */}
            <div style={styles.apiStatus}>
              <span style={styles.apiDot} />
              Connected to API
            </div>

          </div>
        </div>

        {/* ── Bouton NEXT ── */}
        <div style={styles.footer}>
          <button
            style={{
              ...styles.nextBtn,
              opacity: isSaving ? 0.7 : 1,
              cursor: isSaving ? "not-allowed" : "pointer",
            }}
            onClick={handleNext}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "→ Next"}
          </button>
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
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
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
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    flex: 1,
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
  colHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "4px",
  },
  colTitle: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  codeIcon: {
    fontSize: "14px",
    color: "#6b7280",
    fontFamily: "monospace",
  },
  warningBadge: {
    fontSize: "11px",
    color: "#b45309",
    backgroundColor: "#fef3c7",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    padding: "3px 8px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6b7280",
    letterSpacing: "0.8px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  fieldInput: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
  },
  fieldTextarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "13px",
    border: "1.5px solid #e5e7eb",
    borderRadius: "8px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
    resize: "vertical",
    lineHeight: "1.6",
    fontFamily: "'Segoe UI', sans-serif",
  },
  toggleWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  toggleLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.5px",
  },
  toggleTrack: {
    width: "38px",
    height: "22px",
    borderRadius: "11px",
    cursor: "pointer",
    position: "relative",
    transition: "background-color 0.2s",
    flexShrink: 0,
  },
  toggleThumb: {
    position: "absolute",
    top: "2px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    transition: "transform 0.2s",
    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
  },
  jsonBox: {
    flex: 1,
    backgroundColor: "#1e1e2e",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "12px",
    overflow: "auto",
    minHeight: "280px",
  },
  jsonContent: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "1.7",
    fontFamily: "'Courier New', monospace",
    color: "#cdd6f4",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  apiStatus: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "10px",
    fontSize: "12px",
    color: "#6b7280",
  },
  apiDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#16a34a",
    flexShrink: 0,
  },
  footer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "16px",
  },
  nextBtn: {
    padding: "10px 28px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
};