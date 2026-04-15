// ─────────────────────────────────────────────
//  containers/UserManagement/UserManagement.tsx
//  Page Admin uniquement
//  Rôle : gérer les utilisateurs (liste, activation,
//         suppression, changement de rôle)
//  Connecté au système de theme (light/dark)
// ─────────────────────────────────────────────

import { useState, useEffect }      from "react"
import { useNavigate }              from "react-router-dom"
import { useTheme }                 from "../../themes/ThemeContext"
import { useSelector }              from "react-redux"
import { selectToken }              from "../../store/auth/authSelectors"
import Sidebar                      from "../../components/Sidebar/Sidebar"
import Loader                       from "../../components/Loader/Loader"
import Button                       from "../../components/Button/Button"
import { ROUTES }                   from "../../navigation/routes"
import axios                        from "axios"

// ── Type utilisateur retourné par l'API ───────
interface UserItem {
  id:       string
  fullName: string
  email:    string
  role:     "admin" | "utilisateur"
  isActive: boolean
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function UserManagement() {
  const navigate  = useNavigate()
  const { theme } = useTheme()
  const token     = useSelector(selectToken)

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ─────────────────────────────────────────
  //  STATES
  // ─────────────────────────────────────────

  const [activeMenu,    setActiveMenu]    = useState<string>("users")
  const [users,         setUsers]         = useState<UserItem[]>([])
  const [isLoading,     setIsLoading]     = useState<boolean>(true)
  const [error,         setError]         = useState<string>("")
  const [searchQuery,   setSearchQuery]   = useState<string>("")
  const [roleFilter,    setRoleFilter]    = useState<string>("all")

  // id de l'user en cours d'action — désactive ses boutons
  const [actionLoading, setActionLoading] = useState<string>("")
  const [currentPage,   setCurrentPage]   = useState<number>(1)
  const USERS_PER_PAGE = 5

  // ─────────────────────────────────────────
  //  CHARGEMENT DES UTILISATEURS
  //  Appel API réel via axios
  // ─────────────────────────────────────────

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const response = await axios.get("/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(response.data)
    } catch {
      setError("Impossible de charger les utilisateurs.")
    } finally {
      setIsLoading(false)
    }
  }

  // ─────────────────────────────────────────
  //  ACTIONS SUR LES UTILISATEURS
  // ─────────────────────────────────────────

  // Activer / Désactiver un compte
  const toggleActive = async (user: UserItem) => {
    setActionLoading(user.id)
    try {
      await axios.patch(
        `/api/users/${user.id}`,
        { isActive: !user.isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Met à jour localement sans refetch
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, isActive: !u.isActive } : u)
      )
    } catch {
      alert("Erreur lors de la modification du compte.")
    } finally {
      setActionLoading("")
    }
  }

  // Supprimer un utilisateur
  const deleteUser = async (userId: string) => {
    if (!window.confirm("Confirmer la suppression de cet utilisateur ?")) return
    setActionLoading(userId)
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch {
      alert("Erreur lors de la suppression.")
    } finally {
      setActionLoading("")
    }
  }

  // Modifier le rôle d'un utilisateur
  const changeRole = async (user: UserItem, newRole: "admin" | "utilisateur") => {
    setActionLoading(user.id)
    try {
      await axios.patch(
        `/api/users/${user.id}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setUsers(prev =>
        prev.map(u => u.id === user.id ? { ...u, role: newRole } : u)
      )
    } catch {
      alert("Erreur lors du changement de rôle.")
    } finally {
      setActionLoading("")
    }
  }

  // ─────────────────────────────────────────
  //  FILTRAGE + RECHERCHE + PAGINATION
  // ─────────────────────────────────────────

  const filtered = users.filter(u => {
    const matchSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = roleFilter === "all" || u.role === roleFilter
    return matchSearch && matchRole
  })

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE)
  const paginated  = filtered.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  // ─────────────────────────────────────────
  //  HELPERS
  // ─────────────────────────────────────────

  // Initiales depuis le nom complet — ex: "John Doe" → "JD"
  const getInitials = (name: string) =>
    name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  // Couleur avatar : bleu pour admin, gris pour utilisateur
  const avatarColor = (role: string) =>
    role === "admin" ? colors.primary : colors.textSecondary

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

      {/* ── Sidebar ────────────────────────────*/}
      <Sidebar
        activeMenu={activeMenu}
        onMenuClick={setActiveMenu}
      />

      {/* ── Contenu principal ──────────────────*/}
      <main
        style={{
          flex:          1,
          padding:       `${theme.spacing[6]} ${theme.spacing[7]}`, // 24px 28px
          display:       "flex",
          flexDirection: "column",
          gap:           theme.spacing[5],   // 20px entre les sections
        }}
      >

        {/* ── En-tête ────────────────────────────
            Titre + bouton Create User            */}
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
                fontSize:   theme.fontSize.xxl,
                fontWeight: theme.fontWeight.bold,
                color:      colors.textPrimary,
                margin:     0,
              }}
            >
              User Management
            </h1>
            <p
              style={{
                fontSize: theme.fontSize.sm,
                color:    colors.textSecondary,
                margin:   `${theme.spacing[1]} 0 0`,
              }}
            >
              Manage and control system users
            </p>
          </div>

          {/* Bouton Create User → redirige vers SignUp */}
          <Button
            label="+ Create User"
            variant="primary"
            size="md"
            onClick={() => navigate(ROUTES.SIGNUP)}
          />
        </div>

        {/* ── Carte principale ───────────────────
            Contient recherche + tableau + pagination */}
        <div
          style={{
            backgroundColor: colors.bgSurface,   // blanc light / sombre dark
            borderRadius:    theme.radius.lg,     // 12px
            border:          `1px solid ${colors.border}`,
            overflow:        "hidden",
          }}
        >

          {/* ── Barre recherche + filtre rôle ──────*/}
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          theme.spacing[3],     // 12px
              padding:      `${theme.spacing[4]} ${theme.spacing[5]}`, // 16px 20px
              borderBottom: `1px solid ${colors.border}`,
            }}
          >

            {/* Champ de recherche */}
            <div style={{ position: "relative", flex: 1, maxWidth: "360px" }}>
              <span
                style={{
                  position:  "absolute",
                  left:      theme.spacing[3],    // 12px
                  top:       "50%",
                  transform: "translateY(-50%)",
                  color:     colors.textSecondary,
                  fontSize:  theme.fontSize.sm,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                style={{
                  width:           "100%",
                  padding:         `${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} 36px`,
                  fontSize:        theme.fontSize.sm,
                  border:          `1px solid ${colors.border}`,
                  borderRadius:    theme.radius.md,
                  outline:         "none",
                  backgroundColor: colors.bgApp,
                  color:           colors.textPrimary,
                  boxSizing:       "border-box",
                  fontFamily:      theme.fontFamily.sans,
                }}
              />
            </div>

            {/* Filtre par rôle */}
            <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>
              <span
                style={{
                  fontSize:   theme.fontSize.sm,
                  color:      colors.textSecondary,
                  fontWeight: theme.fontWeight.medium,
                }}
              >
                ROLE:
              </span>
              <select
                value={roleFilter}
                onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1) }}
                style={{
                  padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
                  fontSize:        theme.fontSize.sm,
                  border:          `1px solid ${colors.border}`,
                  borderRadius:    theme.radius.md,
                  outline:         "none",
                  backgroundColor: colors.bgApp,
                  color:           colors.textPrimary,
                  cursor:          "pointer",
                  fontFamily:      theme.fontFamily.sans,
                }}
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
            </div>
          </div>

          {/* ── Loader ─────────────────────────────
              Affiché pendant le chargement API     */}
          {isLoading && (
            <div style={{ padding: theme.spacing[8], textAlign: "center" }}>
              <Loader size="md" label="Chargement des utilisateurs..." />
            </div>
          )}

          {/* ── Erreur API ──────────────────────────*/}
          {!isLoading && error && (
            <div
              style={{
                padding:         `${theme.spacing[4]} ${theme.spacing[5]}`,
                color:           colors.error,
                backgroundColor: colors.errorBg,
                fontSize:        theme.fontSize.sm,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* ── Tableau des utilisateurs ────────────*/}
          {!isLoading && !error && (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>

              {/* En-têtes colonnes */}
              <thead>
                <tr style={{ backgroundColor: colors.bgApp }}>
                  {["FULL NAME", "ROLE", "STATUS", "ACTIONS"].map(col => (
                    <th
                      key={col}
                      style={{
                        padding:       `${theme.spacing[3]} ${theme.spacing[5]}`,
                        fontSize:      theme.fontSize.xs,
                        fontWeight:    theme.fontWeight.bold,
                        color:         colors.textSecondary,
                        textAlign:     "left",
                        letterSpacing: theme.letterSpacing.wider,
                        borderBottom:  `1px solid ${colors.border}`,
                      }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Lignes utilisateurs */}
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        padding:   `${theme.spacing[8]} ${theme.spacing[5]}`,
                        textAlign: "center",
                        color:     colors.textSecondary,
                        fontSize:  theme.fontSize.sm,
                      }}
                    >
                      Aucun utilisateur trouvé.
                    </td>
                  </tr>
                ) : (
                  paginated.map(user => (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: `1px solid ${colors.border}`,
                        transition:   "background-color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = colors.bgHover)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                    >

                      {/* Colonne : Avatar + Nom + Email */}
                      <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[5]}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[3] }}>

                          {/* Avatar circulaire avec initiales */}
                          <div
                            style={{
                              width:           "36px",
                              height:          "36px",
                              borderRadius:    theme.radius.round,   // 50%
                              backgroundColor: avatarColor(user.role),
                              color:           colors.textInverse,   // blanc
                              display:         "flex",
                              alignItems:      "center",
                              justifyContent:  "center",
                              fontSize:        theme.fontSize.xs,
                              fontWeight:      theme.fontWeight.bold,
                              flexShrink:      0,
                            }}
                          >
                            {getInitials(user.fullName)}
                          </div>

                          <div>
                            <p
                              style={{
                                margin:     0,
                                fontSize:   theme.fontSize.sm,
                                fontWeight: theme.fontWeight.semibold,
                                color:      colors.textPrimary,
                              }}
                            >
                              {user.fullName}
                            </p>
                            <p
                              style={{
                                margin:   0,
                                fontSize: theme.fontSize.xs,
                                color:    colors.textSecondary,
                              }}
                            >
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Colonne : Rôle — select modifiable */}
                      <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[5]}` }}>
                        <select
                          value={user.role}
                          disabled={actionLoading === user.id}
                          onChange={e => changeRole(user, e.target.value as "admin" | "utilisateur")}
                          style={{
                            padding:         `${theme.spacing[1]} ${theme.spacing[2]}`,
                            fontSize:        theme.fontSize.xs,
                            fontWeight:      theme.fontWeight.semibold,
                            // Bordure bleue si admin, normale sinon
                            border:          `1px solid ${user.role === "admin" ? colors.primary : colors.border}`,
                            borderRadius:    theme.radius.sm,
                            // Fond bleu très clair si admin, normal sinon
                            backgroundColor: user.role === "admin" ? `${colors.primary}15` : colors.bgApp,
                            color:           user.role === "admin" ? colors.primary : colors.textPrimary,
                            cursor:          "pointer",
                            outline:         "none",
                            fontFamily:      theme.fontFamily.sans,
                          }}
                        >
                          <option value="admin">ADMIN</option>
                          <option value="utilisateur">USER</option>
                        </select>
                      </td>

                      {/* Colonne : Statut Actif / Inactif */}
                      <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[5]}` }}>
                        <span
                          style={{
                            display:         "inline-flex",
                            alignItems:      "center",
                            gap:             theme.spacing[1],
                            padding:         `${theme.spacing[1]} ${theme.spacing[2]}`,
                            borderRadius:    theme.radius.full,   // 99px — forme pilule
                            fontSize:        theme.fontSize.xs,
                            fontWeight:      theme.fontWeight.medium,
                            // Vert si actif, gris si inactif
                            backgroundColor: user.isActive ? colors.successBg : colors.bgHover,
                            color:           user.isActive ? colors.success   : colors.textSecondary,
                          }}
                        >
                          {/* Point de statut */}
                          <span
                            style={{
                              width:           "6px",
                              height:          "6px",
                              borderRadius:    theme.radius.round,
                              backgroundColor: user.isActive ? colors.success : colors.textSecondary,
                              flexShrink:      0,
                            }}
                          />
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Colonne : Actions */}
                      <td style={{ padding: `${theme.spacing[3]} ${theme.spacing[5]}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: theme.spacing[2] }}>

                          {/* Bouton Toggle Activer / Désactiver */}
                          <button
                            onClick={() => toggleActive(user)}
                            disabled={actionLoading === user.id}
                            title={user.isActive ? "Désactiver" : "Activer"}
                            style={{
                              background:   "none",
                              // Orange si actif (désactiver), vert si inactif (activer)
                              border:       `1px solid ${user.isActive ? colors.warning : colors.success}`,
                              borderRadius: theme.radius.sm,
                              color:        user.isActive ? colors.warning : colors.success,
                              cursor:       actionLoading === user.id ? "not-allowed" : "pointer",
                              fontSize:     theme.fontSize.xs,
                              padding:      `${theme.spacing[1]} ${theme.spacing[2]}`,
                              opacity:      actionLoading === user.id ? 0.5 : 1,
                              fontFamily:   theme.fontFamily.sans,
                            }}
                          >
                            {user.isActive ? "🔒 Désactiver" : "✅ Activer"}
                          </button>

                          {/* Bouton Supprimer */}
                          <button
                            onClick={() => deleteUser(user.id)}
                            disabled={actionLoading === user.id}
                            title="Supprimer"
                            style={{
                              background:   "none",
                              border:       `1px solid ${colors.error}`,
                              borderRadius: theme.radius.sm,
                              color:        colors.error,
                              cursor:       actionLoading === user.id ? "not-allowed" : "pointer",
                              fontSize:     theme.fontSize.xs,
                              padding:      `${theme.spacing[1]} ${theme.spacing[2]}`,
                              opacity:      actionLoading === user.id ? 0.5 : 1,
                            }}
                          >
                            🗑️
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {/* ── Pagination ─────────────────────────
              Affichée seulement si des résultats   */}
          {!isLoading && !error && filtered.length > 0 && (
            <div
              style={{
                display:        "flex",
                justifyContent: "space-between",
                alignItems:     "center",
                padding:        `${theme.spacing[3]} ${theme.spacing[5]}`,
                borderTop:      `1px solid ${colors.border}`,
              }}
            >
              {/* Info : "Showing X to Y of Z users" */}
              <span style={{ fontSize: theme.fontSize.sm, color: colors.textSecondary }}>
                Showing {(currentPage - 1) * USERS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * USERS_PER_PAGE, filtered.length)} of {filtered.length} users
              </span>

              {/* Boutons de navigation */}
              <div style={{ display: "flex", gap: theme.spacing[1] }}>

                {/* Précédent */}
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={paginationBtnStyle(currentPage === 1, theme, colors)}
                >
                  ‹
                </button>

                {/* Numéros de pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      ...paginationBtnStyle(false, theme, colors),
                      // Fond bleu si page active, transparent sinon
                      backgroundColor: page === currentPage ? colors.primary    : "transparent",
                      color:           page === currentPage ? colors.textInverse : colors.textPrimary,
                      fontWeight:      page === currentPage
                        ? theme.fontWeight.bold
                        : theme.fontWeight.regular,
                    }}
                  >
                    {page}
                  </button>
                ))}

                {/* Suivant */}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  style={paginationBtnStyle(currentPage === totalPages, theme, colors)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────
//  HELPER — Style boutons pagination
//  Reçoit theme ET colors pour être cohérent
// ─────────────────────────────────────────────

const paginationBtnStyle = (
  disabled: boolean,
  theme:    any,
  colors:   any
): React.CSSProperties => ({
  width:           "32px",
  height:          "32px",
  display:         "flex",
  alignItems:      "center",
  justifyContent:  "center",
  border:          `1px solid ${colors.border}`,
  borderRadius:    theme.radius.sm,
  backgroundColor: "transparent",
  color:           colors.textPrimary,
  cursor:          disabled ? "not-allowed" : "pointer",
  opacity:         disabled ? 0.4 : 1,
  fontSize:        theme.fontSize.sm,
  fontFamily:      theme.fontFamily.sans,
})