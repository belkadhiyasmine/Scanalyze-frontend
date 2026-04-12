// ─────────────────────────────────────────────
//  containers/Upload/Upload.tsx
//  Page privée — Parent Component
//  Rôle : permettre l'upload de documents
//         via drag & drop ou sélection fichier
//  Composants enfants :
//  → Sidebar : navigation
//  → Toast   : notification après upload
//  → Button  : boutons d'action
//  → Loader  : spinner pendant l'upload
//  Hooks :
//  → useState  : états (fichier, format, drag...)
//  → useRef    : référence vers l'input file caché
//  → useTheme  : theme actif
// ─────────────────────────────────────────────

import { useState, useRef }  from "react"
import { useNavigate }       from "react-router-dom"
import { useTheme }          from "../../themes/ThemeContext"

// ── Composants ────────────────────────────────
import Sidebar  from "../../components/Sidebar/Sidebar"
import Toast    from "../../components/Toast/Toast"
import Button   from "../../components/Button/Button"
import Loader   from "../../components/Loader/Loader"

// ── Navigation + Types ────────────────────────
import { ROUTES }        from "../../navigation/routes"
import { ExportFormat }  from "../../types"

// ─────────────────────────────────────────────
export default function Upload() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  // ── États ────────────────────────────────────
  const [activeMenu,    setActiveMenu]    = useState<string>("upload")
  const [dragOver,      setDragOver]      = useState<boolean>(false)     // survol drag&drop
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null)  // fichier choisi
  const [outputFormat,  setOutputFormat]  = useState<ExportFormat>("JSON")
  const [showToast,     setShowToast]     = useState<boolean>(false)
  const [toastMsg,      setToastMsg]      = useState<string>("")
  const [isUploading,   setIsUploading]   = useState<boolean>(false)

  // useRef → référence directe vers l'input file caché dans le DOM
  // Permet de déclencher le clic programmatiquement
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Types de fichiers acceptés ────────────────
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ]
  const MAX_SIZE_MB = 20  // limite de taille en MB

  // ── Validation du fichier ─────────────────────
  // Vérifie le type et la taille avant d'accepter
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Format non supporté. Utilisez PDF, JPG, PNG, CSV ou XLSX.")
      return false
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Fichier trop lourd. Maximum ${MAX_SIZE_MB}MB.`)
      return false
    }
    return true
  }

  // ── Sélection via bouton ──────────────────────
  // e.target.files?.[0] → premier fichier sélectionné
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && validateFile(file)) setSelectedFile(file)
  }

  // ── Drag & Drop ───────────────────────────────
  // e.preventDefault() → empêche le navigateur d'ouvrir le fichier
  const handleDragOver  = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(true)
  }
  const handleDragLeave = () => setDragOver(false)
  const handleDrop      = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]  // récupère le fichier déposé
    if (file && validateFile(file)) setSelectedFile(file)
  }

  // ── Supprimer le fichier sélectionné ──────────
  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""  // reset l'input
  }

  // ── Afficher un Toast ─────────────────────────
  // Affiche le message 3 secondes puis disparaît
  const triggerToast = (msg: string) => {
    setToastMsg(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  // ── Formater la taille du fichier ─────────────
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024)            return `${bytes} B`
    if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`
    return                              `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // ── Icône selon le type de fichier ────────────
  const getFileIcon = (file: File): string => {
    if (file.type === "application/pdf")  return "📕"
    if (file.type.includes("image"))      return "🖼️"
    if (file.type.includes("csv"))        return "📊"
    if (file.type.includes("sheet"))      return "📗"
    return "📄"
  }

  // ── Clic NEXT → upload + navigation ──────────
  const handleNext = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier d'abord.")
      return
    }
    setIsUploading(true)
    try {
      // TODO : remplacer par le vrai appel API
      // const formData = new FormData()
      // formData.append("file", selectedFile)
      // formData.append("outputFormat", outputFormat)
      // await axios.post("/api/documents/upload", formData)

      await new Promise((res) => setTimeout(res, 1500))  // simulation
      triggerToast(`Document '${selectedFile.name}' has been queued.`)
      setTimeout(() => navigate(ROUTES.EDITOR), 1500)    // redirige après toast

    } catch {
      alert("Erreur lors de l'upload. Réessayez.")
    } finally {
      setIsUploading(false)
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

      {/* ── Loader pleine page pendant l'upload ── */}
      {isUploading && <Loader fullPage label="Upload en cours..." />}

      {/* ── Sidebar ── */}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={(menu: string) => setActiveMenu(menu)}
      />

      {/* ── Contenu principal ── */}
      <main style={{
        flex:    1,
        padding: `${theme.spacing[7]} ${theme.spacing[10]}`,
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
            Uploads
          </span>
        </div>

        {/* Titre + Sous-titre */}
        <h1 style={{
          fontSize:      theme.fontSize.xxl,
          fontWeight:    theme.fontWeight.extrabold,
          color:         "var(--color-text-primary)",
          margin:        `0 0 ${theme.spacing[1]}`,
          letterSpacing: theme.letterSpacing.wide,
        }}>
          DOCUMENT MANAGEMENT
        </h1>
        <p style={{
          fontSize:     theme.fontSize.md,
          color:        "var(--color-text-secondary)",
          margin:       `0 0 ${theme.spacing[6]}`,
        }}>
          Centralized hub for file ingestion and processing status.
        </p>

        {/* ── Zone Drag & Drop ─────────────────
            Style change si dragOver = true
            onDragOver / onDrop → gèrent le drag&drop  */}
        <div
          style={{
            border:          `2px dashed ${dragOver ? theme.colors.primary : "var(--color-border-strong)"}`,
            borderRadius:    theme.radius.lg,
            padding:         `${theme.spacing[12]} ${theme.spacing[6]}`,
            textAlign:       "center",
            transition:      "all var(--transition-normal)",
            cursor:          "pointer",
            backgroundColor: dragOver
              ? "var(--color-primary-light)"   // fond bleu clair au survol
              : "var(--color-bg-app)",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Icône upload */}
          <div style={{
            width:           "64px",
            height:          "64px",
            borderRadius:    theme.radius.round,
            backgroundColor: "var(--color-primary-light)",
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            margin:          `0 auto ${theme.spacing[4]}`,
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill={theme.colors.primary}>
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
          </div>

          <p style={{ fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: "var(--color-text-primary)", margin: `0 0 ${theme.spacing[2]}` }}>
            Drag and drop files here
          </p>
          <p style={{ fontSize: theme.fontSize.base, color: "var(--color-text-secondary)", margin: `0 0 ${theme.spacing[5]}`, lineHeight: "1.6" }}>
            Supports PDF, XLSX, and CSV files up to 20MB.<br />
            Your files will be automatically scanned for data extraction.
          </p>

          {/* Bouton sélection — déclenche l'input caché */}
          <Button
            label="+ SELECT FILES FROM COMPUTER"
            variant="primary"
            size="md"
            onClick={() => fileInputRef.current?.click()}
          />

          {/* Input file caché — déclenché par le bouton ci-dessus */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
            onChange={handleFileSelect}
          />
        </div>

        {/* ── Aperçu du fichier sélectionné ────
            Affiché seulement si selectedFile != null */}
        {selectedFile && (
          <div style={{
            display:         "flex",
            alignItems:      "center",
            gap:             theme.spacing[3],
            backgroundColor: "var(--color-bg-surface)",
            border:          "1px solid var(--color-border)",
            borderRadius:    theme.radius.md,
            padding:         `${theme.spacing[3]} ${theme.spacing[4]}`,
            marginTop:       theme.spacing[4],
          }}>
            {/* Icône selon le type */}
            <span style={{ fontSize: "24px" }}>{getFileIcon(selectedFile)}</span>

            {/* Nom + taille */}
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium, color: "var(--color-text-primary)", margin: `0 0 ${theme.spacing[1]}` }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: theme.fontSize.sm, color: "var(--color-text-secondary)", margin: 0 }}>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>

            {/* Bouton supprimer */}
            <button
              onClick={handleRemoveFile}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", fontSize: "16px" }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Barre bas : format + bouton NEXT ── */}
        <div style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "flex-end",
          gap:            theme.spacing[3],
          marginTop:      theme.spacing[6],
        }}>
          {/* Sélecteur format de sortie */}
          <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
            <span style={{ fontSize: theme.fontSize.sm, fontWeight: theme.fontWeight.semibold, color: "var(--color-text-secondary)", letterSpacing: theme.letterSpacing.wide }}>
              OUTPUT FORMAT
            </span>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value as ExportFormat)}
              style={{
                padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                border:          "1px solid var(--color-border)",
                borderRadius:    theme.radius.md,
                backgroundColor: "var(--color-bg-surface)",
                color:           "var(--color-text-primary)",
                fontSize:        theme.fontSize.sm,
                fontWeight:      theme.fontWeight.semibold,
                outline:         "none",
                cursor:          "pointer",
              }}
            >
              <option value="JSON">JSON</option>
              <option value="CSV">CSV</option>
              <option value="XML">XML</option>
            </select>
          </div>

          {/* Bouton NEXT — Button remplace <button> natif */}
          <Button
            label={isUploading ? "Uploading..." : "NEXT →"}
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={isUploading}
          />
        </div>

      </main>

      {/* ── Toast notification ────────────────
          Affiché seulement si showToast = true
          onClose → cache le toast immédiatement */}
      {showToast && (
        <Toast
          message={toastMsg}
          onClose={() => setShowToast(false)}
        />
      )}

    </div>
  )
}