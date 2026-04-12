// ─────────────────────────────────────────────
//  containers/SignUp/SignUp.tsx
//  Page privée — Admin seulement
//  Permet de créer un nouveau compte
//
//  Modifications apportées :
//  ① Logo remplacé par le nouveau logo SVG Scanalyze
//  ② Nom changé de "IIDP" → "Scanalyze"
//  ③ Phrase "Min. 8 chars with 1 number" supprimée sous le champ Password
//
//  Concepts utilisés :
//  → useTheme    : couleurs depuis le theme
//  → TextInput   : remplace les <input> natifs
//  → Button      : remplace le <button> natif
//  → Loader      : remplace le spinner manuel
// ─────────────────────────────────────────────

import { useState }             from "react"
import { useNavigate }          from "react-router-dom"
import { useTheme }             from "../../themes/ThemeContext"
import { ROUTES }               from "../../navigation/routes"
import TextInput                from "../../components/TextInput/TextInput"
import Button                   from "../../components/Button/Button"
import Loader                   from "../../components/Loader/Loader"

import logoScanalyze from "../../assets/images/logo.svg"

export default function SignUp() {
  const navigate  = useNavigate()
  const { theme } = useTheme()

  // ── États des champs ──────────────────────
  const [fullName,        setFullName]        = useState<string>("")
  const [email,           setEmail]           = useState<string>("")
  const [password,        setPassword]        = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [role,            setRole]            = useState<string>("")
  const [showPassword,    setShowPassword]    = useState<boolean>(false)
  const [showConfirm,     setShowConfirm]     = useState<boolean>(false)
  const [isLoading,       setIsLoading]       = useState<boolean>(false)
  const [error,           setError]           = useState<string>("")

  // ── Validation des champs ─────────────────
  const validate = (): string => {
    if (!fullName || !email || !password || !confirmPassword || !role)
      return "Veuillez remplir tous les champs."
    if (!email.includes("@"))
      return "Adresse email invalide."
    if (password.length < 8)
      return "Le mot de passe doit contenir au moins 8 caractères."
    if (!/\d/.test(password))
      return "Le mot de passe doit contenir au moins un chiffre."
    if (password !== confirmPassword)
      return "Les mots de passe ne correspondent pas."
    return ""
  }

  // ── Soumission du formulaire ──────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const validationError = validate()
    if (validationError) { setError(validationError); return }

    setIsLoading(true)
    try {
      await new Promise((res) => setTimeout(res, 1000))
      navigate(ROUTES.LOGIN)
    } catch {
      setError("Une erreur est survenue. Réessayez.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",
      display:         "flex",
      flexDirection:   "column",
      alignItems:      "center",
      justifyContent:  "center",
      fontFamily:      "var(--font-primary)",
      padding:         "24px 16px",
    }}>

      {isLoading && <Loader fullPage label="Création en cours..." />}

      {/* Logo + Titre */}
      <div style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "center",
        marginBottom:  theme.spacing[5],
      }}>
        <div style={{ marginBottom: theme.spacing[2] }}>
          <img
            src={logoScanalyze}
            alt="Scanalyze logo"
            height="80"
            style={{ display: "block" }}
          />
        </div>

        <h1 style={{
          fontSize:   theme.fontSize.xxl,
          fontWeight: theme.fontWeight.bold,
          color:      "var(--color-text-primary)",
          margin:     `0 0 ${theme.spacing[1]}`,
        }}>
          Scanalyze
        </h1>

        <p style={{
          fontSize: theme.fontSize.sm,
          color:    theme.colors.primary,
          margin:   0,
        }}>
          Traitement Intelligent des Documents
        </p>
      </div>

      {/* Carte formulaire */}
      <div style={{
        backgroundColor: "var(--color-bg-surface)",
        borderRadius:    theme.radius.xl,
        border:          "1px solid var(--color-border)",
        padding:         `${theme.spacing[8]} ${theme.spacing[10]}`,
        width:           "100%",
        maxWidth:        "460px",
        boxShadow:       theme.shadows.lg,
      }}>
        <h2 style={{
          fontSize:   theme.fontSize.xl,
          fontWeight: theme.fontWeight.bold,
          color:      "var(--color-text-primary)",
          margin:     `0 0 ${theme.spacing[6]}`,
          textAlign:  "center",
        }}>
          Create your account
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: theme.spacing[4] }}
        >

          {/* Champ Full Name
              onChange : e => setFullName(e.target.value)
              → extrait la valeur du ChangeEvent avant de mettre à jour l'état */}
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            fullWidth
          />

          {/* Champ Email */}
          <TextInput
            label="Professional Email"
            type="email"
            placeholder="email@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          {/* Champ Password */}
          <TextInput
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              background: "none",
              border:     "none",
              cursor:     "pointer",
              fontSize:   "13px",
              color:      "var(--color-text-secondary)",
              textAlign:  "left",
            }}
          >
            {showPassword ? "🙈 Masquer" : "👁️ Afficher"} le mot de passe
          </button>

          {/* Champ Confirm Password */}
          <TextInput
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />

          {/* Champ Role — select natif */}
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing[1] }}>
            <label style={{
              fontSize:   theme.fontSize.md,
              fontWeight: theme.fontWeight.semibold,
              color:      "var(--color-text-primary)",
            }}>
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                width:           "100%",
                padding:         "10px 12px",
                fontSize:        theme.fontSize.md,
                border:          "1px solid var(--color-border)",
                borderRadius:    theme.radius.md,
                backgroundColor: "var(--color-bg-input)",
                color:           "var(--color-text-primary)",
                outline:         "none",
              }}
            >
              <option value="">Select your role</option>
              <option value="admin">Admin</option>
              <option value="utilisateur">Utilisateur</option>
            </select>

            {role === "admin" && (
              <p style={{
                fontSize:        theme.fontSize.sm,
                color:           theme.colors.primary,
                backgroundColor: "var(--color-primary-light)",
                border:          `1px solid var(--color-border)`,
                borderRadius:    theme.radius.sm,
                padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
              }}>
                👑 Admin : accès complet — gestion des utilisateurs, documents et statistiques.
              </p>
            )}
            {role === "utilisateur" && (
              <p style={{
                fontSize:        theme.fontSize.sm,
                color:           theme.colors.primary,
                backgroundColor: "var(--color-primary-light)",
                border:          `1px solid var(--color-border)`,
                borderRadius:    theme.radius.sm,
                padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
              }}>
                👤 Utilisateur : upload et traitement de documents, export des données.
              </p>
            )}
          </div>

          {/* Message d'erreur */}
          {error && (
            <div style={{
              fontSize:        theme.fontSize.sm,
              color:           "var(--color-error)",
              backgroundColor: "var(--color-error-bg)",
              border:          "1px solid var(--color-error)",
              borderRadius:    theme.radius.md,
              padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
            }}>
              ⚠️ {error}
            </div>
          )}

          <Button
            label={isLoading ? "Création en cours..." : "Sign Up →"}
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          />

        </form>

        <p style={{
          textAlign:    "center",
          fontSize:     theme.fontSize.md,
          color:        "var(--color-text-secondary)",
          marginTop:    theme.spacing[5],
          marginBottom: 0,
        }}>
          Already have an account?{" "}
          <span
            style={{
              color:      theme.colors.primary,
              fontWeight: theme.fontWeight.bold,
              cursor:     "pointer",
            }}
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}
