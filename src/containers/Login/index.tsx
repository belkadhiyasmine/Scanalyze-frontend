// ─────────────────────────────────────────────
//  pages/Login/Login.tsx
//  Page publique — accessible sans connexion
//  CONNECTÉE AU REDUX STORE
//  Concepts : Redux, useDispatch, useSelector,
//             validation formulaire, saga
// ─────────────────────────────────────────────

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";  // ← Redux hooks
import { ROUTES } from "../../navigation/routes";
import { loginRequest } from "../../store/auth/authSlice";  // ← action
import {
  selectIsLoading,
  selectAuthError,
  selectToken,
} from "../../store/auth/authSelectors";  // ← selectors

// ─────────────────────────────────────────────
export default function Login() {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();  // ← pour envoyer des actions à Redux

  // ── State local (UI seulement) ───────────────
  const [email, setEmail]               = useState<string>("");
  const [password, setPassword]         = useState<string>("");
  const [rememberMe, setRememberMe]     = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // ── State Redux (vient du store global) ──────
  const isLoading = useSelector(selectIsLoading);  // ← lit depuis Redux
  const error     = useSelector(selectAuthError);  // ← lit depuis Redux
  const token     = useSelector(selectToken);      // ← lit depuis Redux

  // ── Redirection automatique si login réussi ──
  // Quand Redux met à jour le token → on redirige
  useEffect(() => {
    if (token) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [token, navigate]);

  // ── Validation locale ────────────────────────
  const [localError, setLocalError] = useState<string>("");

  const validate = (): string => {
    if (!email || !password) return "Veuillez remplir tous les champs.";
    if (!email.includes("@")) return "Adresse email invalide.";
    return "";
  };

  // ── Soumission → dispatch vers Redux/Saga ────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError("");

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    // dispatch → authSlice → authSaga → API backend
    dispatch(loginRequest({ email, password }));
  };

  // ── Erreur à afficher (locale ou Redux) ──────
  const displayError = localError || error;

  // ── Rendu ────────────────────────────────────
  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* ── Logo ── */}
        <div style={styles.logoContainer}>
          <div style={styles.logoBox}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <rect width="52" height="52" rx="14" fill="#1a3a8f" />
              <path
                d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
                fill="white"
              />
            </svg>
          </div>
          <h1 style={styles.title}>Scanalyze</h1>
          <p style={styles.subtitle}>Intelligent Document Processing</p>
        </div>

        {/* ── Formulaire ── */}
        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
              Email or Username
            </label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              style={styles.input}
            />
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#6b7280">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                style={{ ...styles.input, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Remember me + Forgot password */}
          <div style={styles.row}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setRememberMe(e.target.checked)
                }
                style={styles.checkbox}
              />
              Remember me
            </label>
            <a href="/forgot-password" style={styles.link}>
              Forgot Password?
            </a>
          </div>

          {/* Erreur */}
          {displayError && (
            <div style={styles.errorBox}>⚠️ {displayError}</div>
          )}

          {/* Bouton LOGIN */}
          <button
            type="submit"
            style={{
              ...styles.loginBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Connexion en cours..." : "LOGIN"}
          </button>

        </form>

        {/* Lien Sign Up */}
        <p style={styles.signupText}>
          Don't have an account?{" "}
          <span
            style={styles.signupLink}
            onClick={() => navigate(ROUTES.SIGNUP)}
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}

// ── Styles ────────────────────────────────────
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px 16px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e0e0e0",
    padding: "40px 48px",
    width: "100%",
    maxWidth: "440px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "32px",
  },
  logoBox: { marginBottom: "12px" },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px",
    letterSpacing: "1px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#1a3a8f",
    margin: 0,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: "14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    accentColor: "#1a3a8f",
    cursor: "pointer",
  },
  link: {
    fontSize: "14px",
    color: "#1a3a8f",
    fontWeight: "600",
    textDecoration: "none",
  },
  errorBox: {
    fontSize: "13px",
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  loginBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "1.5px",
    border: "none",
    borderRadius: "8px",
    marginTop: "4px",
  },
  signupText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "24px",
    marginBottom: 0,
  },
  signupLink: {
    color: "#1a3a8f",
    fontWeight: "700",
    cursor: "pointer",
  },
};