// src/features/auth/pages/VerifyParroquiaPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLiturgicalTheme } from '../hooks/useLiturgicalTheme.js';
import { verifyParroquiaRequest } from '../../../shared/apis/parroquiaService.js';
import styles from '../../../styles/RegisterPage.module.css';

// ── Componente ────────────────────────────────────────────────────
export const VerifyParroquiaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useLiturgicalTheme();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const verifyParroquia = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setLoading(false);
        setMessage('Token de verificación no proporcionado. Por favor, verifica el enlace en tu correo.');
        return;
      }

      try {
        const result = await verifyParroquiaRequest(token);
        
        if (result.success) {
          setSuccess(true);
          setMessage(result.message || '¡Parroquia verificada exitosamente! Tu cuenta de administrador ha sido creada.');
          setUsername(result.username || '');
        } else {
          setSuccess(false);
          setMessage(result.message || 'Error al verificar la parroquia. El token puede ser inválido o haber expirado.');
        }
      } catch (error) {
        setSuccess(false);
        setMessage(error.response?.data?.message || 'Error al conectar con el servidor. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    verifyParroquia();
  }, [searchParams]);

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

        <h2 className={styles.formTitle}>
          {loading ? 'Verificando parroquia...' : success ? '¡Verificación Exitosa!' : 'Error de Verificación'}
        </h2>

        {/* ── Loading ────────────────────────────────────────────── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div className={styles.spinner} style={{ 
              width: '50px', 
              height: '50px', 
              margin: '0 auto 20px',
              borderWidth: '3px',
              borderColor: theme.btnBg,
              borderRightColor: 'transparent'
            }} />
            <p style={{ color: '#666', fontSize: '14px' }}>
              Estamos verificando tu parroquia...
            </p>
          </div>
        ) : (
          <>
            {/* ── Success ──────────────────────────────────────────── */}
            {success ? (
              <div className={styles.successBox}>
                <div className={styles.successIcon}>✓</div>
                <p className={styles.successText}>{message}</p>
                {username && (
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    Tu usuario es: <strong>{username}</strong>
                  </p>
                )}
                <button
                  onClick={() => navigate('/login')}
                  className={styles.submitBtn}
                  style={{ 
                    background: theme.btnBg, 
                    boxShadow: `0 6px 18px ${theme.btnShadow}`,
                    textDecoration: 'none',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginTop: '24px'
                  }}
                >
                  Ir a iniciar sesión
                </button>
              </div>
            ) : (
              /* ── Error ──────────────────────────────────────────── */
              <div style={{ 
                textAlign: 'center', 
                padding: '40px 20px',
                backgroundColor: '#fee2e2',
                borderRadius: '12px',
                border: '1px solid #fecaca'
              }}>
                <div style={{ 
                  fontSize: '48px', 
                  marginBottom: '16px',
                  color: '#dc2626'
                }}>
                  ✕
                </div>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#991b1b',
                  marginBottom: '24px',
                  lineHeight: '1.5'
                }}>
                  {message}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => navigate('/login')}
                    className={styles.submitBtn}
                    style={{ 
                      background: theme.btnBg, 
                      boxShadow: `0 6px 18px ${theme.btnShadow}`,
                      textDecoration: 'none',
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center'
                    }}
                  >
                    Ir a iniciar sesión
                  </button>
                  <button
                    onClick={() => navigate('/register-parroquia')}
                    style={{
                      background: 'transparent',
                      border: `1px solid ${theme.btnBg}`,
                      color: theme.btnBg,
                      padding: '12px 24px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Registrar nueva parroquia
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>

    </div>
  );
};

export default VerifyParroquiaPage;
