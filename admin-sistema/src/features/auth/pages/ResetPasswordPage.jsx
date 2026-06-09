import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useResetPassword } from '../hooks/useForgotPassword.js';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import styles from '../../../styles/LoginPage.module.css';

// ── Validación ─────────────────────────────────────────────────────
const validate = ({ password, confirm }) => {
  const errors = {};
  if (!password)
    errors.password = 'La contraseña es obligatoria.';
  else if (password.length < 8)
    errors.password = 'La contraseña debe tener al menos 8 caracteres.';
  else if (!/[A-Z]/.test(password))
    errors.password = 'Debe contener al menos una letra mayúscula.';
  else if (!/[0-9]/.test(password))
    errors.password = 'Debe contener al menos un número.';

  if (!confirm)
    errors.confirm = 'Debes confirmar la contraseña.';
  else if (password && confirm !== password)
    errors.confirm = 'Las contraseñas no coinciden.';

  return errors;
};

// ── Indicador de fortaleza ─────────────────────────────────────────
const getStrength = (password) => {
  if (!password) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (password.length >= 8)  score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Muy débil',  color: '#e05252' };
  if (score === 2) return { score, label: 'Débil',      color: '#e07b52' };
  if (score === 3) return { score, label: 'Regular',    color: '#e0b852' };
  if (score === 4) return { score, label: 'Fuerte',     color: '#52a0e0' };
  return               { score, label: 'Muy fuerte', color: '#3a7d44' };
};

// ── Ícono ojo ──────────────────────────────────────────────────────
const EyeIcon   = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

// ── Requisito de contraseña ────────────────────────────────────────
const Req = ({ met, label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 12,
    color: met ? '#3a7d44' : '#9898b0',
    transition: 'color .2s',
  }}>
    <span style={{
      width: 14, height: 14, borderRadius: '50%',
      background: met ? '#3a7d44' : '#e8eaf0',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontSize: 9, fontWeight: 700,
      transition: 'background .2s',
      flexShrink: 0,
    }}>
      {met ? '✓' : ''}
    </span>
    {label}
  </span>
);

// ── Componente principal ───────────────────────────────────────────
export const ResetPasswordPage = () => {
  const { theme } = useLiturgicalTheme();
  const { status, message, resetPassword } = useResetPassword();
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const token          = searchParams.get('token');

  const [formData,  setFormData]  = useState({ password: '', confirm: '' });
  const [showPass,  setShowPass]  = useState(false);
  const [showConf,  setShowConf]  = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched,   setTouched]   = useState({});

  const strength = getStrength(formData.password);
  const isLoading = status === 'loading';
  const isSuccess = status === 'success';

  // Token inválido — mostrar error sin formulario
  const tokenMissing = !token;

  // Redirigir al login 4 s después del éxito
  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => navigate('/login', { replace: true }), 4000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, navigate]);

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
    setTouched({ password: true, confirm: true });
    const errs = validate(formData);
    setFieldErrs(errs);
    if (Object.keys(errs).length > 0) return;
    await resetPassword({ token, newPassword: formData.password });
  };

  return (
    <div className={styles.page} style={{ backgroundColor: theme.pageBg }}>

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
        <span className={styles.badge} style={{ color: theme.badgeColor, background: theme.badgeBg }}>
          <span className={styles.badgeDot} style={{ background: theme.badgeColor }} />
          {theme.label}
        </span>

        {/* ── Sin token ── */}
        {tokenMissing && <InvalidTokenState theme={theme} styles={styles} />}

        {/* ── Éxito ── */}
        {!tokenMissing && isSuccess && (
          <SuccessState theme={theme} styles={styles} />
        )}

        {/* ── Formulario ── */}
        {!tokenMissing && !isSuccess && (
          <>
            {/* Ícono candado desbloqueado */}
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: theme.badgeBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.accent, fontSize: 26, marginBottom: 16,
              boxShadow: `0 4px 16px ${theme.btnShadow}`,
            }}>
              🔑
            </div>

            <h2 className={styles.formTitle}>Crear nueva contraseña</h2>
            <p className={styles.formSubtitle} style={{ marginBottom: 28 }}>
              Elige una contraseña segura para tu cuenta.
            </p>

            <form onSubmit={handleSubmit} noValidate className={styles.form}>

              {/* Nueva contraseña */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Nueva contraseña</label>
                <div className={styles.passWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`${styles.input} ${fieldErrs.password ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button type="button" className={styles.eyeBtn} tabIndex={-1}
                    aria-label={showPass ? 'Ocultar' : 'Ver'}
                    onClick={() => setShowPass((v) => !v)}>
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldErrs.password && (
                  <span className={styles.errorMsg}>{fieldErrs.password}</span>
                )}

                {/* Barra de fortaleza */}
                {formData.password && (
                  <div style={{ marginTop: 6 }}>
                    <div style={{
                      height: 4, borderRadius: 4,
                      background: '#e8eaf0', overflow: 'hidden', width: '100%',
                    }}>
                      <div style={{
                        height: '100%', borderRadius: 4,
                        width: `${(strength.score / 5) * 100}%`,
                        background: strength.color,
                        transition: 'width .3s, background .3s',
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: strength.color, fontWeight: 600, marginTop: 3, display: 'block' }}>
                      {strength.label}
                    </span>
                  </div>
                )}

                {/* Requisitos */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 8 }}>
                  <Req met={formData.password.length >= 8}      label="8+ caracteres" />
                  <Req met={/[A-Z]/.test(formData.password)}    label="Una mayúscula" />
                  <Req met={/[0-9]/.test(formData.password)}    label="Un número" />
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Confirmar contraseña</label>
                <div className={styles.passWrap}>
                  <input
                    type={showConf ? 'text' : 'password'}
                    className={`${styles.input} ${fieldErrs.confirm ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.confirm}
                    onChange={(e) => handleChange('confirm', e.target.value)}
                    onBlur={() => handleBlur('confirm')}
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button type="button" className={styles.eyeBtn} tabIndex={-1}
                    aria-label={showConf ? 'Ocultar' : 'Ver'}
                    onClick={() => setShowConf((v) => !v)}>
                    {showConf ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {fieldErrs.confirm && (
                  <span className={styles.errorMsg}>{fieldErrs.confirm}</span>
                )}
                {/* Coincidencia visual */}
                {formData.confirm && !fieldErrs.confirm && formData.password === formData.confirm && (
                  <span style={{ fontSize: 12, color: '#3a7d44', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span>✓</span> Las contraseñas coinciden
                  </span>
                )}
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
                style={{ background: theme.btnBg, boxShadow: `0 6px 18px ${theme.btnShadow}`, marginTop: 4 }}
              >
                {isLoading ? (
                  <span className={styles.spinnerRow}>
                    <span className={styles.spinner} />
                    Actualizando contraseña…
                  </span>
                ) : 'Restablecer contraseña'}
              </button>

            </form>

            <div className={styles.links} style={{ marginTop: 20 }}>
              <Link to="/login" className={styles.forgotLink}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round">
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

// ── Sub-componente: éxito ──────────────────────────────────────────
const SuccessState = ({ theme, styles }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', padding: '8px 0' }}>
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: theme.badgeBg, color: theme.accent,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 32, fontWeight: 700,
      boxShadow: `0 4px 20px ${theme.btnShadow}`,
      animation: 'popIn .35s cubic-bezier(.175,.885,.32,1.275) both',
    }}>
      ✓
    </div>

    <h2 className={styles.formTitle} style={{ marginBottom: 0 }}>¡Contraseña actualizada!</h2>
    <p style={{ fontSize: 14, color: '#7a7a8c', textAlign: 'center', margin: '4px 0 12px', lineHeight: 1.6 }}>
      Tu contraseña fue restablecida exitosamente.<br/>
      Serás redirigido al inicio de sesión en unos segundos…
    </p>

    {/* Barra de progreso de redirección */}
    <div style={{ width: '100%', height: 4, borderRadius: 4, background: theme.badgeBg, overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 4,
        background: theme.accent,
        animation: 'progress 4s linear forwards',
      }} />
    </div>

    <Link to="/login" style={{
      marginTop: 12, fontSize: 14, fontWeight: 600, color: theme.btnBg,
      textDecoration: 'none',
    }}>
      Ir al inicio de sesión ahora
    </Link>

    <style>{`
      @keyframes popIn   { from { opacity: 0; transform: scale(.6); } to { opacity: 1; transform: scale(1); } }
      @keyframes progress { from { width: 0%; } to { width: 100%; } }
    `}</style>
  </div>
);

// ── Sub-componente: token inválido ─────────────────────────────────
const InvalidTokenState = ({ theme, styles }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%', padding: '8px 0' }}>
    <div style={{
      width: 68, height: 68, borderRadius: '50%',
      background: '#fff2f2', color: '#c0392b',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 28, fontWeight: 700,
    }}>
      ✕
    </div>
    <h2 className={styles.formTitle} style={{ marginBottom: 0, color: '#c0392b' }}>Enlace inválido</h2>
    <p style={{ fontSize: 14, color: '#7a7a8c', textAlign: 'center', margin: '4px 0 12px', lineHeight: 1.6 }}>
      Este enlace de recuperación no es válido o ya expiró.<br/>
      Los enlaces son válidos por <strong>30 minutos</strong>.
    </p>
    <Link
      to="/recover"
      style={{
        display: 'inline-block', padding: '12px 32px',
        background: theme.btnBg, color: '#fff',
        borderRadius: 10, fontWeight: 700, fontSize: 14.5,
        textDecoration: 'none',
        boxShadow: `0 6px 18px ${theme.btnShadow}`,
        transition: 'transform .15s',
      }}
    >
      Solicitar nuevo enlace
    </Link>
    <Link to="/login" className={styles.forgotLink}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Volver al inicio de sesión
    </Link>
  </div>
);

export default ResetPasswordPage;