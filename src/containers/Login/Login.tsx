// ─────────────────────────────────────────────
//  containers/Login/index.tsx
//  Page publique — seule page accessible sans connexion
//
//  Modifications apportées :
//  ① Nom changé de "IIDP" → "Scanalyze"
//  ② Logo remplacé par le nouveau logo SVG Scanalyze
//  ③ Checkbox "Remember me" supprimé
//
//  Concepts utilisés :
//  → useForm        : gestion du formulaire
//  → useDispatch    : envoyer des actions Redux
//  → useSelector    : lire le state Redux
//  → useTheme       : accéder au theme actif
//  → Composants     : TextInput, Button, Loader
// ─────────────────────────────────────────────

import { useEffect }                from "react"
import { useNavigate }              from "react-router-dom"
import { useForm }                  from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useTheme }                 from "../../themes/ThemeContext"
import { ROUTES }                   from "../../navigation/routes"
import { loginRequest }             from "../../store/auth/authSlice"
import {
  selectIsLoading,
  selectAuthError,
  selectToken,
}                                   from "../../store/auth/authSelectors"

import TextInput from "../../components/TextInput/TextInput"
import Button    from "../../components/Button/Button"
import Loader    from "../../components/Loader/Loader"

import logoScanalyze from "../../assets/images/logo.svg"

// ── Type des données du formulaire ────────────
interface LoginFormData {
  email:    string
  password: string
}

// ─────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { theme } = useTheme()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>()

  const isLoading  = useSelector(selectIsLoading)
  const reduxError = useSelector(selectAuthError)
  const token      = useSelector(selectToken)

  // Redirection automatique si déjà connecté
  useEffect(() => {
    if (token) navigate(ROUTES.DASHBOARD)
  }, [token, navigate])

  // Soumission du formulaire → action Redux → Saga → API
  const onSubmit = (data: LoginFormData) => {
    dispatch(loginRequest({ email: data.email, password: data.password }))
  }

  return (
    <div style={{
      minHeight:       "100vh",
      backgroundColor: "var(--color-bg-app)",
      display:         "flex",
      alignItems:      "center",
      justifyContent:  "center",
      fontFamily:      "var(--font-primary)",
      padding:         "24px 16px",
    }}>

      {/* Loader pleine page pendant l'appel API */}
      {isLoading && (
        <Loader
          fullPage
          size="md"
          label="Connexion en cours..."
        />
      )}

      {/* Carte centrale */}
      <div style={{
        backgroundColor: "var(--color-bg-surface)",
        borderRadius:    theme.radius.xl,
        border:          "1px solid var(--color-border)",
        padding:         `${theme.spacing[10]} ${theme.spacing[10]}`,
        width:           "100%",
        maxWidth:        "440px",
        boxShadow:       theme.shadows.lg,
      }}>

        {/* Logo + Titre */}
        <div style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          marginBottom:  theme.spacing[8],
        }}>
          <div style={{ marginBottom: theme.spacing[3] }}>
            <img
              src={logoScanalyze}
              alt="Scanalyze logo"
              height="80"
              style={{ display: "block" }}
            />
          </div>

          <h1 style={{
            fontSize:      theme.fontSize.xxl,
            fontWeight:    theme.fontWeight.bold,
            color:         "var(--color-text-primary)",
            margin:        `0 0 ${theme.spacing[1]}`,
            letterSpacing: theme.letterSpacing.wide,
          }}>
            Scanalyze
          </h1>

          <p style={{
            fontSize: theme.fontSize.md,
            color:    theme.colors.primary,
            margin:   0,
          }}>
            Intelligent Document Processing
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{ display: "flex", flexDirection: "column", gap: theme.spacing[5] }}
        >

          {/* Champ Email — register gère onChange seul */}
          <TextInput
            label="Email or Username"
            type="email"
            placeholder="Enter your email or username"
            value={watch("email") || ""}
            error={errors.email?.message}
            fullWidth
            {...register("email", {
              required: "Veuillez remplir ce champ",
              pattern: {
                value:   /\S+@\S+\.\S+/,
                message: "Adresse email invalide",
              },
            })}
          />

          {/* Champ Password — register gère onChange seul */}
          <TextInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={watch("password") || ""}
            error={errors.password?.message}
            fullWidth
            {...register("password", {
              required:  "Veuillez remplir ce champ",
              minLength: { value: 6, message: "Minimum 6 caractères" },
            })}
          />

          {/* Erreur retournée par le backend via Redux */}
          {reduxError && (
            <div style={{
              fontSize:        theme.fontSize.sm,
              color:           "var(--color-error)",
              backgroundColor: "var(--color-error-bg)",
              border:          "1px solid var(--color-error)",
              borderRadius:    theme.radius.md,
              padding:         `${theme.spacing[2]} ${theme.spacing[3]}`,
            }}>
              ⚠️ {reduxError}
            </div>
          )}

          {/* Bouton de soumission */}
          <Button
            label={isLoading ? "Connexion en cours..." : "LOGIN"}
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            disabled={isLoading}
          />

        </form>

        {/* Lien vers Sign Up */}
        <p style={{
          textAlign:    "center",
          fontSize:     theme.fontSize.md,
          color:        "var(--color-text-secondary)",
          marginTop:    theme.spacing[6],
          marginBottom: 0,
        }}>
          Don't have an account?{" "}
          <span
            style={{
              color:      theme.colors.primary,
              fontWeight: theme.fontWeight.bold,
              cursor:     "pointer",
            }}
            onClick={() => navigate(ROUTES.SIGNUP)}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  )
}