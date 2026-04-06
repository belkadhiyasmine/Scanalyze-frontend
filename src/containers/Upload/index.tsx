// ─────────────────────────────────────────────
//  pages/Upload/Upload.tsx
//  Page privée — Parent Component
//  Utilise : Sidebar, Toast
// ─────────────────────────────────────────────

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Toast from "../../components/Toast/Toast";
import { ROUTES } from "../../navigation/routes";
import { ExportFormat } from "../../types";

// ─────────────────────────────────────────────
export default function Upload() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [activeMenu, setActiveMenu]     = useState<string>("upload");
  const [dragOver, setDragOver]         = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<ExportFormat>("JSON");
  const [showToast, setShowToast]       = useState<boolean>(false);
  const [toastMsg, setToastMsg]         = useState<string>("");
  const [isUploading, setIsUploading]   = useState<boolean>(false);

  // Référence vers l'input file caché
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Types de fichiers acceptés ────────────────
  const ALLOWED_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const MAX_SIZE_MB = 20;

  // ── Validation fichier ────────────────────────
  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Format non supporté. Utilisez PDF, JPG, PNG, CSV ou XLSX.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Fichier trop lourd. Maximum ${MAX_SIZE_MB}MB.`);
      return false;
    }
    return true;
  };

  // ── Sélection via bouton ──────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  // ── Drag & Drop ───────────────────────────────
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setSelectedFile(file);
  };

  // ── Supprimer le fichier ──────────────────────
  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Toast ─────────────────────────────────────
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ── Taille lisible ────────────────────────────
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ── Icône selon type ──────────────────────────
  const getFileIcon = (file: File): string => {
    if (file.type === "application/pdf") return "📕";
    if (file.type.includes("image")) return "🖼️";
    if (file.type.includes("csv")) return "📊";
    if (file.type.includes("sheet")) return "📗";
    return "📄";
  };

  // ── Clic NEXT ─────────────────────────────────
  const handleNext = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier d'abord.");
      return;
    }

    setIsUploading(true);
    try {
      // TODO : remplacer par votre vrai appel API
      // const formData = new FormData();
      // formData.append("file", selectedFile);
      // formData.append("outputFormat", outputFormat);
      // await axios.post("/api/documents/upload", formData);

      await new Promise((res) => setTimeout(res, 1500));
      triggerToast(`Document '${selectedFile.name}' has been queued.`);
      setTimeout(() => navigate(ROUTES.EDITOR), 1500);

    } catch (err) {
      alert("Erreur lors de l'upload. Réessayez.");
    } finally {
      setIsUploading(false);
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
          <span style={styles.current}>Uploads</span>
        </div>

        {/* Titre */}
        <h1 style={styles.pageTitle}>DOCUMENT MANAGEMENT</h1>
        <p style={styles.pageSubtitle}>
          Centralized hub for file ingestion and processing status.
        </p>

        {/* ── Zone Drag & Drop ── */}
        <div
          style={{
            ...styles.dropZone,
            borderColor: dragOver ? "#1a3a8f" : "#d1d5db",
            backgroundColor: dragOver ? "#eff4ff" : "#fafafa",
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div style={styles.uploadIconBox}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#1a3a8f">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
            </svg>
          </div>
          <p style={styles.dropTitle}>Drag and drop files here</p>
          <p style={styles.dropSubtitle}>
            Supports PDF, XLSX, and CSV files up to 20MB.<br />
            Your files will be automatically scanned for data extraction.
          </p>
          <button
            style={styles.selectBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            + SELECT FILES FROM COMPUTER
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.jpg,.jpeg,.png,.csv,.xlsx"
            onChange={handleFileSelect}
          />
        </div>

        {/* ── Fichier sélectionné ── */}
        {selectedFile && (
          <div style={styles.filePreview}>
            <span style={styles.filePreviewIcon}>
              {getFileIcon(selectedFile)}
            </span>
            <div style={styles.filePreviewInfo}>
              <p style={styles.filePreviewName}>{selectedFile.name}</p>
              <p style={styles.filePreviewSize}>
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <button style={styles.removeFileBtn} onClick={handleRemoveFile}>
              ✕
            </button>
          </div>
        )}

        {/* ── Barre bas : format + NEXT ── */}
        <div style={styles.bottomBar}>
          <div style={styles.formatSelector}>
            <span style={styles.formatLabel}>OUTPUT FORMAT</span>
            <div style={styles.formatSelectWrapper}>
              <select
                value={outputFormat}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setOutputFormat(e.target.value as ExportFormat)
                }
                style={styles.formatSelect}
              >
                <option value="JSON">JSON</option>
                <option value="CSV">CSV</option>
                <option value="XML">XML</option>
              </select>
              <svg
                style={styles.selectArrow}
                width="14" height="14"
                viewBox="0 0 24 24" fill="#374151"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>
          </div>

          <button
            style={{
              ...styles.nextBtn,
              opacity: isUploading ? 0.7 : 1,
              cursor: isUploading ? "not-allowed" : "pointer",
            }}
            onClick={handleNext}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "NEXT →"}
          </button>
        </div>

      </main>

      {/* ── Child Component : Toast ── */}
      {showToast && (
        <Toast
          message={toastMsg}
          onClose={() => setShowToast(false)}
        />
      )}

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
    padding: "28px 40px",
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
    margin: "0 0 24px",
  },
  dropZone: {
    border: "2px dashed",
    borderRadius: "12px",
    padding: "48px 24px",
    textAlign: "center",
    transition: "all 0.2s",
    cursor: "pointer",
  },
  uploadIconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#eff4ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
  },
  dropTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px",
  },
  dropSubtitle: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 20px",
    lineHeight: "1.6",
  },
  selectBtn: {
    padding: "10px 24px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    letterSpacing: "0.5px",
  },
  filePreview: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px 16px",
    marginTop: "16px",
  },
  filePreviewIcon: { fontSize: "24px" },
  filePreviewInfo: { flex: 1 },
  filePreviewName: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#111827",
    margin: "0 0 2px",
  },
  filePreviewSize: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: 0,
  },
  removeFileBtn: {
    background: "none",
    border: "none",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  bottomBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  },
  formatSelector: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  formatLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#6b7280",
    letterSpacing: "0.5px",
  },
  formatSelectWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  formatSelect: {
    padding: "8px 32px 8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    fontSize: "13px",
    color: "#374151",
    fontWeight: "600",
    appearance: "none",
    cursor: "pointer",
    outline: "none",
  },
  selectArrow: {
    position: "absolute",
    right: "8px",
    pointerEvents: "none",
  },
  nextBtn: {
    padding: "10px 24px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },
};
