// ─────────────────────────────────────────────
//  services/documentService.ts
//  Gère tous les appels API liés aux documents
//  → upload    : envoyer un fichier
//  → getAll    : récupérer tous les documents
//  → getById   : récupérer un document
//  → update    : modifier les données extraites
//  → approve   : valider un document
//  → remove    : supprimer un document
//  Utilisé par : containers Upload, Editor, Verification
// ─────────────────────────────────────────────

import api from "./api"
import { Document, ProcessedDocument, ExtractedData } from "../types"

// ── Type réponse upload ───────────────────────
interface UploadResponse {
  documentId: string    // ID généré par le backend
  status:     string    // "Processing"
  message:    string    // "Document reçu et en cours de traitement"
}

// ── Type mise à jour document ─────────────────
interface UpdatePayload {
  amount:   number
  entity:   string
  date:     string
  clauses:  string[]
}

// ─────────────────────────────────────────────
const documentService = {

  // ── Upload ────────────────────────────────
  // Envoie un fichier PDF/image au backend
  // Utilise FormData car c'est un fichier binaire
  // (pas du JSON)
  upload: async (
    file:         File,
    outputFormat: string
  ): Promise<UploadResponse> => {

    // FormData → format pour envoyer des fichiers
    const formData = new FormData()
    formData.append("file",         file)          // fichier binaire
    formData.append("outputFormat", outputFormat)  // "JSON", "CSV" ou "XML"

    const response = await api.post<UploadResponse>(
      "/api/documents/upload",
      formData,
      {
        headers: {
          // Écrase le Content-Type JSON par défaut
          // Le navigateur définit automatiquement
          // "multipart/form-data" avec le boundary
          "Content-Type": "multipart/form-data",
        },
        // Suivi de la progression de l'upload
        // onUploadProgress → événement natif Axios
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            console.log(`Upload: ${percent}%`)
            // TODO : dispatcher une action Redux
            // pour afficher une barre de progression
          }
        },
      }
    )

    return response.data
  },

  // ── Get All ───────────────────────────────
  // Récupère tous les documents de l'utilisateur
  getAll: async (): Promise<Document[]> => {
    // GET /api/documents
    // Header Authorization ajouté automatiquement par l'intercepteur
    const response = await api.get<Document[]>("/api/documents")
    // response.data → tableau de documents
    return response.data
  },

  // ── Get By ID ─────────────────────────────
  // Récupère un document précis par son ID
  getById: async (id: string): Promise<ProcessedDocument> => {
    // GET /api/documents/:id
    // ex: GET /api/documents/DOC-001
    const response = await api.get<ProcessedDocument>(
      `/api/documents/${id}`
    )
    return response.data
  },

  // ── Update ────────────────────────────────
  // Met à jour les données extraites après édition
  // Appelé depuis la page Editor avant de naviguer
  update: async (
    id:      string,
    payload: UpdatePayload
  ): Promise<ProcessedDocument> => {
    // PUT /api/documents/:id
    // body : { amount, entity, date, clauses }
    const response = await api.put<ProcessedDocument>(
      `/api/documents/${id}`,
      payload
    )
    return response.data
  },

  // ── Approve ───────────────────────────────
  // Valide un document après vérification
  // Appelé depuis la page Verification
  approve: async (id: string): Promise<ProcessedDocument> => {
    // POST /api/documents/:id/approve
    // Pas de body — l'ID suffit
    const response = await api.post<ProcessedDocument>(
      `/api/documents/${id}/approve`
    )
    return response.data
  },

  // ── Remove ────────────────────────────────
  // Supprime un document
  remove: async (id: string): Promise<void> => {
    // DELETE /api/documents/:id
    await api.delete(`/api/documents/${id}`)
    // Pas de retour — juste confirmation de suppression
  },

}

export default documentService