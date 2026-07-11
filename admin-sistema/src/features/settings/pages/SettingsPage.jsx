import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { liturgicalThemes } from '../../../shared/themes/liturgicalThemes.js';
import { getCurrentLiturgicalSeason } from '../../../shared/utils/liturgicalCalendar.js';

const SettingsPage = () => {
  const [currentSeason, setCurrentSeason] = useState('ordinario');

  useEffect(() => {
    setCurrentSeason(getCurrentLiturgicalSeason());
  }, []);

  return (
    <DashboardContainer
      eyebrow="Configuración"
      title="Ajustes del sistema"
      description="Personaliza la apariencia y configuración del sistema parroquial."
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Sección de Tiempo Litúrgico - Solo información */}
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
            El color del sistema se actualiza automáticamente según el calendario litúrgico católico. Tiempo actual: <strong>{liturgicalThemes[currentSeason]?.name}</strong>
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: 'var(--background)',
            borderRadius: '12px',
            border: '1px solid var(--line)',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: liturgicalThemes[currentSeason]?.primary,
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }} />
            <div>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--text)',
              }}>
                {liturgicalThemes[currentSeason]?.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--muted)',
                marginTop: '4px',
              }}>
                Calculado automáticamente por fecha
              </div>
            </div>
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
                {liturgicalThemes[currentSeason]?.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default SettingsPage;
