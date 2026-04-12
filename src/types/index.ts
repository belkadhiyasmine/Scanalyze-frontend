// ─────────────────────────────────────────────
//  types/index.ts
//  Types PARTAGÉS entre plusieurs fichiers
//  ⚠️  Les types propres à un seul composant
//      sont définis dans ce composant directement
// ─────────────────────────────────────────────

// ── Utilisateur ──────────────────────────────
export interface User {
  id:       string;
  fullName: string;
  email:    string;
  role:     "admin" | "utilisateur";
}

// ── Document ─────────────────────────────────
export interface Document {
  id:     string;
  name:   string;
  status: "Success" | "Processing" | "Error";
  date:   string;
}

// ── Données extraites par le pipeline ────────
export interface ExtractedData {
  amount:   number;
  currency: string;
  entity:   string;
  date:     string;
  clauses:  string[];
}

// ── Résultat complet d'un document traité ────
export interface ProcessedDocument {
  document_id:       string;
  extracted_data:    ExtractedData;
  validation_status: "approved" | "warning" | "error";
  last_edited_by:    string;
}

// ── Statistiques Dashboard ────────────────────
export interface DashboardStats {
  totalDocs:    number;
  successRate:  number;
  failureRate:  number;
  avgProcTime:  number;
}

// ── Line Item (Verification page) ────────────
export interface LineItem {
  id:          number;
  description: string;
  qty:         number;
  price:       number;
}

// ── Format d'export ───────────────────────────
export type ExportFormat = "JSON" | "CSV" | "XML";

// ── Réponse API login ─────────────────────────
export interface LoginResponse {
  token: string;
  user:  User;
}
// ── StatusBadge ───────────────────────────────
// Les 3 valeurs possibles du statut d'un document
// Utilisé par StatusBadge.tsx pour indexer STATUS_CONFIG
export type StatusBadgeProps = "Success" | "Processing" | "Error";

// ── Toast ─────────────────────────────────────
// Props du composant Toast (notification)
export interface ToastProps {
  message: string;   // texte affiché dans la notification
  onClose: () => void; // fonction appelée quand on ferme
}
