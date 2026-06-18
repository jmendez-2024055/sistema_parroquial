import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { liturgicalThemes, applyLiturgicalTheme, loadSavedTheme } from '../../../shared/themes/liturgicalThemes.js';

const SettingsPage = () => {
  const [currentTheme, setCurrentTheme] = useState('ordinario');

  useEffect(() => {
    const savedTheme = loadSavedTheme();
    setCurrentTheme(savedTheme);
  }, []);

  const handleThemeChange = (themeKey) => {
    setCurrentTheme(themeKey);
    applyLiturgicalTheme(themeKey);
  };

  return (
    <DashboardContainer
      eyebrow="Configuración"
      title="Ajustes del sistema"
      description="Personaliza la apariencia y configuración del sistema parroquial."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Sección de Tiempo Litúrgico */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{
            margin: '0 0 16px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            color: 'var(--text)',
          }}>
            Tiempo Litúrgico
          </h3>
          <p style={{
            margin: '0 0 20px',
            fontSize: '14px',
            color: 'var(--muted)',
            lineHeight: 1.5,
          }}>
            Selecciona el tiempo litúrgico actual para cambiar la paleta de colores del sistema.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            {Object.entries(liturgicalThemes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => handleThemeChange(key)}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${currentTheme === key ? theme.primary : 'var(--line)'}`,
                  background: currentTheme === key ? `${theme.primary}15` : 'var(--surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (currentTheme !== key) {
                    e.currentTarget.style.borderColor = theme.primary;
                    e.currentTarget.style.background = `${theme.primary}10`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentTheme !== key) {
                    e.currentTarget.style.borderColor = 'var(--line)';
                    e.currentTarget.style.background = 'var(--surface)';
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: theme.primary,
                    border: '2px solid white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  }} />
                  <span style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--text)',
                  }}>
                    {theme.name}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  gap: '6px',
                }}>
                  {[theme.primary, theme.secondary, theme.accent].map((color, i) => (
                    <div
                      key={i}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        background: color,
                        border: '1px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sección de Información */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--line)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        }}>
          <h3 style={{
            margin: '0 0 16px',
            fontFamily: "'Playfair Display', serif",
            fontSize: '20px',
            color: 'var(--text)',
          }}>
            Información del Sistema
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Versión
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text)' }}>
                1.0.0
              </p>
            </div>
            <div>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase' }}>
                Tema actual
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text)' }}>
                {liturgicalThemes[currentTheme]?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default SettingsPage;
