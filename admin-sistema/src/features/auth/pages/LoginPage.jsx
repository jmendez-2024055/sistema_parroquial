// src/features/auth/pages/LoginPage.jsx

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import styles from '../../../styles/LoginPage.module.css';

// ── Validación ────────────────────────────────────────────────────
const validate = ({ username, password }) => {
  const errors = {};
  if (!username.trim())         errors.username = 'El usuario es obligatorio.';
  if (!password)                errors.password = 'La contraseña es obligatoria.';
  else if (password.length < 6) errors.password = 'Mínimo 6 caracteres.';
  return errors;
};

// ── Componente ────────────────────────────────────────────────────
export const LoginPage = () => {
  const navigate   = useNavigate();
  const login      = useAuthStore((s) => s.login);
  const loading    = useAuthStore((s) => s.loading);
  const storeError = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  // Hook de tiempo litúrgico — cambia colores automáticamente
  const { theme } = useLiturgicalTheme();

  const [formData, setFormData]   = useState({ username: '', password: '' });
  const [showPass,  setShowPass]  = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched,   setTouched]   = useState({});

  useEffect(() => { clearError(); }, []); 

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setFieldErrs((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setFieldErrs((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    const errs = validate(formData);
    setFieldErrs(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await login(formData);
    if (result.success) {
      const role = result.user?.role ?? '';
      navigate(role === 'ADMIN_ROLE' ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  };

  return (
    <div className={styles.page} style={{ backgroundColor: theme.pageBg }}>

      {/* Blobs decorativos con color de la temporada */}
      <div className={styles.bgBlob1} style={{ background: `radial-gradient(circle, ${theme.blobColor1}, transparent 70%)` }} />
      <div className={styles.bgBlob2} style={{ background: `radial-gradient(circle, ${theme.blobColor2}, transparent 70%)` }} />

      <div className={styles.card}>

        {/* Logo */}
        <div className={styles.logoWrap}>
          <div className={styles.logoIcon} style={{ background: theme.accent }}>✝</div>
        </div>

        <h1 className={styles.title}>Sistema Parroquial</h1>
        <p className={styles.subtitle} style={{ color: theme.subtitleColor }}>
          Gestión parroquial integral
        </p>

        {/* Badge litúrgico */}
        <span className={styles.badge} style={{ color: theme.badgeColor, background: theme.badgeBg }}>
          <span className={styles.badgeDot} style={{ background: theme.badgeColor }} />
          {theme.label}
        </span>

        <h2 className={styles.formTitle}>Bienvenido de vuelta</h2>
        <p className={styles.formSubtitle}>Inicia sesión para continuar</p>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>

          {/* Usuario */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Correo electrónico o usuario</label>
            <input
              type="text"
              className={`${styles.input} ${fieldErrs.username ? styles.inputError : ''}`}
              placeholder="juan@parroquia.com"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              onBlur={() => handleBlur('username')}
              disabled={loading}
              autoComplete="username"
            />
            {fieldErrs.username && (
              <span className={styles.errorMsg}>{fieldErrs.username}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Contraseña</label>
            <div className={styles.passWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                className={`${styles.input} ${fieldErrs.password ? styles.inputError : ''}`}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPass((v) => !v)}
                tabIndex={-1}
                aria-label={showPass ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPass ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
            {fieldErrs.password && (
              <span className={styles.errorMsg}>{fieldErrs.password}</span>
            )}
          </div>

          {/* Error servidor */}
          {storeError && (
            <div className={styles.globalError} role="alert">{storeError}</div>
          )}

          {/* Botón con color de la temporada */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            aria-busy={loading}
            style={{ background: theme.btnBg, boxShadow: `0 6px 18px ${theme.btnShadow}` }}
          >
            {loading ? (
              <span className={styles.spinnerRow}>
                <span className={styles.spinner} />
                Iniciando sesión...
              </span>
            ) : 'Iniciar sesión'}
          </button>

        </form>

        <div className={styles.links}>
          <p className={styles.linksText}>¿No tienes cuenta?</p>
          <Link to="/register" className={styles.link} style={{ color: theme.btnBg }}>
            Crear una cuenta nueva
          </Link>
        </div>

        <div className={styles.forgotWrap}>
          <Link to="/recover" className={styles.forgotLink}>¿Olvidaste tu contraseña?</Link>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;