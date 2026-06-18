import { useState, useEffect } from 'react';
import { liturgicalThemes, loadSavedTheme } from '../../../shared/themes/liturgicalThemes.js';

// ── Función que calcula la temporada actual ───────────────────────
const getCurrentSeason = () => {
  // Primero verificar si hay un tema guardado en localStorage
  const savedTheme = localStorage.getItem('liturgicalTheme');
  if (savedTheme && liturgicalThemes[savedTheme]) {
    return savedTheme;
  }

  // Si no hay tema guardado, calcular por fecha
  const now   = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day   = now.getDate();

  if ((month === 11 && day >= 27) || (month === 12 && day <= 24))
    return 'adviento';
  if ((month === 12 && day >= 25) || (month === 1 && day <= 12))
    return 'navidad';
  if (month === 2 || (month === 3 && day <= 20))
    return 'cuaresma';
  if (month >= 4 && month <= 5)
    return 'pascua';
  return 'ordinario';
};

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
  const [season, setSeason] = useState(getCurrentSeason);
  const liturgicalTheme = liturgicalThemes[season] || liturgicalThemes.ordinario;
  const theme = convertToAuthTheme(liturgicalTheme);

  useEffect(() => {
    // Aplicar el tema litúrgico al cargar
    loadSavedTheme();

    // Aplica variables CSS al body para que toda la página cambie
    const applyTheme = (t) => {
      document.body.style.backgroundColor = t.pageBg;
      document.body.style.transition       = 'background-color 1s ease';
    };

    applyTheme(theme);

    // Revisa cada hora si cambió la temporada litúrgica
    const interval = setInterval(() => {
      const newSeason = getCurrentSeason();
      setSeason((prev) => {
        if (prev !== newSeason) {
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