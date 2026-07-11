import { useState, useEffect } from 'react';
import { liturgicalThemes, applyLiturgicalTheme } from '../../../shared/themes/liturgicalThemes.js';
import { getCurrentLiturgicalSeason } from '../../../shared/utils/liturgicalCalendar.js';

// ── Convertir tema litúrgico a formato para páginas de auth ──────────
const convertToAuthTheme = (liturgicalTheme) => {
  return {
    label: liturgicalTheme.name,
    pageBg: liturgicalTheme.background,
    cardBg: '#ffffff',
    accent: liturgicalTheme.primary,
    btnBg: liturgicalTheme.secondary,
    btnHover: liturgicalTheme.tertiary,
    btnShadow: `${liturgicalTheme.primary}59`,
    focusRing: `${liturgicalTheme.primary}33`,
    badgeColor: liturgicalTheme.primary,
    badgeBg: liturgicalTheme.background,
    blobColor1: `${liturgicalTheme.primary}2E`,
    blobColor2: `${liturgicalTheme.secondary}1F`,
    subtitleColor: liturgicalTheme.primary,
  };
};

// ── Hook principal ────────────────────────────────────────────────
export const useLiturgicalTheme = () => {
  const [season, setSeason] = useState(getCurrentLiturgicalSeason);
  const liturgicalTheme = liturgicalThemes[season] || liturgicalThemes.ordinario;
  const theme = convertToAuthTheme(liturgicalTheme);

  useEffect(() => {
    // Aplicar el tema litúrgico al cargar
    applyLiturgicalTheme(season);

    // Aplica variables CSS al body para que toda la página cambie
    const applyTheme = (t) => {
      document.body.style.backgroundColor = t.pageBg;
      document.body.style.transition       = 'background-color 1s ease';
    };

    applyTheme(theme);

    // Revisa cada hora si cambió la temporada litúrgica
    const interval = setInterval(() => {
      const newSeason = getCurrentLiturgicalSeason();
      setSeason((prev) => {
        if (prev !== newSeason) {
          applyLiturgicalTheme(newSeason);
          const newLiturgicalTheme = liturgicalThemes[newSeason] || liturgicalThemes.ordinario;
          const newAuthTheme = convertToAuthTheme(newLiturgicalTheme);
          applyTheme(newAuthTheme);
          return newSeason;
        }
        return prev;
      });
    }, 1000 * 60 * 60); // cada 1 hora

    // Limpia al desmontar
    return () => {
      clearInterval(interval);
      document.body.style.backgroundColor = '';
      document.body.style.transition       = '';
    };
  }, [theme]);

  return { season, theme };
};