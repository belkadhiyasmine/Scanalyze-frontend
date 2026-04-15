// ─────────────────────────────────────────────
//  containers/DataExport/DataExport.tsx
//  Page privée — export des données extraites
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useState }    from "react"
import { useNavigate } from "react-router-dom"
import { useTheme }    from "../../themes/ThemeContext"

import Sidebar from "../../components/Sidebar/Sidebar"
import Button  from "../../components/Button/Button"
import Loader  from "../../components/Loader/Loader"
import Toast   from "../../components/Toast/Toast"

import { ROUTES } from "../../navigation/routes"

// ─────────────────────────────────────────────
//  DONNÉES SIMULÉES
//  Remplacées plus tard par les vraies données
//  retournées par le pipeline OCR
// ─────────────────────────────────────────────

const EXPORT_PREVIEW = {
  document_id:       "Invoice_X182",
  vendor_name:       "Acme Corp International",
  invoice_number:    "INV-2023-094",
  invoice_date:      "2023-10-24",
  currency:          "USD",
  total:             1253.00,
  validation_status: "Approved",
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function DataExport() {
  const navigate = useNavigate()

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ─────────────────────────────────────────
  //  STATES
  // ─────────────────────────────────────────

  // Menu actif dans la Sidebar — "export" car on est sur cette page
  const [activeMenu,  setActiveMenu]  = useState("export")

  // true pendant l'export → affiche Loader pleine page
  const [isExporting, setIsExporting] = useState(false)

  // true après export réussi → affiche Toast + badge succès
  const [exported,    setExported]    = useState(false)

  // ─────────────────────────────────────────
  //  EXPORT
  //  Simule un appel API puis affiche
  //  le toast de succès
  // ─────────────────────────────────────────

  const handleExport = async () => {
    setIsExporting(true)
    try {
      // Simule 1 seconde d'appel API
      // À remplacer par un vrai appel axios
      await new Promise(res => setTimeout(res, 1000))
      setExported(true)   // affiche Toast + badge
    } catch {
      alert("Erreur lors de l'export.")
    } finally {
      setIsExporting(false)
    }
  }

  // ─────────────────────────────────────────
  //  RENDU
  // ─────────────────────────────────────────

  return (
    <div
      style={{
        display:         "flex",
        minHeight:       "100vh",
        backgroundColor: colors.bgApp,          // fond général selon le theme
        fontFamily:      theme.fontFamily.sans,  // depuis typography.ts
      }}
    >

      {/* ── Loader pleine page ─────────────────
          Affiché par dessus tout pendant
          l'export                               */}
      {isExporting && (
        <Loader fullPage label="Export en cours..." />
      )}

      {/* ── Toast succès ───────────────────────
          Notification en bas à droite
          après export réussi                   */}
      {exported && (
        <Toast
          message="Export réussi !"
          onClose={() => setExported(false)}
        />
      )}

      {/* ── Sidebar ────────────────────────────
          Navigation latérale — même que
          Dashboard, Editor, Verification       */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      />

      {/* ── Contenu principal ──────────────────*/}
      <main
        style={{
          flex:          1,
          padding:       `${theme.spacing[6]} ${theme.spacing[8]}`, // 24px 32px
          display:       "flex",
          flexDirection: "column",
          gap:           theme.spacing[5],    // 20px entre les sections
        }}
      >

        {/* ── Breadcrumb ─────────────────────────
            Fil d'Ariane — indique où on est     */}
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        theme.spacing[1],     // 4px
            fontSize:   theme.fontSize.sm,
            color:      colors.textSecondary,
          }}
        >
          <span>🏠 Home</span>
          <span style={{ color: colors.borderStrong }}>›</span>
          <span
            style={{
              color:      colors.textPrimary,
              fontWeight: theme.fontWeight.medium,
            }}
          >
            Data Export
          </span>
        </div>

        {/* ── En-tête ────────────────────────────
            Titre + badge succès (si exporté)    */}
        <div
          style={{
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize:      theme.fontSize.xxl,
                fontWeight:    theme.fontWeight.bold,
                color:         colors.textPrimary,
                margin:        `0 0 ${theme.spacing[1]}`,
                letterSpacing: theme.letterSpacing.wide,
              }}
            >
              DATA EXPORT
            </h1>
            <p
              style={{
                fontSize: theme.fontSize.md,
                color:    colors.textSecondary,
                margin:   0,
              }}
            >
              Export your extracted document data.
            </p>
          </div>

          {/* Badge succès — visible après export réussi */}
          {exported && (
            <div
              style={{
                backgroundColor: colors.successBg,           // fond vert clair
                border:          `1px solid ${colors.success}`,
                color:           colors.success,             // texte vert
                borderRadius:    theme.radius.md,            // 8px
                padding:         `${theme.spacing[2]} ${theme.spacing[4]}`, // 8px 16px
                fontSize:        theme.fontSize.sm,
                fontWeight:      theme.fontWeight.semibold,
              }}
            >
              ✅ Export successful !
            </div>
          )}
        </div>

        {/* ── Layout 2 colonnes ──────────────────
            Gauche : résumé + boutons
            Droite : preview du fichier          */}
        <div
          style={{
            display:             "grid",
            gridTemplateColumns: "1fr 1.4fr",   // droite plus large
            gap:                 theme.spacing[5],
            flex:                1,
          }}
        >

          {/* ── COLONNE GAUCHE ─────────────────────
              Résumé document + statut + boutons  */}
          <div
            style={{
              backgroundColor: colors.bgSurface,  // blanc light / sombre dark
              borderRadius:    theme.radius.lg,    // 12px
              border:          `1px solid ${colors.border}`,
              padding:         theme.spacing[5],   // 20px
              display:         "flex",
              flexDirection:   "column",
              gap:             theme.spacing[4],   // 16px entre les blocs
            }}
          >
            <h2
              style={{
                fontSize:   theme.fontSize.lg,
                fontWeight: theme.fontWeight.bold,
                color:      colors.textPrimary,
                margin:     0,
              }}
            >
              📋 Document Summary
            </h2>

            {/* Tableau résumé — lignes générées dynamiquement */}
            <div
              style={{
                border:       `1px solid ${colors.border}`,
                borderRadius: theme.radius.md,   // 8px
                overflow:     "hidden",          // masque les coins des lignes
              }}
            >
              {[
                { label: "Document ID",  value: EXPORT_PREVIEW.document_id    },
                { label: "Vendor",       value: EXPORT_PREVIEW.vendor_name    },
                { label: "Invoice #",    value: EXPORT_PREVIEW.invoice_number },
                { label: "Date",         value: EXPORT_PREVIEW.invoice_date   },
                { label: "Currency",     value: EXPORT_PREVIEW.currency       },
              ].map((row, i) => (
                // .map() → génère chaque ligne du tableau
                <div
                  key={i}
                  style={{
                    display:        "flex",
                    justifyContent: "space-between",
                    alignItems:     "center",
                    padding:        `${theme.spacing[2]} ${theme.spacing[3]}`, // 8px 12px
                    borderBottom:   `1px solid ${colors.border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: theme.fontSize.sm,
                      color:    colors.textSecondary,  // gris — label
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{
                      fontSize:   theme.fontSize.sm,
                      fontWeight: theme.fontWeight.medium,
                      color:      colors.textPrimary,  // foncé — valeur
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}

              {/* Ligne Total — mise en valeur visuelle */}
              <div
                style={{
                  display:         "flex",
                  justifyContent:  "space-between",
                  padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                  backgroundColor: colors.bgApp,  // fond légèrement différent
                }}
              >
                <span
                  style={{
                    fontSize:   theme.fontSize.md,
                    fontWeight: theme.fontWeight.bold,
                    color:      colors.textPrimary,
                  }}
                >
                  Total Amount
                </span>
                <span
                  style={{
                    fontSize:   theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color:      colors.primary,   // bleu selon le theme
                  }}
                >
                  ${EXPORT_PREVIEW.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Badge statut Approved */}
            <div
              style={{
                display:         "flex",
                alignItems:      "center",
                gap:             theme.spacing[2],   // 8px
                backgroundColor: colors.successBg,
                border:          `1px solid ${colors.success}`,
                borderRadius:    theme.radius.md,
                padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
              }}
            >
              {/* Point vert */}
              <span
                style={{
                  width:           "8px",
                  height:          "8px",
                  borderRadius:    theme.radius.round,  // 50%
                  backgroundColor: colors.success,
                  flexShrink:      0,
                }}
              />
              <span
                style={{
                  fontSize: theme.fontSize.sm,
                  color:    colors.success,
                }}
              >
                Validation status : <strong>Approved</strong>
              </span>
            </div>

            {/* Boutons d'action */}
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                gap:           theme.spacing[2],  // 8px
              }}
            >
              {/* Export — format défini lors de l'upload */}
              <Button
                label={isExporting ? "Exporting..." : "⬇ Export"}
                variant="primary"
                size="md"
                fullWidth
                onClick={handleExport}
                disabled={isExporting}
              />

              {/* Nouveau document → retour Upload */}
              <Button
                label="+ New Document"
                variant="secondary"
                size="md"
                fullWidth
                onClick={() => navigate(ROUTES.UPLOAD)}
              />
            </div>
          </div>

          {/* ── COLONNE DROITE — Preview ───────────
              Aperçu du fichier avant export
              Fond sombre fixe style terminal      */}
          <div
            style={{
              backgroundColor: colors.bgSurface,
              borderRadius:    theme.radius.lg,
              border:          `1px solid ${colors.border}`,
              padding:         theme.spacing[5],
              display:         "flex",
              flexDirection:   "column",
              gap:             theme.spacing[3],
            }}
          >
            <h2
              style={{
                fontSize:   theme.fontSize.lg,
                fontWeight: theme.fontWeight.bold,
                color:      colors.textPrimary,
                margin:     0,
              }}
            >
              {/* Icône code */}
              <span
                style={{
                  fontSize:   theme.fontSize.sm,
                  color:      colors.textSecondary,
                  fontFamily: theme.fontFamily.mono,
                }}
              >
                {"</>"}{" "}
              </span>
              Preview
            </h2>

            {/* Bloc terminal — fond sombre fixe (style éditeur de code)
                Les couleurs fixes ici sont intentionnelles —
                un terminal reste sombre même en mode light         */}
            <div
              style={{
                flex:            1,
                backgroundColor: "#1e1e2e",     // fond sombre fixe — style terminal
                borderRadius:    theme.radius.md,
                padding:         theme.spacing[4],
                overflow:        "auto",
                minHeight:       "400px",
              }}
            >
              <pre
                style={{
                  margin:     0,
                  fontSize:   theme.fontSize.sm,
                  lineHeight: "1.7",
                  fontFamily: theme.fontFamily.mono,  // police monospace
                  color:      "#cdd6f4",              // blanc cassé fixe sur fond sombre
                  whiteSpace: "pre-wrap",
                  wordBreak:  "break-word",
                }}
              >
                {JSON.stringify(EXPORT_PREVIEW, null, 2)}
              </pre>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}