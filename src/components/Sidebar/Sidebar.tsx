// ─────────────────────────────────────────────
//  components/Sidebar/Sidebar.tsx
//  Child Component — réutilisé dans :
//  Dashboard, Upload, Editor, Verification
//contient le logo , les liens de navigation et les infos utilisateur

// ─────────────────────────────────────────────
//Hook React pour naviguer entre les programmatiquement 
import { useNavigate } from "react-router-dom";
//les routes centralisées
import { ROUTES } from "../../navigation/routes";
interface SidebarProps {
  activeMenu:  string
  onMenuClick: (key: string) => void
}

// ─────────────────────────────────────────────
//activeMenu : la clé du menu actif
//onMenuClick fonction appelé quand l'user clique un item 
//ces deux props viennet du paren qui controle quel menu est actif 
export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  const navigate = useNavigate();

  // ── Items de navigation ───────────────────
  const navItems = [
    { 
      key: "dashboard",
      label: "Dashboard",
      route: ROUTES.DASHBOARD,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      key: "upload",
      label: "Documents",
      route: ROUTES.UPLOAD,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
    },
    {
      key: "export",
      label: "Data Export",
      route: ROUTES.EXPORT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z" />
        </svg>
      ),
    },
  ];

  // ── Récupérer infos utilisateur ───────────
  const userName = localStorage.getItem("userName") || "John Doe";
  const userRole = localStorage.getItem("userRole") || "Utilisateur";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <aside style={styles.sidebar}>

      {/* ── Logo Scanalyze ── */}
      <div style={styles.logoContainer}>
        <div style={styles.logoIcon}>
          <svg width="20" height="20" viewBox="0 0 52 52" fill="none">
            <path
              d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
              fill="white"
            />
          </svg>
        </div>
        <span style={styles.logoText}>Scanalyze</span>
      </div>

      {/* ── Navigation ── */}
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.key}
            style={{
              ...styles.navItem,
              ...(activeMenu === item.key ? styles.navItemActive : {}),
            }}
            onClick={() => {
              onMenuClick(item.key);
              navigate(item.route);
            }}
          >
            <span
              style={{
                color: activeMenu === item.key ? "white" : "#64748b",
                display: "flex",
                alignItems: "center",
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── Settings + User en bas ── */}
      <div style={styles.bottomSection}>
        {/* Settings */}
        <button style={styles.settingsBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#64748b">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
          </svg>
          Settings
        </button>

        {/* User */}
        <div style={styles.userSection}>
          <div style={styles.avatar}>{initials}</div>
          <div>
            <p style={styles.userName}>{userName}</p>
            <p style={styles.userRole}>{userRole}</p>
          </div>
        </div>
      </div>

    </aside>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "220px",
    minWidth: "220px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    position: "sticky",
    top: 0,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "20px 16px",
    borderBottom: "1px solid #f3f4f6",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    backgroundColor: "#1a3a8f",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#111827",
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "16px 10px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    color: "#64748b",
    width: "100%",
    textAlign: "left",
    transition: "background 0.15s",
  },
  navItemActive: {
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
  },
  bottomSection: {
    padding: "12px 10px",
    borderTop: "1px solid #f3f4f6",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  settingsBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    color: "#64748b",
    width: "100%",
    textAlign: "left",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 4px",
  },
  avatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    backgroundColor: "#1a3a8f",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "700",
    flexShrink: 0,
  },
  userName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    margin: 0,
  },
  userRole: {
    fontSize: "11px",
    color: "#6b7280",
    margin: 0,
  },
};