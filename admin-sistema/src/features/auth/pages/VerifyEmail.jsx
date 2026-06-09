import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVerifyEmail } from '../hooks/useVerifyEmail.js';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import styles from '../../../styles/RegisterPage.module.css';

export const VerifyEmail = () => {
  const { status, message } = useVerifyEmail();
  const { theme } = useLiturgicalTheme();
  const navigate = useNavigate();

  // Redirige automáticamente al login 3 segundos después del éxito
  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => navigate('/login'), 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

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

        {/* ── Loading ── */}
        {status === 'loading' && (
          <div className={styles.successBox}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              border: `4px solid ${theme.badgeBg}`,
              borderTopColor: theme.accent,
              animation: 'spin .7s linear infinite',
            }} />
            <h2 className={styles.formTitle} style={{ marginBottom: 0 }}>
              Espera un momento…
            </h2>
            <p className={styles.successText} style={{ color: '#7a7a8c' }}>
              Estamos verificando tu correo electrónico.
            </p>
          </div>
        )}

        {/* ── Éxito ── */}
        {status === 'success' && (
          <div className={styles.successBox}>
            <div className={styles.successIcon}
              style={{ background: theme.badgeBg, color: theme.accent, fontSize: 28 }}>
              ✓
            </div>
            <h2 className={styles.formTitle} style={{ marginBottom: 0 }}>
              ¡Correo verificado!
            </h2>
            <p className={styles.successText}>{message}</p>
            <p className={styles.successText} style={{ color: '#9898b0', fontSize: 13 }}>
              Tu cuenta está activa. Serás redirigido al inicio de sesión en unos segundos…
            </p>
            {/* Barra de progreso */}
            <div style={{
              width: '100%', height: 4, borderRadius: 4,
              background: theme.badgeBg, overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 4,
                background: theme.accent,
                animation: 'progress 3s linear forwards',
              }} />
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {status === 'error' && (
          <div className={styles.successBox}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: '#fff2f2', color: '#c0392b',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 700,
            }}>
              ✕
            </div>
            <h2 className={styles.formTitle} style={{ marginBottom: 0, color: '#c0392b' }}>
              Verificación fallida
            </h2>
            <p className={styles.successText}>{message}</p>
            <p className={styles.successText} style={{ color: '#9898b0', fontSize: 13 }}>
              El enlace puede haber expirado (válido 24 horas).
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
};

export default VerifyEmail;