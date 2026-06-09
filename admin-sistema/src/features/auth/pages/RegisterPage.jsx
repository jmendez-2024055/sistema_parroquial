// src/features/auth/pages/RegisterPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import styles from '../../../styles/RegisterPage.module.css';

// ── Validación ────────────────────────────────────────────────────
const validate = (data) => {
  const errors = {};

  if (!data.Name?.trim())
    errors.Name = 'El nombre es obligatorio.';
  else if (data.Name.trim().length > 25)
    errors.Name = 'Máximo 25 caracteres.';

  if (!data.Surname?.trim())
    errors.Surname = 'El apellido es obligatorio.';
  else if (data.Surname.trim().length > 25)
    errors.Surname = 'Máximo 25 caracteres.';

  if (!data.Username?.trim())
    errors.Username = 'El nombre de usuario es obligatorio.';
  else if (/\s/.test(data.Username) || /[^a-zA-Z0-9_-]/.test(data.Username))
    errors.Username = 'Sin espacios ni caracteres especiales.';

  if (!data.Email?.trim())
    errors.Email = 'El correo es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email))
    errors.Email = 'Correo electrónico inválido.';

  if (!data.Password)
    errors.Password = 'La contraseña es obligatoria.';
  else if (data.Password.length < 8)
    errors.Password = 'Mínimo 8 caracteres.';

  if (!data.ConfirmPassword)
    errors.ConfirmPassword = 'Confirma tu contraseña.';
  else if (data.Password !== data.ConfirmPassword)
    errors.ConfirmPassword = 'Las contraseñas no coinciden.';

  if (!data.Phone?.trim())
    errors.Phone = 'El teléfono es obligatorio.';
  else if (!/^\d{8}$/.test(data.Phone.trim()))
    errors.Phone = 'Debe tener exactamente 8 dígitos.';

  return errors;
};

// ── Componente ────────────────────────────────────────────────────
export const RegisterPage = () => {
  const navigate     = useNavigate();
  const register     = useAuthStore((s) => s.register);
  const loading      = useAuthStore((s) => s.loading);
  const storeError   = useAuthStore((s) => s.error);
  const clearError   = useAuthStore((s) => s.clearError);

  const { theme } = useLiturgicalTheme();

  const [formData, setFormData] = useState({
    Name: '', Surname: '', Username: '', Email: '',
    Password: '', ConfirmPassword: '', Phone: '',
  });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrs,   setFieldErrs]   = useState({});
  const [touched,     setTouched]     = useState({});
  const [successMsg,  setSuccessMsg]  = useState('');

  useEffect(() => { clearError(); }, []); // eslint-disable-line

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
    const allTouched = Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(formData);
    setFieldErrs(errs);
    if (Object.keys(errs).length > 0) return;

    // Enviamos sin ConfirmPassword (el backend no lo pide)
    const { ConfirmPassword, ...payload } = formData;
    const result = await register(payload);

    if (result.success) {
      setSuccessMsg(
        result.message ||
        '¡Cuenta creada! Revisa tu correo para verificar tu cuenta antes de iniciar sesión.'
      );
    }
  };

  // ── Render ─────────────────────────────────────────────────────
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

        <h2 className={styles.formTitle}>Crear cuenta</h2>
        <p className={styles.formSubtitle}>Completa los datos para registrarte</p>

        {/* ── Éxito ────────────────────────────────────────────── */}
        {successMsg ? (
          <div className={styles.successBox}>
            <div className={styles.successIcon}>✓</div>
            <p className={styles.successText}>{successMsg}</p>
            <Link
              to="/login"
              className={styles.submitBtn}
              style={{ background: theme.btnBg, textDecoration: 'none',
                       display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              Ir a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className={styles.form}>

            {/* Nombre + Apellido */}
            <div className={styles.row}>
              <Field label="Nombre" error={fieldErrs.Name}>
                <input
                  className={`${styles.input} ${fieldErrs.Name ? styles.inputError : ''}`}
                  placeholder="Carlos"
                  value={formData.Name}
                  onChange={(e) => handleChange('Name', e.target.value)}
                  onBlur={() => handleBlur('Name')}
                  disabled={loading}
                  maxLength={25}
                />
              </Field>

              <Field label="Apellido" error={fieldErrs.Surname}>
                <input
                  className={`${styles.input} ${fieldErrs.Surname ? styles.inputError : ''}`}
                  placeholder="Sánchez"
                  value={formData.Surname}
                  onChange={(e) => handleChange('Surname', e.target.value)}
                  onBlur={() => handleBlur('Surname')}
                  disabled={loading}
                  maxLength={25}
                />
              </Field>
            </div>

            {/* Username */}
            <Field label="Nombre de usuario" error={fieldErrs.Username}
              hint="Sin espacios ni caracteres especiales">
              <input
                className={`${styles.input} ${fieldErrs.Username ? styles.inputError : ''}`}
                placeholder="csanchez-001"
                value={formData.Username}
                onChange={(e) => handleChange('Username', e.target.value)}
                onBlur={() => handleBlur('Username')}
                disabled={loading}
                autoComplete="username"
              />
            </Field>

            {/* Email */}
            <Field label="Correo electrónico" error={fieldErrs.Email}>
              <input
                type="email"
                className={`${styles.input} ${fieldErrs.Email ? styles.inputError : ''}`}
                placeholder="csanchez@gmail.com"
                value={formData.Email}
                onChange={(e) => handleChange('Email', e.target.value)}
                onBlur={() => handleBlur('Email')}
                disabled={loading}
                autoComplete="email"
              />
            </Field>

            {/* Contraseña + Confirmar */}
            <div className={styles.row}>
              <Field label="Contraseña" error={fieldErrs.Password}>
                <div className={styles.passWrap}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className={`${styles.input} ${fieldErrs.Password ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.Password}
                    onChange={(e) => handleChange('Password', e.target.value)}
                    onBlur={() => handleBlur('Password')}
                    disabled={loading}
                    autoComplete="new-password"
                    minLength={8}
                  />
                  <EyeBtn show={showPass} toggle={() => setShowPass((v) => !v)} />
                </div>
              </Field>

              <Field label="Confirmar contraseña" error={fieldErrs.ConfirmPassword}>
                <div className={styles.passWrap}>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`${styles.input} ${fieldErrs.ConfirmPassword ? styles.inputError : ''}`}
                    placeholder="••••••••"
                    value={formData.ConfirmPassword}
                    onChange={(e) => handleChange('ConfirmPassword', e.target.value)}
                    onBlur={() => handleBlur('ConfirmPassword')}
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <EyeBtn show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
                </div>
              </Field>
            </div>

            {/* Teléfono */}
            <Field label="Teléfono" error={fieldErrs.Phone}
              hint="8 dígitos, sin guiones ni espacios">
              <input
                type="tel"
                className={`${styles.input} ${fieldErrs.Phone ? styles.inputError : ''}`}
                placeholder="55551234"
                value={formData.Phone}
                onChange={(e) => handleChange('Phone', e.target.value.replace(/\D/g, '').slice(0, 8))}
                onBlur={() => handleBlur('Phone')}
                disabled={loading}
                maxLength={8}
              />
            </Field>

            {/* Error servidor */}
            {storeError && (
              <div className={styles.globalError} role="alert">{storeError}</div>
            )}

            {/* Submit */}
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
                  Creando cuenta...
                </span>
              ) : 'Crear cuenta'}
            </button>

          </form>
        )}

        <div className={styles.links}>
          <p className={styles.linksText}>¿Ya tienes cuenta?{' '}
            <Link to="/login" className={styles.link} style={{ color: theme.btnBg }}>
              Inicia sesión
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

// ── Sub-componentes ────────────────────────────────────────────────
const Field = ({ label, hint, error, children }) => {
  // (importar styles desde el módulo del padre via closure no es posible;
  //  usaremos estilos inline/globales o repetimos classname)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%', textAlign: 'left' }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#44445a' }}>{label}</label>
      {hint && <span style={{ fontSize: 11, color: '#9898b0', marginTop: -2 }}>{hint}</span>}
      {children}
      {error && <span style={{ fontSize: 12, color: '#e05252', fontWeight: 500 }}>{error}</span>}
    </div>
  );
};

const EyeBtn = ({ show, toggle }) => (
  <button type="button" onClick={toggle} tabIndex={-1}
    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
             background: 'none', border: 'none', cursor: 'pointer', padding: 0,
             display: 'flex', alignItems: 'center', color: '#9898b0' }}
    aria-label={show ? 'Ocultar contraseña' : 'Ver contraseña'}>
    {show ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    )}
  </button>
);

export default RegisterPage;