import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useForgotPassword.js';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import styles from '../../../styles/LoginPage.module.css';

// ── Validación ─────────────────────────────────────────────────────
const validateEmail = (email) => {
  if (!email.trim()) return 'El correo electrónico es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return 'Ingresa un correo electrónico válido.';
  return null;
};

// ── Ícono Email SVG ────────────────────────────────────────────────
const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

// ── Ícono Candado SVG ──────────────────────────────────────────────
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// ── Componente principal ───────────────────────────────────────────
export const ForgotPasswordPage = () => {
  const { theme } = useLiturgicalTheme();
  const { status, message, sendResetLink, resetState } = useForgotPassword();

  const [email,    setEmail]    = useState('');
  const [fieldErr, setFieldErr] = useState('');
  const [touched,  setTouched]  = useState(false);

  // Limpiar al montar
  useEffect(() => { resetState(); }, []); // eslint-disable-line

  const handleChange = (value) => {
    setEmail(value);
    if (touched) setFieldErr(validateEmail(value) || '');
  };

  const handleBlur = () => {
    setTouched(true);
    setFieldErr(validateEmail(email) || '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const err = validateEmail(email);
    if (err) { setFieldErr(err); return; }
    setFieldErr('');
    await sendResetLink(email);
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  return (
    <div className={styles.page} style={{ backgroundColor: theme.pageBg }}>

      {/* Blobs decorativos */}
      <div className={styles.bgBlob1}
        style={{ background: `radial-gradient(circle, ${theme.blobColor1}, transparent 70%)` }} />
      <div className={styles.bgBlob2}
        style={{ background: `radial-gradient(circle, ${theme.blobColor2}, transparent 70%)` }} />

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

        {/* ── Estado: éxito ── */}
        {isSuccess ? (
          <SuccessState email={email} theme={theme} styles={styles} />
        ) : (
          <>
            {/* Ícono de acción */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: theme.badgeBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.accent,
              marginBottom: 16,
              boxShadow: `0 4px 16px ${theme.btnShadow}`,
            }}>
              <LockIcon />
            </div>

            <h2 className={styles.formTitle}>¿Olvidaste tu contraseña?</h2>
            <p className={styles.formSubtitle} style={{ marginBottom: 28 }}>
              Sin problema. Ingresa tu correo y te enviaremos un enlace para restablecerla.
            </p>

            <form onSubmit={handleSubmit} noValidate className={styles.form}>

              {/* Campo email */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Correo electrónico</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 13, top: '50%',
                    transform: 'translateY(-50%)',
                    color: fieldErr ? '#e05252' : '#9898b0',
                    pointerEvents: 'none',
                    display: 'flex', alignItems: 'center',
                  }}>
                    <EmailIcon />
                  </span>
                  <input
                    type="email"
                    className={`${styles.input} ${fieldErr ? styles.inputError : ''}`}
                    placeholder="juan@parroquia.com"
                    value={email}
                    onChange={(e) => handleChange(e.target.value)}
                    onBlur={handleBlur}
                    disabled={isLoading}
                    autoComplete="email"
                    style={{ paddingLeft: 44 }}
                  />
                </div>
                {fieldErr && <span className={styles.errorMsg}>{fieldErr}</span>}
              </div>

              {/* Error del servidor */}
              {status === 'error' && (
                <div className={styles.globalError} role="alert">
                  <span style={{ marginRight: 6 }}>⚠</span>
                  {message}
                </div>
              )}

              {/* Botón */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isLoading}
                aria-busy={isLoading}
                style={{
                  background: theme.btnBg,
                  boxShadow: `0 6px 18px ${theme.btnShadow}`,
                  marginTop: 4,
                }}
              >
                {isLoading ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} />
                    Enviando enlace…
                  </span>
                ) : 'Enviar enlace de recuperación'}
              </button>

            </form>

            {/* Volver al login */}
            <div className={styles.links} style={{ marginTop: 24 }}>
              <Link to="/login" className={styles.forgotLink}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ── Sub-componente: estado de éxito ────────────────────────────────
const SuccessState = ({ email, theme, styles }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', gap: 12, width: '100%',
    padding: '8px 0',
  }}>
    {/* Ícono check animado */}
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: theme.badgeBg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: theme.accent, fontSize: 32, fontWeight: 700,
      boxShadow: `0 4px 20px ${theme.btnShadow}`,
      animation: 'popIn .35s cubic-bezier(.175,.885,.32,1.275) both',
    }}>
      ✓
    </div>

    <h2 className={styles.formTitle} style={{ marginBottom: 0 }}>
      ¡Correo enviado!
    </h2>

    <p style={{ fontSize: 14, color: '#7a7a8c', textAlign: 'center', margin: '4px 0', lineHeight: 1.5 }}>
      Enviamos un enlace de recuperación a
    </p>
    <span style={{
      fontSize: 14, fontWeight: 700, color: theme.accent,
      background: theme.badgeBg, padding: '4px 14px',
      borderRadius: 20, wordBreak: 'break-all', textAlign: 'center',
    }}>
      {email}
    </span>

    <p style={{
      fontSize: 13, color: '#9898b0', textAlign: 'center',
      margin: '8px 0 4px', lineHeight: 1.6,
    }}>
      Revisa tu bandeja de entrada (y la carpeta de spam). El enlace es válido por <strong>30 minutos</strong>.
    </p>

    {/* Separador */}
    <div style={{
      width: '100%', height: 1,
      background: '#e8eaf0', margin: '8px 0',
    }} />

    <p style={{ fontSize: 13, color: '#7a7a8c', margin: 0 }}>
      ¿No llegó el correo?
    </p>

    <Link to="/recover"
      onClick={() => window.location.reload()}
      style={{
        fontSize: 14, fontWeight: 600, color: theme.btnBg,
        textDecoration: 'none',
      }}
    >
      Reenviar enlace
    </Link>

    <Link to="/login" style={{
      marginTop: 8, fontSize: 13, color: '#7a7a8c',
      textDecoration: 'none',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      transition: 'color .2s',
    }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver al inicio de sesión
    </Link>

    <style>{`
      @keyframes popIn {
        from { opacity: 0; transform: scale(.6); }
        to   { opacity: 1; transform: scale(1); }
      }
    `}</style>
  </div>
);

export default ForgotPasswordPage;