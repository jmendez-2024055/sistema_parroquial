// src/features/auth/pages/RegisterParroquiaPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import { registerParroquiaRequest } from '../../../shared/apis/parroquiaService.js';
import styles from '../../../styles/RegisterPage.module.css';

// ── Validación ────────────────────────────────────────────────────
const validate = (data) => {
  const errors = {};

  // Datos de la parroquia
  if (!data.Nombre?.trim())
    errors.Nombre = 'El nombre de la parroquia es obligatorio.';
  else if (data.Nombre.trim().length > 100)
    errors.Nombre = 'Máximo 100 caracteres.';

  if (!data.Direccion?.trim())
    errors.Direccion = 'La dirección es obligatoria.';
  else if (data.Direccion.trim().length > 200)
    errors.Direccion = 'Máximo 200 caracteres.';

  // Datos del encargado
  if (!data.EncargadoNombre?.trim())
    errors.EncargadoNombre = 'El nombre del encargado es obligatorio.';
  else if (data.EncargadoNombre.trim().length > 25)
    errors.EncargadoNombre = 'Máximo 25 caracteres.';

  if (!data.EncargadoApellido?.trim())
    errors.EncargadoApellido = 'El apellido del encargado es obligatorio.';
  else if (data.EncargadoApellido.trim().length > 25)
    errors.EncargadoApellido = 'Máximo 25 caracteres.';

  if (!data.EncargadoUsername?.trim())
    errors.EncargadoUsername = 'El nombre de usuario es obligatorio.';
  else if (/\s/.test(data.EncargadoUsername) || /[^a-zA-Z0-9_-]/.test(data.EncargadoUsername))
    errors.EncargadoUsername = 'Sin espacios ni caracteres especiales.';

  if (!data.EncargadoEmail?.trim())
    errors.EncargadoEmail = 'El correo del encargado es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.EncargadoEmail))
    errors.EncargadoEmail = 'Correo electrónico inválido.';

  if (!data.EncargadoPassword)
    errors.EncargadoPassword = 'La contraseña es obligatoria.';
  else if (data.EncargadoPassword.length < 8)
    errors.EncargadoPassword = 'Mínimo 8 caracteres.';

  if (!data.EncargadoConfirmPassword)
    errors.EncargadoConfirmPassword = 'Confirma tu contraseña.';
  else if (data.EncargadoPassword !== data.EncargadoConfirmPassword)
    errors.EncargadoConfirmPassword = 'Las contraseñas no coinciden.';

  if (!data.EncargadoTelefono?.trim())
    errors.EncargadoTelefono = 'El teléfono del encargado es obligatorio.';
  else if (!/^\d{8}$/.test(data.EncargadoTelefono.trim()))
    errors.EncargadoTelefono = 'Debe tener exactamente 8 dígitos.';

  return errors;
};

// ── Componente ────────────────────────────────────────────────────
export const RegisterParroquiaPage = () => {
  const navigate = useNavigate();
  const { theme } = useLiturgicalTheme();

  const [formData, setFormData] = useState({
    Nombre: '',
    Direccion: '',
    Telefono: '',
    Email: '',
    EncargadoNombre: '',
    EncargadoApellido: '',
    EncargadoUsername: '',
    EncargadoEmail: '',
    EncargadoPassword: '',
    EncargadoConfirmPassword: '',
    EncargadoTelefono: '',
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [storeError, setStoreError] = useState('');

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

    setLoading(true);
    setStoreError('');

    try {
      // Enviamos sin EncargadoConfirmPassword (el backend no lo pide)
      const { EncargadoConfirmPassword, ...payload } = formData;
      const result = await registerParroquiaRequest(payload);

      if (result.success) {
        setSuccessMsg(
          result.message ||
          '¡Parroquia registrada! Revisa el correo del encargado para verificar la parroquia antes de continuar.'
        );
      } else {
        setStoreError(result.message || 'Error al registrar la parroquia');
      }
    } catch (error) {
      setStoreError(error.response?.data?.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
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
          <div className={styles.logoIcon} style={{ background: theme.accent }}>SP</div>
        </div>

        <h1 className={styles.title}>Sistema Parroquial</h1>
        <p className={styles.subtitle} style={{ color: theme.subtitleColor }}>
          Gestión parroquial integral
        </p>

        <span className={styles.badge} style={{ color: theme.badgeColor, background: theme.badgeBg }}>
          <span className={styles.badgeDot} style={{ background: theme.badgeColor }} />
          {theme.label}
        </span>

        <h2 className={styles.formTitle}>Registrar Parroquia</h2>
        <p className={styles.formSubtitle}>Completa los datos de la parroquia y del encargado</p>

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

            {/* Sección: Datos de la Parroquia */}
            <div style={{ marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#44445a', marginBottom: '16px' }}>
                Datos de la Parroquia
              </h3>

              <Field label="Nombre de la parroquia" error={fieldErrs.Nombre}>
                <input
                  className={`${styles.input} ${fieldErrs.Nombre ? styles.inputError : ''}`}
                  placeholder="Parroquia San Juan Bautista"
                  value={formData.Nombre}
                  onChange={(e) => handleChange('Nombre', e.target.value)}
                  onBlur={() => handleBlur('Nombre')}
                  disabled={loading}
                  maxLength={100}
                />
              </Field>

              <Field label="Dirección" error={fieldErrs.Direccion}>
                <input
                  className={`${styles.input} ${fieldErrs.Direccion ? styles.inputError : ''}`}
                  placeholder="Calle Principal #123"
                  value={formData.Direccion}
                  onChange={(e) => handleChange('Direccion', e.target.value)}
                  onBlur={() => handleBlur('Direccion')}
                  disabled={loading}
                  maxLength={200}
                />
              </Field>

              <div className={styles.row}>
                <Field label="Teléfono (opcional)" error={fieldErrs.Telefono}>
                  <input
                    className={`${styles.input} ${fieldErrs.Telefono ? styles.inputError : ''}`}
                    placeholder="55551234"
                    value={formData.Telefono}
                    onChange={(e) => handleChange('Telefono', e.target.value.replace(/\D/g, '').slice(0, 20))}
                    onBlur={() => handleBlur('Telefono')}
                    disabled={loading}
                    maxLength={20}
                  />
                </Field>

                <Field label="Email (opcional)" error={fieldErrs.Email}>
                  <input
                    type="email"
                    className={`${styles.input} ${fieldErrs.Email ? styles.inputError : ''}`}
                    placeholder="parroquia@email.com"
                    value={formData.Email}
                    onChange={(e) => handleChange('Email', e.target.value)}
                    onBlur={() => handleBlur('Email')}
                    disabled={loading}
                    maxLength={100}
                  />
                </Field>
              </div>
            </div>

            {/* Sección: Datos del Encargado */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#44445a', marginBottom: '16px' }}>
                Datos del Encargado
              </h3>

              <div className={styles.row}>
                <Field label="Nombre" error={fieldErrs.EncargadoNombre}>
                  <input
                    className={`${styles.input} ${fieldErrs.EncargadoNombre ? styles.inputError : ''}`}
                    placeholder="Carlos"
                    value={formData.EncargadoNombre}
                    onChange={(e) => handleChange('EncargadoNombre', e.target.value)}
                    onBlur={() => handleBlur('EncargadoNombre')}
                    disabled={loading}
                    maxLength={25}
                  />
                </Field>

                <Field label="Apellido" error={fieldErrs.EncargadoApellido}>
                  <input
                    className={`${styles.input} ${fieldErrs.EncargadoApellido ? styles.inputError : ''}`}
                    placeholder="Sánchez"
                    value={formData.EncargadoApellido}
                    onChange={(e) => handleChange('EncargadoApellido', e.target.value)}
                    onBlur={() => handleBlur('EncargadoApellido')}
                    disabled={loading}
                    maxLength={25}
                  />
                </Field>
              </div>

              <Field label="Nombre de usuario" error={fieldErrs.EncargadoUsername}
                hint="Sin espacios ni caracteres especiales">
                <input
                  className={`${styles.input} ${fieldErrs.EncargadoUsername ? styles.inputError : ''}`}
                  placeholder="csanchez-001"
                  value={formData.EncargadoUsername}
                  onChange={(e) => handleChange('EncargadoUsername', e.target.value)}
                  onBlur={() => handleBlur('EncargadoUsername')}
                  disabled={loading}
                  autoComplete="username"
                />
              </Field>

              <Field label="Correo electrónico" error={fieldErrs.EncargadoEmail}>
                <input
                  type="email"
                  className={`${styles.input} ${fieldErrs.EncargadoEmail ? styles.inputError : ''}`}
                  placeholder="csanchez@gmail.com"
                  value={formData.EncargadoEmail}
                  onChange={(e) => handleChange('EncargadoEmail', e.target.value)}
                  onBlur={() => handleBlur('EncargadoEmail')}
                  disabled={loading}
                  autoComplete="email"
                />
              </Field>

              <div className={styles.row}>
                <Field label="Contraseña" error={fieldErrs.EncargadoPassword}>
                  <div className={styles.passWrap}>
                    <input
                      type={showPass ? 'text' : 'password'}
                      className={`${styles.input} ${fieldErrs.EncargadoPassword ? styles.inputError : ''}`}
                      placeholder="••••••••"
                      value={formData.EncargadoPassword}
                      onChange={(e) => handleChange('EncargadoPassword', e.target.value)}
                      onBlur={() => handleBlur('EncargadoPassword')}
                      disabled={loading}
                      autoComplete="new-password"
                      minLength={8}
                    />
                    <EyeBtn show={showPass} toggle={() => setShowPass((v) => !v)} />
                  </div>
                </Field>

                <Field label="Confirmar contraseña" error={fieldErrs.EncargadoConfirmPassword}>
                  <div className={styles.passWrap}>
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      className={`${styles.input} ${fieldErrs.EncargadoConfirmPassword ? styles.inputError : ''}`}
                      placeholder="••••••••"
                      value={formData.EncargadoConfirmPassword}
                      onChange={(e) => handleChange('EncargadoConfirmPassword', e.target.value)}
                      onBlur={() => handleBlur('EncargadoConfirmPassword')}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                    <EyeBtn show={showConfirm} toggle={() => setShowConfirm((v) => !v)} />
                  </div>
                </Field>
              </div>

              <Field label="Teléfono" error={fieldErrs.EncargadoTelefono}
                hint="8 dígitos, sin guiones ni espacios">
                <input
                  type="tel"
                  className={`${styles.input} ${fieldErrs.EncargadoTelefono ? styles.inputError : ''}`}
                  placeholder="55551234"
                  value={formData.EncargadoTelefono}
                  onChange={(e) => handleChange('EncargadoTelefono', e.target.value.replace(/\D/g, '').slice(0, 8))}
                  onBlur={() => handleBlur('EncargadoTelefono')}
                  disabled={loading}
                  maxLength={8}
                />
              </Field>
            </div>

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
                  Registrando parroquia...
                </span>
              ) : 'Registrar Parroquia'}
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

export default RegisterParroquiaPage;
