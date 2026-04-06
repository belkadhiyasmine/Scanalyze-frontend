// ─────────────────────────────────────────────
//  pages/SignUp/SignUp.tsx
//  Page publique — accessible sans connexion 
// permet a l'utilisateur de : 
       // creer un compte
       //saisir ses informations 
       //choisir un role (Admin , Utilisateur)
       //valider ses donnees  
// ─────────────────────────────────────────────

import { useState } from "react";  //gestion des champs 
import { useNavigate } from "react-router-dom";  //navigation 
import { ROUTES } from "../../navigation/routes";

// ─────────────────────────────────────────────
export default function SignUp() {
  const navigate = useNavigate();

  // ── États ────────────────────────────────────
  const [fullName, setFullName]               = useState<string>("");  //on stocke toutes les donnees utilisateurs 
  const [email, setEmail]                     = useState<string>("");
  const [password, setPassword]               = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole]                       = useState<string>("");
  const [showPassword, setShowPassword]       = useState<boolean>(false);
  const [showConfirm, setShowConfirm]         = useState<boolean>(false);
  const [isLoading, setIsLoading]             = useState<boolean>(false);
  const [error, setError]                     = useState<string>("");

  // ── Validation ───────────────────────────────
  const validate = (): string => {  //ici on fais une validation complete 
    if (!fullName || !email || !password || !confirmPassword || !role)   //tous les champs sont obligatoires 
      return "Veuillez remplir tous les champs.";
    if (!email.includes("@"))   //email valide 
      return "Adresse email invalide.";
    if (password.length < 8)   //securité password 
      return "Le mot de passe doit contenir au moins 8 caractères.";
    if (!/\d/.test(password))   //au moins un chiffre 
      return "Le mot de passe doit contenir au moins un chiffre.";
    if (password !== confirmPassword)   //verification confirmation 
      return "Les mots de passe ne correspondent pas.";
    return "";
  };

  // ── Soumission ───────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();   //empecher reload
    setError("");

    const validationError = validate();   //validation (stop si erreur)
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);  //loading 
    try {
      // TODO : remplacer par votre vrai appel API
      // const response = await axios.post("/api/auth/register", {
      //   fullName, email, password, role
      // });
      // navigate(ROUTES.LOGIN);

      // Simulation temporaire
      await new Promise((res) => setTimeout(res, 1000));  //simulation API (backend)
      navigate(ROUTES.LOGIN);   //apres inscription -> login 

    } catch (err) {   //gestion erreur 
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Rendu ────────────────────────────────────
  //INTERFACE(JSX)
  return (
    <div style={styles.page}>

      {/* ── Logo ── */}
      <div style={styles.topLogo}>
        <div style={styles.logoCircle}>
          <svg width="30" height="30" viewBox="0 0 52 52" fill="none">
            <path
              d="M10 16h10v20H10V16zm12 0h14a7 7 0 010 14h-7v6H22V16zm7 8h6a1.5 1.5 0 000-3h-6v3z"
              fill="white"
            />
          </svg>
        </div>
        <h1 style={styles.topTitle}>Scanalyze</h1>
        <p style={styles.topSubtitle}>Traitement Intelligent des Documents</p>
      </div>

      {/* ── Carte formulaire ── */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Create your account</h2>

        <form onSubmit={handleSubmit} style={styles.form}>

          {/* Full Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFullName(e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>

          {/* Email */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Professional Email</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <input
                type="email"
                placeholder="email@company.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                style={styles.input}
              />
            </div>
          </div>

          {/* Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
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
            <p style={styles.hint}>
              Minimum 8 characters with at least one number.
            </p>
          </div>

          {/* Confirm Password */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setConfirmPassword(e.target.value)
                }
                style={{ ...styles.input, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={styles.eyeBtn}
              >
                {showConfirm ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Role */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.inputWrapper}>
              <svg style={styles.inputIcon} width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
              </svg>
              <select
                value={role}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setRole(e.target.value)
                }
                style={styles.select}
              >
                <option value="">Select your role</option>
                <option value="admin">Admin</option>
                <option value="utilisateur">Utilisateur</option>
              </select>
              <svg
                style={{ position: "absolute", right: "12px", pointerEvents: "none" }}
                width="16" height="16" viewBox="0 0 24 24" fill="#9ca3af"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </div>

            {/* Description du rôle */}
            {role === "admin" && (
              <p style={styles.roleHint}>
                👑 Admin : accès complet — gestion des utilisateurs, documents et statistiques.
              </p>
            )}
            {role === "utilisateur" && (
              <p style={styles.roleHint}>
                👤 Utilisateur : upload et traitement de documents, export des données.
              </p>
            )}
          </div>

          {/* Erreur */}
          {error && <div style={styles.errorBox}>⚠️ {error}</div>}  

          {/* Bouton Sign Up */}
          <button
            type="submit"
            style={{
              ...styles.signupBtn,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : "Sign Up →"}
          </button>

        </form>

        {/* Lien Login */}
        <p style={styles.loginText}>
          Already have an account?{" "}
          <span
            style={styles.loginLink}
            onClick={() => navigate(ROUTES.LOGIN)}  //retour vers login 
          >
            Login
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "24px 16px",
  },
  topLogo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "20px",
  },
  logoCircle: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    backgroundColor: "#1a3a8f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
  },
  topTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px",
    letterSpacing: "1px",
  },
  topSubtitle: {
    fontSize: "13px",
    color: "#1a3a8f",
    margin: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e0e0e0",
    padding: "36px 44px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 28px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
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
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "12px",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 36px",
    fontSize: "14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    color: "#111827",
    backgroundColor: "#fff",
    boxSizing: "border-box",
  },
  select: {
    width: "100%",
    padding: "12px 36px 12px 36px",
    fontSize: "14px",
    border: "1.5px solid #d1d5db",
    borderRadius: "8px",
    outline: "none",
    color: "#374151",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    appearance: "none",
    cursor: "pointer",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    margin: "2px 0 0",
    fontStyle: "italic",
  },
  roleHint: {
    fontSize: "12px",
    color: "#1a3a8f",
    backgroundColor: "#eff4ff",
    border: "1px solid #c7d7f9",
    borderRadius: "6px",
    padding: "8px 12px",
    margin: "4px 0 0",
  },
  errorBox: {
    fontSize: "13px",
    color: "#dc2626",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "10px 14px",
  },
  signupBtn: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1a3a8f",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    border: "none",
    borderRadius: "8px",
    marginTop: "4px",
  },
  loginText: {
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "20px",
    marginBottom: 0,
  },
  loginLink: {
    color: "#1a3a8f",
    fontWeight: "700",
    cursor: "pointer",
  },
};
