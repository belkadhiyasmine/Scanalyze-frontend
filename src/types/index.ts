// ─────────────────────────────────────────────
//  types/index.ts
//  Tous les types globaux de l'application
// ─────────────────────────────────────────────

// ── Utilisateur ──────────────────────────────
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "utilisateur"; // seulement ces 2 valeurs possibles
}

// ── Document ─────────────────────────────────
export interface Document {
  id: string;
  name: string;
  status: "Success" | "Processing" | "Error";
  date: string;
}

// ── Données extraites par le pipeline ────────
export interface ExtractedData {
  amount: number;
  currency: string;
  entity: string;
  date: string;
  clauses: string[];
}

// ── Résultat complet d'un document traité ────
export interface ProcessedDocument {
  document_id: string;
  extracted_data: ExtractedData;
  validation_status: "approved" | "warning" | "error";
  last_edited_by: string;
}

// ── Statistiques Dashboard ────────────────────
export interface DashboardStats {
  totalDocs: number;
  successRate: number;
  failureRate: number;
  avgProcTime: number;
}

// ── Line Item (Verification page) ────────────
export interface LineItem {
  id: number;
  description: string;
  qty: number;
  price: number;
}

// ── Props de la Sidebar ───────────────────────
export interface SidebarProps {
  activeMenu: string;
  onMenuClick: (menu: string) => void;
}

// ── Props MetricCard ──────────────────────────
export interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: React.ReactNode;
}

// ── Props StatusBadge ─────────────────────────
export interface StatusBadgeProps {
  status: "Success" | "Processing" | "Error";
}

// ── Props Toast ───────────────────────────────
export interface ToastProps {
  message: string;
  onClose: () => void;
}

// ── Format d'export ───────────────────────────
export type ExportFormat = "JSON" | "CSV" | "XML";

// ── Réponse API login ─────────────────────────
export interface LoginResponse {
  token: string;
  user: User;
}