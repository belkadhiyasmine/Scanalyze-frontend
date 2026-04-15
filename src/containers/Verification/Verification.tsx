// ─────────────────────────────────────────────
//  containers/Verification/Verification.tsx
//  Page privée — Parent Component
//  Rôle : vérifier et valider les données
//         extraites d'un document scanné
//  Composants enfants :
//  → TextInput : champs éditables
//  → Button    : Skip, Correct, Approve
//  → Loader    : spinner pendant l'approbation
//  Hooks :
//  → useState  : états des champs et ligne items
//  → useTheme  : theme actif (light/dark)
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useState }    from "react"
import { useNavigate } from "react-router-dom"
import { useTheme }    from "../../themes/ThemeContext"

import TextInput from "../../components/TextInput/TextInput"
import Button    from "../../components/Button/Button"
import Loader    from "../../components/Loader/Loader"

import { ROUTES }   from "../../navigation/routes"
import { LineItem } from "../../types"

// ─────────────────────────────────────────────
//  DONNÉES FICTIVES
//  Remplacées plus tard par les vraies données
//  retournées par le pipeline OCR
// ─────────────────────────────────────────────

const INITIAL_LINE_ITEMS: LineItem[] = [
  { id: 1, description: "Shipping & Handling",  qty: 1, price: 45.0  },
  { id: 2, description: "Express Delivery Fee", qty: 1, price: 12.5  },
]

// Devises disponibles dans le select
const CURRENCIES = [
  "USD - US Dollar",
  "EUR - Euro",
  "GBP - British Pound",
  "TND - Tunisian Dinar",
]

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Verification() {
  const navigate  = useNavigate()

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ─────────────────────────────────────────
  //  STATES — champs éditables
  // ─────────────────────────────────────────

  const [vendorName,    setVendorName]    = useState<string>("Global Logistics Inc.")
  const [invoiceDate,   setInvoiceDate]   = useState<string>("2023-10-14")
  const [invoiceNumber, setInvoiceNumber] = useState<string>("INV-2023-094")
  const [currency,      setCurrency]      = useState<string>("USD - US Dollar")
  const [lineItems,     setLineItems]     = useState<LineItem[]>(INITIAL_LINE_ITEMS)

  // false = date suspecte (warning orange affiché)
  // true  = date corrigée (warning masqué)
  const [dateFixed,   setDateFixed]   = useState<boolean>(false)

  // true pendant l'approbation → affiche Loader pleine page
  const [isApproving, setIsApproving] = useState<boolean>(false)

  // ─────────────────────────────────────────
  //  CALCULS — totaux de la facture
  // ─────────────────────────────────────────

  // Somme de (quantité × prix) pour chaque ligne
  const subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.price, 0)
  const tax      = 0                  // pas de taxe pour l'instant
  const total    = subtotal + tax

  // ─────────────────────────────────────────
  //  FONCTIONS — gestion des lignes
  // ─────────────────────────────────────────

  // Met à jour un champ précis d'une ligne précise
  // [field] = clé dynamique ex: item["qty"] = 2
  const updateLineItem = (id: number, field: keyof LineItem, value: string) => {
    setLineItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              // qty et price → convertis en number
              // description → garde string
              [field]: field === "qty" || field === "price"
                ? parseFloat(value) || 0
                : value,
            }
          : item
      )
    )
  }

  // Ajoute une nouvelle ligne vide en bas du tableau
  const addLineItem = () => {
    const newId = lineItems.length + 1
    setLineItems(prev => [...prev, { id: newId, description: "", qty: 1, price: 0 }])
  }

  // Supprime la ligne dont l'id correspond
  const removeLineItem = (id: number) => {
    setLineItems(prev => prev.filter(item => item.id !== id))
  }

  // Formate un nombre en monnaie ex: 1240.5 → "1,240.50"
  const formatMoney = (n: number): string =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  // ─────────────────────────────────────────
  //  ACTIONS — boutons footer
  // ─────────────────────────────────────────

  // Simule un appel API puis redirige vers Export
  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await new Promise(res => setTimeout(res, 1000))
      navigate(ROUTES.EXPORT)
    } catch {
      alert("Erreur lors de l'approbation.")
    } finally {
      setIsApproving(false)
    }
  }

  // Ignore ce document → retourne à Upload
  const handleSkip = () => navigate(ROUTES.UPLOAD)

  // Applique la suggestion IA → marque la date comme corrigée
  const handleCorrect = () => {
    setInvoiceDate("2023-10-14")
    setDateFixed(true)
  }

  // ─────────────────────────────────────────
  //  RENDU
  // ─────────────────────────────────────────

  return (
    <div
      style={{
        display:         "flex",
        flexDirection:   "column",
        minHeight:       "100vh",
        backgroundColor: colors.bgApp,         // fond général selon le theme
        fontFamily:      theme.fontFamily.sans, // depuis typography.ts
      }}
    >

      {/* ── Loader pleine page ─────────────────
          Affiché par dessus tout pendant
          l'approbation                          */}
      {isApproving && (
        <Loader fullPage label="Approbation en cours..." />
      )}

      {/* ── Header ─────────────────────────────
          Logo + breadcrumb + avatar utilisateur */}
      <header
        style={{
          display:         "flex",
          justifyContent:  "space-between",
          alignItems:      "center",
          backgroundColor: colors.bgSurface,         // blanc light / sombre dark
          borderBottom:    `1px solid ${colors.border}`,
          padding:         `${theme.spacing[3]} ${theme.spacing[6]}`, // 12px 24px
        }}
      >
        {/* Gauche : Logo + Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[5] }}>

          {/* Logo Scanalyze */}
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
            <div
              style={{
                width:           "30px",
                height:          "30px",
                backgroundColor: colors.primary,   // bleu selon le theme
                borderRadius:    theme.radius.sm,
                display:         "flex",
                alignItems:      "center",
                justifyContent:  "center",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 52 52" fill="none">
                <path
                  d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
                  fill="white"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize:   theme.fontSize.md,
                fontWeight: theme.fontWeight.bold,
                color:      colors.textPrimary,
              }}
            >
              Scanalyze
            </span>
          </div>

          {/* Breadcrumb — Batch › Doc */}
          <div
            style={{
              display:    "flex",
              alignItems: "center",
              gap:        theme.spacing[1],
              fontSize:   theme.fontSize.sm,
            }}
          >
            <span
              style={{ color: colors.textSecondary, cursor: "pointer" }}
            >
              Batch 402
            </span>
            <span style={{ color: colors.borderStrong }}>›</span>
            <span
              style={{
                color:      colors.textPrimary,
                fontWeight: theme.fontWeight.medium,
              }}
            >
              Doc #12941
            </span>
          </div>
        </div>

        {/* Droite : Nom + Avatar utilisateur */}
        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
          <span
            style={{
              fontSize:   theme.fontSize.sm,
              fontWeight: theme.fontWeight.medium,
              color:      colors.textPrimary,
            }}
          >
            Alex Carter
          </span>

          {/* Avatar circulaire avec initiales */}
          <div
            style={{
              width:           "32px",
              height:          "32px",
              borderRadius:    theme.radius.round,   // 50%
              backgroundColor: colors.primary,
              color:           colors.textInverse,   // blanc
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              fontSize:        theme.fontSize.xs,
              fontWeight:      theme.fontWeight.bold,
            }}
          >
            AC
          </div>
        </div>
      </header>

      {/* ── Corps — 2 colonnes ─────────────────*/}
      <div style={{ display: "flex", flex: 1 }}>

        {/* ── COLONNE GAUCHE — Aperçu document ──
            Simulation visuelle du document scanné */}
        <div
          style={{
            width:         "45%",
            backgroundColor: colors.bgApp,
            borderRight:   `1px solid ${colors.border}`,
            padding:       theme.spacing[4],
            display:       "flex",
            flexDirection: "column",
          }}
        >
          {/* Pagination */}
          <p
            style={{
              fontSize: theme.fontSize.sm,
              color:    colors.textSecondary,
              margin:   `0 0 ${theme.spacing[3]}`,
            }}
          >
            Page 1 of 1
          </p>

          {/* Carte aperçu document */}
          <div
            style={{
              flex:            1,
              backgroundColor: colors.bgSurface,
              borderRadius:    theme.radius.md,
              border:          `1px solid ${colors.border}`,
              padding:         theme.spacing[5],
            }}
          >
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                gap:           theme.spacing[4],
              }}
            >

              {/* En-tête simulé : logo placeholder + "INVOICE" */}
              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "flex-start",
                }}
              >
                {/* Placeholder logo */}
                <div
                  style={{
                    width:           "60px",
                    height:          "40px",
                    backgroundColor: colors.bgHover,
                    borderRadius:    theme.radius.sm,
                  }}
                />
                <p
                  style={{
                    fontSize:      "18px",
                    fontWeight:    theme.fontWeight.bold,
                    color:         colors.borderStrong,
                    margin:        0,
                    letterSpacing: "2px",
                  }}
                >
                  INVOICE
                </p>
              </div>

              {/* Lignes de texte simulées */}
              <div
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  gap:           theme.spacing[2],
                }}
              >
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "60%"  }} />
              </div>

              {/* Zone date — badge orange (confiance faible) */}
              <div
                style={{
                  display:        "flex",
                  justifyContent: "space-between",
                  alignItems:     "center",
                  gap:            theme.spacing[3],
                }}
              >
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "40%" }} />
                <div
                  style={{
                    border:          "2px solid #f59e0b",  // orange fixe — couleur warning spécifique
                    borderRadius:    theme.radius.sm,
                    padding:         `4px ${theme.spacing[2]}`,
                    backgroundColor: "#fffbeb",
                  }}
                >
                  <p
                    style={{
                      fontSize:   theme.fontSize.xs,
                      color:      "#b45309",              // orange foncé fixe
                      margin:     0,
                      fontWeight: theme.fontWeight.medium,
                    }}
                  >
                    Invoice Date (?)
                  </p>
                </div>
              </div>

              {/* Autres lignes simulées */}
              <div
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  gap:           theme.spacing[2],
                }}
              >
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "100%" }} />
                <div style={{ height: "8px", backgroundColor: colors.bgHover, borderRadius: theme.radius.sm, width: "80%"  }} />
              </div>

              {/* Zone montant total — badge bleu */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div
                  style={{
                    border:          "2px solid #2563eb",  // bleu fixe
                    borderRadius:    theme.radius.sm,
                    padding:         `4px ${theme.spacing[4]}`,
                    backgroundColor: "#eff6ff",
                  }}
                >
                  <p
                    style={{
                      fontSize:   theme.fontSize.sm,
                      color:      "#1d4ed8",               // bleu foncé fixe
                      margin:     0,
                      fontWeight: theme.fontWeight.semibold,
                    }}
                  >
                    Total Amount
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de raccourcis clavier — fond sombre fixe */}
          <div
            style={{
              display:         "flex",
              alignItems:      "center",
              gap:             theme.spacing[4],
              marginTop:       theme.spacing[3],
              backgroundColor: "#1f2937",        // fond sombre fixe — barre clavier
              borderRadius:    theme.radius.md,
              padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
            }}
          >
            {/* Raccourci TAB */}
            <span
              style={{
                fontSize:   theme.fontSize.sm,
                color:      "#9ca3af",
                display:    "flex",
                alignItems: "center",
                gap:        theme.spacing[1],
              }}
            >
              <kbd
                style={{
                  backgroundColor: "#374151",
                  color:           "#f9fafb",
                  padding:         "2px 6px",
                  borderRadius:    theme.radius.sm,
                  fontSize:        theme.fontSize.xs,
                  fontFamily:      theme.fontFamily.mono,
                  border:          "1px solid #4b5563",
                }}
              >
                TAB
              </kbd>
              Next Field
            </span>

            {/* Raccourci ALT+Z */}
            <span
              style={{
                fontSize:   theme.fontSize.sm,
                color:      "#9ca3af",
                display:    "flex",
                alignItems: "center",
                gap:        theme.spacing[1],
              }}
            >
              <kbd
                style={{
                  backgroundColor: "#374151",
                  color:           "#f9fafb",
                  padding:         "2px 6px",
                  borderRadius:    theme.radius.sm,
                  fontSize:        theme.fontSize.xs,
                  fontFamily:      theme.fontFamily.mono,
                  border:          "1px solid #4b5563",
                }}
              >
                ALT+Z
              </kbd>
              Zoom
            </span>

            {/* Progression du batch */}
            <span
              style={{
                fontSize:   theme.fontSize.sm,
                color:      "#6b7280",
                marginLeft: "auto",
              }}
            >
              Batch Progress: 44/110
            </span>
          </div>
        </div>

        {/* ── COLONNE DROITE — Verification Editor ──
            Formulaire de vérification et correction  */}
        <div
          style={{
            flex:          1,
            padding:       `${theme.spacing[5]} ${theme.spacing[6]}`,
            overflowY:     "auto",
            display:       "flex",
            flexDirection: "column",
            gap:           theme.spacing[4],
          }}
        >

          {/* Titre + badge issues */}
          <div
            style={{
              display:        "flex",
              justifyContent: "space-between",
              alignItems:     "center",
            }}
          >
            <h2
              style={{
                fontSize:   theme.fontSize.xl,
                fontWeight: theme.fontWeight.bold,
                color:      colors.textPrimary,
                margin:     0,
              }}
            >
              Verification Editor
            </h2>

            {/* Badge warning — couleurs fixes orange */}
            <span
              style={{
                fontSize:        theme.fontSize.sm,
                fontWeight:      theme.fontWeight.semibold,
                backgroundColor: "#fef3c7",
                color:           "#b45309",
                border:          "1px solid #fde68a",
                borderRadius:    theme.radius.md,
                padding:         `4px ${theme.spacing[2]}`,
              }}
            >
              2 ISSUES FOUND
            </span>
          </div>

          {/* ── SECTION 1 — Header Information ─────
              Vendor, Date, Invoice#, Currency     */}
          <div
            style={{
              backgroundColor: colors.bgSurface,
              borderRadius:    theme.radius.lg,
              border:          `1px solid ${colors.border}`,
              padding:         theme.spacing[4],
              display:         "flex",
              flexDirection:   "column",
              gap:             theme.spacing[3],
            }}
          >
            {/* Label section */}
            <p
              style={{
                fontSize:      theme.fontSize.xs,
                fontWeight:    theme.fontWeight.bold,
                color:         colors.textSecondary,
                letterSpacing: theme.letterSpacing.wider,
                margin:        0,
              }}
            >
              📋 HEADER INFORMATION
            </p>

            {/* Vendor Name + icône validation */}
            <div style={{ position: "relative" }}>
              <TextInput
                label="Vendor Name"
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                fullWidth
              />
              {/* Icône ✅ positionnée en absolu à droite */}
              <span
                style={{
                  position: "absolute",
                  right:    theme.spacing[3],  // 12px
                  bottom:   theme.spacing[2],  // 8px
                  fontSize: "14px",
                }}
              >
                ✅
              </span>
            </div>

            {/* Invoice Date — input type="date" natif
                Bordure orange si non corrigée, normale sinon */}
            <div
              style={{
                display:       "flex",
                flexDirection: "column",
                gap:           theme.spacing[1],
              }}
            >
              <label
                style={{
                  fontSize:   theme.fontSize.sm,
                  fontWeight: theme.fontWeight.medium,
                  color:      colors.textPrimary,
                }}
              >
                Invoice Date
              </label>

              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => {
                  setInvoiceDate(e.target.value)
                  setDateFixed(true)   // marque comme corrigée
                }}
                style={{
                  width:           "100%",
                  padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                  fontSize:        theme.fontSize.sm,
                  // Bordure orange si date suspecte, normale si corrigée
                  border:          `1.5px solid ${dateFixed ? colors.border : "#f59e0b"}`,
                  // Fond jaune si suspecte, normal si corrigée
                  backgroundColor: dateFixed ? colors.bgInput : "#fffbeb",
                  borderRadius:    theme.radius.md,
                  outline:         "none",
                  color:           colors.textPrimary,
                  boxSizing:       "border-box",
                  transition:      "border-color 0.15s",
                  fontFamily:      theme.fontFamily.sans,
                }}
              />

              {/* Warning confiance faible — masqué si date corrigée */}
              {!dateFixed && (
                <>
                  {/* Badge confiance faible */}
                  <div
                    style={{
                      fontSize:        theme.fontSize.xs,
                      color:           "#b45309",
                      backgroundColor: "#fef3c7",
                      border:          "1px solid #fde68a",
                      borderRadius:    theme.radius.sm,
                      padding:         `3px ${theme.spacing[2]}`,
                      display:         "inline-block",
                    }}
                  >
                    ⚠️ Low Confidence (62%)
                  </div>

                  {/* Message de correction suggérée */}
                  <div
                    style={{
                      display:         "flex",
                      gap:             theme.spacing[2],
                      alignItems:      "flex-start",
                      backgroundColor: "#fffbeb",
                      border:          "1px solid #fde68a",
                      borderRadius:    theme.radius.md,
                      padding:         theme.spacing[2],
                    }}
                  >
                    <span>⚠</span>
                    <p
                      style={{
                        fontSize:   theme.fontSize.sm,
                        color:      "#92400e",
                        margin:     0,
                        lineHeight: "1.5",
                      }}
                    >
                      <strong>CORRECTION NEEDED:</strong> IA suggested 'Oct 14, 2023',
                      OCR read 'Oct 14, 202x'
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Invoice# + Currency — grille 2 colonnes */}
            <div
              style={{
                display:             "grid",
                gridTemplateColumns: "1fr 1fr",
                gap:                 theme.spacing[3],
              }}
            >
              {/* Numéro de facture */}
              <TextInput
                label="Invoice #"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                fullWidth
              />

              {/* Devise — select natif */}
              <div
                style={{
                  display:       "flex",
                  flexDirection: "column",
                  gap:           theme.spacing[1],
                }}
              >
                <label
                  style={{
                    fontSize:   theme.fontSize.sm,
                    fontWeight: theme.fontWeight.medium,
                    color:      colors.textPrimary,
                  }}
                >
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{
                    width:           "100%",
                    padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                    fontSize:        theme.fontSize.sm,
                    border:          `1px solid ${colors.border}`,
                    borderRadius:    theme.radius.md,
                    outline:         "none",
                    color:           colors.textPrimary,
                    backgroundColor: colors.bgInput,
                    boxSizing:       "border-box",
                    cursor:          "pointer",
                    fontFamily:      theme.fontFamily.sans,
                  }}
                >
                  {CURRENCIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION 2 — Line Items ──────────────
              Tableau éditable des lignes de facture */}
          <div
            style={{
              backgroundColor: colors.bgSurface,
              borderRadius:    theme.radius.lg,
              border:          `1px solid ${colors.border}`,
              padding:         theme.spacing[4],
              display:         "flex",
              flexDirection:   "column",
              gap:             theme.spacing[3],
            }}
          >
            {/* En-tête section + bouton ajout */}
            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
              }}
            >
              <p
                style={{
                  fontSize:      theme.fontSize.xs,
                  fontWeight:    theme.fontWeight.bold,
                  color:         colors.textSecondary,
                  letterSpacing: theme.letterSpacing.wider,
                  margin:        0,
                }}
              >
                📦 LINE ITEMS
              </p>
              <Button
                label="+ Add Row"
                variant="ghost"
                size="sm"
                onClick={addLineItem}
              />
            </div>

            {/* Tableau des lignes */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    display:      "flex",
                    padding:      `${theme.spacing[1]} 0`,
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  <th style={{ ...thStyle(theme, colors), flex: 4 }}>Description</th>
                  <th style={{ ...thStyle(theme, colors), flex: 1 }}>Qty</th>
                  <th style={{ ...thStyle(theme, colors), flex: 2 }}>Price</th>
                  <th style={{ ...thStyle(theme, colors), flex: 2 }}>Total</th>
                  <th style={{ ...thStyle(theme, colors), flex: 1 }}></th>
                </tr>
              </thead>
              <tbody>
                {lineItems.map(item => (
                  <tr
                    key={item.id}
                    style={{
                      display:      "flex",
                      alignItems:   "center",
                      padding:      `${theme.spacing[1]} 0`,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    {/* Description */}
                    <td style={{ flex: 4, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="text"
                        value={item.description}
                        onChange={e => updateLineItem(item.id, "description", e.target.value)}
                        style={tableInputStyle(theme, colors)}
                      />
                    </td>

                    {/* Quantité */}
                    <td style={{ flex: 1, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="number"
                        value={item.qty}
                        onChange={e => updateLineItem(item.id, "qty", e.target.value)}
                        style={tableInputStyle(theme, colors)}
                        min="1"
                      />
                    </td>

                    {/* Prix unitaire */}
                    <td style={{ flex: 2, padding: `0 ${theme.spacing[1]}` }}>
                      <input
                        type="number"
                        value={item.price}
                        onChange={e => updateLineItem(item.id, "price", e.target.value)}
                        style={tableInputStyle(theme, colors)}
                        step="0.01"
                      />
                    </td>

                    {/* Total ligne (calculé automatiquement) */}
                    <td
                      style={{
                        flex:     2,
                        padding:  `0 ${theme.spacing[1]}`,
                        fontSize: theme.fontSize.sm,
                        color:    colors.textPrimary,
                      }}
                    >
                      ${formatMoney(item.qty * item.price)}
                    </td>

                    {/* Bouton suppression */}
                    <td style={{ flex: 1, padding: `0 ${theme.spacing[1]}` }}>
                      <button
                        onClick={() => removeLineItem(item.id)}
                        style={{
                          background: "none",
                          border:     "none",
                          color:      colors.textSecondary,
                          cursor:     "pointer",
                          fontSize:   "12px",
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totaux — Subtotal / Tax / Total */}
            <div
              style={{
                borderTop:     `1px solid ${colors.border}`,
                paddingTop:    theme.spacing[2],
                display:       "flex",
                flexDirection: "column",
                gap:           theme.spacing[1],
              }}
            >
              {/* Subtotal */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: theme.fontSize.sm, color: colors.textSecondary }}>Subtotal</span>
                <span style={{ fontSize: theme.fontSize.sm, color: colors.textPrimary }}>${formatMoney(subtotal)}</span>
              </div>

              {/* Tax */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: theme.fontSize.sm, color: colors.textSecondary }}>Tax (0%)</span>
                <span style={{ fontSize: theme.fontSize.sm, color: colors.textPrimary }}>${formatMoney(tax)}</span>
              </div>

              {/* Total — mis en valeur */}
              <div
                style={{
                  display:       "flex",
                  justifyContent: "space-between",
                  borderTop:     `1px solid ${colors.border}`,
                  paddingTop:    theme.spacing[2],
                  marginTop:     theme.spacing[1],
                }}
              >
                <span
                  style={{
                    fontSize:   theme.fontSize.lg,
                    fontWeight: theme.fontWeight.bold,
                    color:      colors.textPrimary,
                  }}
                >
                  Total Amount
                </span>
                <span
                  style={{
                    fontSize:   theme.fontSize.xl,
                    fontWeight: theme.fontWeight.bold,
                    color:      colors.primary,      // bleu selon le theme
                  }}
                >
                  ${formatMoney(total)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Barre d'actions ─────────────────────
              Skip / Correct / Approve              */}
          <div
            style={{
              display:        "flex",
              justifyContent: "flex-end",
              gap:            theme.spacing[2],
              paddingTop:     theme.spacing[1],
            }}
          >
            {/* Ignore le document → retour Upload */}
            <Button
              label="▶ Skip  ALT+S"
              variant="ghost"
              size="md"
              onClick={handleSkip}
            />

            {/* Applique la correction IA */}
            <Button
              label="✎ Correct  ALT+C"
              variant="secondary"
              size="md"
              onClick={handleCorrect}
            />

            {/* Approuve et passe à Export */}
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

// ─────────────────────────────────────────────
//  HELPERS DE STYLE
//  Fonctions qui retournent des styles
//  Reçoivent theme ET colors pour être
//  cohérents avec le reste de la page
// ─────────────────────────────────────────────

// Style des en-têtes de colonnes du tableau
const thStyle = (theme: any, colors: any): React.CSSProperties => ({
  fontSize:   theme.fontSize.sm,
  fontWeight: theme.fontWeight.semibold,
  color:      colors.textSecondary,   // gris selon le theme
  flex:       1,
  textAlign:  "left",
  padding:    `0 ${theme.spacing[1]}`,
})

// Style des inputs dans les cellules du tableau
// Petits, fond transparent, sans bordure visible au repos
const tableInputStyle = (theme: any, colors: any): React.CSSProperties => ({
  width:           "100%",
  padding:         `${theme.spacing[1]} ${theme.spacing[2]}`,
  fontSize:        theme.fontSize.sm,
  border:          `1px solid ${colors.border}`,
  borderRadius:    theme.radius.sm,
  outline:         "none",
  color:           colors.textPrimary,
  backgroundColor: colors.bgApp,         // fond légèrement différent de la carte
  boxSizing:       "border-box",
  fontFamily:      theme.fontFamily.sans,
})