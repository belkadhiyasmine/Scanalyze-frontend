// ─────────────────────────────────────────────
//  components/Sidebar/Sidebar.tsx
//  Child Component — réutilisé dans :
//  Dashboard, Upload, Editor, Verification, UserManagement
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useNavigate }             from "react-router-dom"
import { ROUTES }                  from "../../navigation/routes"
import { useTheme }                from "../../themes/ThemeContext"
import { spacing, radius, dimensions } from "../../themes/spacing"

// ─────────────────────────────────────────────
//  INTERFACE DES PROPS
// ─────────────────────────────────────────────

interface SidebarProps {
  activeMenu:  string                    // clé du menu actif — ex : "dashboard"
  onMenuClick: (key: string) => void     // appelée au clic sur un item
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Sidebar({ activeMenu, onMenuClick }: SidebarProps) {
  const navigate = useNavigate()

  // ── Lecture du theme actif ─────────────────
  // Retourne le theme complet (light ou dark)
  // selon le choix sauvegardé dans localStorage
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── Infos utilisateur ─────────────────────
  // Lues depuis localStorage — définies au login
  const userName = localStorage.getItem("userName") || "John Doe"
  const userRole = localStorage.getItem("userRole") || "utilisateur"

  // Initiales extraites du nom complet — ex : "John Doe" → "JD"
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  // ── Items de navigation communs ───────────
  // Visibles par tous les utilisateurs connectés
  const navItems = [
    {
      key:   "dashboard",
      label: "Dashboard",
      route: ROUTES.DASHBOARD,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      ),
    },
    {
      key:   "upload",
      label: "Documents",
      route: ROUTES.UPLOAD,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        </svg>
      ),
    },
    {
      key:   "export",
      label: "Data Export",
      route: ROUTES.EXPORT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zm-8 2V5h2v6h1.17L12 13.17 9.83 11H11zm-6 7h14v2H5v-2z" />
        </svg>
      ),
    },
  ]

  // ── Items Admin uniquement ─────────────────
  // Visibles uniquement si userRole === "admin"
  const adminItems = [
    {
      key:   "users",
      label: "Users",
      route: ROUTES.USER_MANAGEMENT,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
  ]

  // true si l'utilisateur connecté est admin
  const isAdmin = userRole === "admin"

  // ─────────────────────────────────────────
  //  RENDU
  // ─────────────────────────────────────────

  return (
    <aside
      style={{
        width:           dimensions.sidebarWidth,  // 220px — depuis spacing.ts
        minWidth:        dimensions.sidebarWidth,
        backgroundColor: colors.sidebarBg,         // blanc light / gris foncé dark
        borderRight:     `1px solid ${colors.border}`,
        display:         "flex",
        flexDirection:   "column",
        height:          "100vh",
        position:        "sticky",
        top:             0,
      }}
    >

      {/* ── Logo Scanalyze ─────────────────────
          Icône bleue + texte "Scanalyze"        */}
      <div
        style={{
          display:      "flex",
          alignItems:   "center",
          gap:          spacing[2],               // 8px
          padding:      `${spacing[5]} ${spacing[4]}`, // 20px 16px
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        {/* Carré bleu avec le logo SVG */}
        <div
          style={{
            width:           "36px",
            height:          "36px",
            backgroundColor: colors.sidebarActive, // bleu principal selon le theme
            borderRadius:    radius.md,             // 8px
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 52 52" fill="none">
            <path
              d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
              fill="white"
            />
          </svg>
        </div>

        {/* Nom de l'application */}
        <span
          style={{
            fontSize:      theme.fontSize.base,       // depuis typography.ts
            fontWeight:    theme.fontWeight.bold,      // gras
            color:         colors.textPrimary,         // foncé selon le theme
            letterSpacing: theme.letterSpacing.wide,   // depuis typography.ts
          }}
        >
          Scanalyze
        </span>
      </div>

      {/* ── Navigation ─────────────────────────
          Items communs + section admin          */}
      <nav
        style={{
          display:       "flex",
          flexDirection: "column",
          gap:           spacing[1],   // 4px entre les items
          padding:       `${spacing[4]} ${spacing[2]}`, // 16px 8px
          flex:          1,            // prend tout l'espace disponible
        }}
      >

        {/* Items communs — visibles par tous */}
        {navItems.map((item) => (
          <button
            key={item.key}
            style={{
              display:         "flex",
              alignItems:      "center",
              gap:             spacing[2],       // 8px entre icône et label
              padding:         `${spacing[2]} ${spacing[3]}`, // 8px 12px
              borderRadius:    radius.md,        // 8px
              border:          "none",
              // Fond bleu si actif, transparent sinon
              backgroundColor: activeMenu === item.key
                ? colors.sidebarActive
                : "transparent",
              cursor:    "pointer",
              fontSize:  theme.fontSize.sm,      // depuis typography.ts
              fontWeight: theme.fontWeight.medium,
              // Texte blanc si actif, gris sinon
              color:     activeMenu === item.key
                ? colors.sidebarActiveText
                : colors.sidebarText,
              width:     "100%",
              textAlign: "left",
              transition: "background 0.15s",
            }}
            onClick={() => {
              onMenuClick(item.key)
              navigate(item.route)
            }}
          >
            {/* Icône — couleur synchronisée avec le texte */}
            <span
              style={{
                color: activeMenu === item.key
                  ? colors.sidebarActiveText  // blanc si actif
                  : colors.sidebarText,       // gris sinon
                display:    "flex",
                alignItems: "center",
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}

        {/* Section Admin — affichée uniquement si role = admin */}
        {isAdmin && (
          <>
            {/* Label séparateur "ADMINISTRATION" */}
            <p
              style={{
                fontSize:      theme.fontSize.xs,         // très petit
                fontWeight:    theme.fontWeight.bold,
                color:         colors.textSecondary,       // gris discret
                letterSpacing: theme.letterSpacing.wider,  // très espacé
                padding:       `${spacing[3]} ${spacing[3]} ${spacing[1]}`, // 12px 12px 4px
                margin:        0,
              }}
            >
              ADMINISTRATION
            </p>

            {/* Items admin — même style que les items communs */}
            {adminItems.map((item) => (
              <button
                key={item.key}
                style={{
                  display:         "flex",
                  alignItems:      "center",
                  gap:             spacing[2],
                  padding:         `${spacing[2]} ${spacing[3]}`,
                  borderRadius:    radius.md,
                  border:          "none",
                  backgroundColor: activeMenu === item.key
                    ? colors.sidebarActive
                    : "transparent",
                  cursor:    "pointer",
                  fontSize:  theme.fontSize.sm,
                  fontWeight: theme.fontWeight.medium,
                  color:     activeMenu === item.key
                    ? colors.sidebarActiveText
                    : colors.sidebarText,
                  width:     "100%",
                  textAlign: "left",
                  transition: "background 0.15s",
                }}
                onClick={() => {
                  onMenuClick(item.key)
                  navigate(item.route)
                }}
              >
                <span
                  style={{
                    color: activeMenu === item.key
                      ? colors.sidebarActiveText
                      : colors.sidebarText,
                    display:    "flex",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </button>
            ))}
          </>
        )}
      </nav>

      {/* ── Section utilisateur (bas de sidebar) ─
          Avatar + nom + rôle                    */}
      <div
        style={{
          padding:       `${spacing[3]} ${spacing[2]}`, // 12px 8px
          borderTop:     `1px solid ${colors.border}`,
          display:       "flex",
          flexDirection: "column",
          gap:           spacing[2],   // 8px
        }}
      >
        <div
          style={{
            display:    "flex",
            alignItems: "center",
            gap:        spacing[2],   // 8px
            padding:    `${spacing[2]} ${spacing[1]}`, // 8px 4px
          }}
        >
          {/* Avatar circulaire avec initiales */}
          <div
            style={{
              width:           dimensions.avatarMd,   // 36px — depuis spacing.ts
              height:          dimensions.avatarMd,
              borderRadius:    radius.round,           // 50% — cercle parfait
              backgroundColor: colors.sidebarActive,  // bleu selon le theme
              color:           colors.sidebarActiveText, // blanc
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              fontSize:        theme.fontSize.xs,      // petit
              fontWeight:      theme.fontWeight.bold,
              flexShrink:      0,                      // ne rétrécit pas
            }}
          >
            {initials}
          </div>

          {/* Nom et rôle de l'utilisateur */}
          <div>
            <p
              style={{
                fontSize:   theme.fontSize.sm,         // 13-14px
                fontWeight: theme.fontWeight.semibold,
                color:      colors.textPrimary,        // foncé selon le theme
                margin:     0,
              }}
            >
              {userName}
            </p>
            <p
              style={{
                fontSize: theme.fontSize.xs,           // très petit
                color:    colors.textSecondary,        // gris selon le theme
                margin:   0,
              }}
            >
              {userRole}
            </p>
          </div>
        </div>
      </div>

    </aside>
  )
}