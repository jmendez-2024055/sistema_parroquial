import { useState, useEffect } from 'react';

// ── Definición de temporadas ──────────────────────────────────────
const LITURGICAL_THEMES = {
  adviento: {
    label:      'Adviento',
    pageBg:     '#2d1b6e',          // Violeta oscuro
    cardBg:     '#ffffff',
    accent:     '#7c6fd4',
    btnBg:      '#6b5fd6',
    btnHover:   '#5a4ec4',
    btnShadow:  'rgba(107, 95, 214, 0.35)',
    focusRing:  'rgba(107, 95, 214, 0.20)',
    badgeColor: '#6b5fd6',
    badgeBg:    '#eeecf8',
    blobColor1: 'rgba(107, 95, 214, 0.18)',
    blobColor2: 'rgba(80, 60, 180, 0.12)',
    subtitleColor: '#6b5fd6',
  },
  navidad: {
    label:      'Navidad',
    pageBg:     '#1a0a00',          // Dorado oscuro / noche
    cardBg:     '#ffffff',
    accent:     '#c8940a',
    btnBg:      '#c8940a',
    btnHover:   '#a87a08',
    btnShadow:  'rgba(200, 148, 10, 0.35)',
    focusRing:  'rgba(200, 148, 10, 0.20)',
    badgeColor: '#b8860b',
    badgeBg:    '#fdf8e1',
    blobColor1: 'rgba(200, 148, 10, 0.15)',
    blobColor2: 'rgba(180, 120, 0, 0.10)',
    subtitleColor: '#c8940a',
  },
  cuaresma: {
    label:      'Cuaresma',
    pageBg:     '#1c0d00',          // Morado café oscuro
    cardBg:     '#ffffff',
    accent:     '#7c4a00',
    btnBg:      '#7c4a00',
    btnHover:   '#5e3700',
    btnShadow:  'rgba(124, 74, 0, 0.35)',
    focusRing:  'rgba(124, 74, 0, 0.20)',
    badgeColor: '#7c4a00',
    badgeBg:    '#fdf3e7',
    blobColor1: 'rgba(124, 74, 0, 0.15)',
    blobColor2: 'rgba(100, 50, 0, 0.10)',
    subtitleColor: '#7c4a00',
  },
  pascua: {
    label:      'Pascua',
    pageBg:     '#0a1a00',          // Verde oscuro / vida
    cardBg:     '#ffffff',
    accent:     '#4a9e1a',
    btnBg:      '#4a9e1a',
    btnHover:   '#3a8010',
    btnShadow:  'rgba(74, 158, 26, 0.35)',
    focusRing:  'rgba(74, 158, 26, 0.20)',
    badgeColor: '#3a7d44',
    badgeBg:    '#eaf3eb',
    blobColor1: 'rgba(74, 158, 26, 0.15)',
    blobColor2: 'rgba(50, 130, 10, 0.10)',
    subtitleColor: '#4a9e1a',
  },
  ordinario: {
    label:      'Tiempo ordinario',
    pageBg:     '#eceef5',          // Gris azulado suave (default)
    cardBg:     '#ffffff',
    accent:     '#3a7d44',
    btnBg:      '#6b5fd6',
    btnHover:   '#5a4ec4',
    btnShadow:  'rgba(107, 95, 214, 0.28)',
    focusRing:  'rgba(107, 95, 214, 0.12)',
    badgeColor: '#3a7d44',
    badgeBg:    '#eaf3eb',
    blobColor1: 'rgba(107, 95, 214, 0.12)',
    blobColor2: 'rgba(58, 125, 68, 0.10)',
    subtitleColor: '#3a7d44',
  },
};

// ── Función que calcula la temporada actual ───────────────────────
const getCurrentSeason = () => {
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

// ── Hook principal ────────────────────────────────────────────────
export const useLiturgicalTheme = () => {
  const [season, setSeason] = useState(getCurrentSeason);
  const theme = LITURGICAL_THEMES[season];

  useEffect(() => {
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
          applyTheme(LITURGICAL_THEMES[newSeason]);
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