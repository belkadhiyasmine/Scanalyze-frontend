// ─────────────────────────────────────────────
//  containers/Login/index.tsx
//  Page publique — seule page accessible sans connexion
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

import TextInput     from "../../components/TextInput/TextInput"
import Button        from "../../components/Button/Button"
import Loader        from "../../components/Loader/Loader"
import logoScanalyze from "../../assets/images/logo.svg"

// ── Type des données du formulaire ────────────
interface LoginFormData {
  email:    string  // champ email
  password: string  // champ mot de passe
}

// ─────────────────────────────────────────────
//  COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // ── Lecture du theme actif ─────────────────
  const { theme } = useTheme()

  // Raccourci pour éviter de répéter "theme.colors" partout
  const colors = theme.colors

  // ── React Hook Form ────────────────────────
  // register    : connecte chaque input au formulaire
  // handleSubmit: valide avant d'appeler onSubmit
  // watch       : lit la valeur d'un champ en temps réel
  // errors      : erreurs de validation par champ
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>()

  // ── Lecture du state Redux ─────────────────
  const isLoading  = useSelector(selectIsLoading)  // true pendant l'appel API
  const reduxError = useSelector(selectAuthError)  // erreur retournée par le backend
  const token      = useSelector(selectToken)      // token JWT si connecté

  // ── Redirection automatique ────────────────
  // Si token présent → utilisateur déjà connecté
  // → redirige directement vers le Dashboard
  useEffect(() => {
    if (token) navigate(ROUTES.DASHBOARD)
  }, [token, navigate])

  // ── Soumission du formulaire ───────────────
  // Appelée par handleSubmit après validation
  // → dispatch loginRequest → Saga → API
  const onSubmit = (data: LoginFormData) => {
    dispatch(loginRequest({ email: data.email, password: data.password }))
  }

  // ── Rendu ──────────────────────────────────
  return (
    <div
      style={{
        minHeight:       "100vh",
        backgroundColor: colors.bgApp,          // fond général selon le theme
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        fontFamily:      theme.fontFamily.sans,  // depuis typography.ts
        padding:         `${theme.spacing[6]} ${theme.spacing[4]}`, // 24px 16px
      }}
    >

      {/* ── Loader pleine page ─────────────────
          Affiché par dessus tout pendant le login */}
      {isLoading && (
        <Loader
          fullPage
          size="md"
          label="Connexion en cours..."
        />
      )}

      {/* ── Carte centrale ─────────────────────
          Contient logo + formulaire             */}
      <div
        style={{
          backgroundColor: colors.bgSurface,          // blanc light / sombre dark
          borderRadius:    theme.radius.xl,            // 16px — grands coins
          border:          `1px solid ${colors.border}`,
          padding:         theme.spacing[10],          // 40px
          width:           "100%",
          maxWidth:        "440px",
          boxShadow:       theme.shadows.lg,           // ombre depuis shadows.ts
        }}
      >

        {/* ── Logo + Titre ───────────────────────
            Logo SVG centré + nom + sous-titre    */}
        <div
          style={{
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            marginBottom:  theme.spacing[8],     // 32px sous le header
          }}
        >
          {/* Logo SVG Scanalyze */}
          <div style={{ marginBottom: theme.spacing[3] }}>
            <img
              src={logoScanalyze}
              alt="Scanalyze logo"
              height="80"
              style={{ display: "block" }}
            />
          </div>

          {/* Nom de l'application */}
          <h1
            style={{
              fontSize:      theme.fontSize.xxl,
              fontWeight:    theme.fontWeight.bold,
              color:         colors.textPrimary,       // foncé selon le theme
              margin:        `0 0 ${theme.spacing[1]}`,
              letterSpacing: theme.letterSpacing.wide,
            }}
          >
            Scanalyze
          </h1>

          {/* Sous-titre */}
          <p
            style={{
              fontSize: theme.fontSize.md,
              color:    colors.primary,                // bleu selon le theme
              margin:   0,
            }}
          >
            Intelligent Document Processing
          </p>
        </div>

        {/* ── Formulaire ─────────────────────────
            Email + Password + erreur + bouton    */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           theme.spacing[5],     // 20px entre les champs
          }}
        >

          {/* Champ Email */}
          {/* register() injecte onChange, onBlur, name, ref automatiquement */}
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

          {/* Champ Password */}
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

          {/* ── Erreur backend ─────────────────────
              Affichée si Redux retourne une erreur
              ex : "Email ou mot de passe incorrect" */}
          {reduxError && (
            <div
              style={{
                fontSize:        theme.fontSize.sm,
                color:           colors.error,          // rouge selon le theme
                backgroundColor: colors.errorBg,        // fond rouge clair
                border:          `1px solid ${colors.error}`,
                borderRadius:    theme.radius.md,        // 8px
                padding:         `${theme.spacing[2]} ${theme.spacing[3]}`, // 8px 12px
              }}
            >
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

        {/* ── Lien Sign Up ───────────────────────
            Redirige vers la page d'inscription   */}
        <p
          style={{
            textAlign:    "center",
            fontSize:     theme.fontSize.md,
            color:        colors.textSecondary,    // gris selon le theme
            marginTop:    theme.spacing[6],        // 24px
            marginBottom: 0,
          }}
        >
          Don't have an account?{" "}
          <span
            style={{
              color:      colors.primary,           // bleu selon le theme
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