// ─────────────────────────────────────────────
//  services/exportService.ts
//  Gère tous les appels API liés à l'export
//  → exportDocument : exporte en JSON/CSV/XML
//  → downloadFile   : télécharge le fichier
//  Utilisé par : containers DataExport
// ─────────────────────────────────────────────

import api from "./api"
import { ExportFormat } from "../types"

// ── Type payload export ───────────────────────
interface ExportPayload {
  documentId: string        // ID du document à exporter
  format:     ExportFormat  // "JSON" | "CSV" | "XML"
}

// ── Type réponse export ───────────────────────
interface ExportResponse {
  fileUrl:  string  // URL du fichier généré côté serveur
  fileName: string  // nom du fichier à télécharger
  format:   string  // format du fichier
}

// ─────────────────────────────────────────────
const exportService = {

  // ── Export Document ───────────────────────
  // Demande au backend de générer le fichier
  // Retourne l'URL du fichier généré
  exportDocument: async (
    payload: ExportPayload
  ): Promise<ExportResponse> => {
    // POST /api/documents/export
    // body : { documentId: "Invoice_X182", format: "JSON" }
    const response = await api.post<ExportResponse>(
      "/api/documents/export",
      payload
    )
    // response.data → { fileUrl, fileName, format }
    return response.data
  },

  // ── Download File ─────────────────────────
  // Télécharge le fichier généré par le backend
  // Utilise responseType: "blob" pour les fichiers binaires
  downloadFile: async (
    documentId: string,
    format:     ExportFormat
  ): Promise<void> => {

    // GET /api/documents/:id/download?format=JSON
    const response = await api.get(
      `/api/documents/${documentId}/download`,
      {
        params:       { format },          // → ?format=JSON dans l'URL
        responseType: "blob",              // ← reçoit un fichier binaire
      }
    )

    // ── Crée un lien de téléchargement ────────
    // Blob → URL temporaire dans le navigateur
    const blob     = new Blob([response.data])
    const url      = URL.createObjectURL(blob)  // crée URL temporaire
    const link     = document.createElement("a")
    link.href      = url
    link.download  = `${documentId}.${format.toLowerCase()}`
    link.click()                                // déclenche le téléchargement
    URL.revokeObjectURL(url)                    // libère la mémoire
  },

}

export default exportService