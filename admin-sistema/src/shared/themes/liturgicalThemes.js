// Paletas de colores para tiempos litúrgicos
export const liturgicalThemes = {
  ordinario: {
    name: 'Tiempo Ordinario',
    primary: '#33590C',
    secondary: '#437314',
    tertiary: '#618C20',
    quaternary: '#BED996',
    background: '#EAF2DF',
    text: '#33590C',
    muted: '#437314',
    line: '#BED996',
    surface: '#FFFFFF',
    success: '#33590C',
    error: '#C53030',
    warning: '#DD6B20',
  },
  cuaresma: {
    name: 'Cuaresma',
    primary: '#3A378C',
    secondary: '#5450BF',
    tertiary: '#7A77D9',
    quaternary: '#B1AEF2',
    background: '#E4E4F2',
    text: '#3A378C',
    muted: '#5450BF',
    line: '#B1AEF2',
    surface: '#FFFFFF',
    success: '#3A378C',
    error: '#C53030',
    warning: '#DD6B20',
  },
  adviento: {
    name: 'Adviento',
    primary: '#3A378C',
    secondary: '#5450BF',
    tertiary: '#7A77D9',
    quaternary: '#B1AEF2',
    background: '#E4E4F2',
    text: '#3A378C',
    muted: '#5450BF',
    line: '#B1AEF2',
    surface: '#FFFFFF',
    success: '#3A378C',
    error: '#C53030',
    warning: '#DD6B20',
  },
  pascua: {
    name: 'Tiempo Pascual',
    primary: '#8C6316',
    secondary: '#A67721',
    tertiary: '#59451E',
    quaternary: '#F2E0BD',
    background: '#F2F0EB',
    text: '#8C6316',
    muted: '#A67721',
    line: '#F2E0BD',
    surface: '#FFFFFF',
    success: '#8C6316',
    error: '#C53030',
    warning: '#DD6B20',
  },
  navidad: {
    name: 'Navidad',
    primary: '#BF971F',
    secondary: '#D9CCA7',
    tertiary: '#73551F',
    quaternary: '#BF9341',
    background: '#F2F0EB',
    text: '#BF971F',
    muted: '#D9CCA7',
    line: '#BF9341',
    surface: '#FFFFFF',
    success: '#BF971F',
    error: '#C53030',
    warning: '#DD6B20',
  },
  pentecostes: {
    name: 'Pentecostés',
    primary: '#731F1F',
    secondary: '#A62E2E',
    tertiary: '#D94A4A',
    quaternary: '#F29999',
    background: '#F2E4E4',
    text: '#731F1F',
    muted: '#A62E2E',
    line: '#F29999',
    surface: '#FFFFFF',
    success: '#731F1F',
    error: '#C53030',
    warning: '#DD6B20',
  },
  triduo: {
    name: 'Triduo Pascual',
    primary: '#731D0A',
    secondary: '#8C2711',
    tertiary: '#BF3E21',
    quaternary: '#F2AFA0',
    background: '#F2E6E4',
    text: '#731D0A',
    muted: '#8C2711',
    line: '#F2AFA0',
    surface: '#FFFFFF',
    success: '#731D0A',
    error: '#C53030',
    warning: '#DD6B20',
  },
};

// Función para aplicar el tema litúrgico
export const applyLiturgicalTheme = (themeKey) => {
  const theme = liturgicalThemes[themeKey] || liturgicalThemes.ordinario;
  const root = document.documentElement;

  // Mapear las variables CSS del sistema a los colores del tema litúrgico
  const cssVariables = {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--tertiary': theme.tertiary,
    '--quaternary': theme.quaternary,
    '--green-950': theme.primary,
    '--green-900': theme.primary,
    '--green-800': theme.secondary,
    '--green-700': theme.secondary,
    '--green-100': theme.quaternary,
    '--green-50': theme.background,
    '--ink': theme.text,
    '--muted': theme.muted,
    '--line': theme.line,
    '--surface': theme.surface,
    '--background': theme.background,
    '--shadow': `0 12px 34px ${theme.primary}15`,
  };

  Object.entries(cssVariables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Guardar en localStorage
  localStorage.setItem('liturgicalTheme', themeKey);
};

// Función para cargar el tema guardado
export const loadSavedTheme = () => {
  const savedTheme = localStorage.getItem('liturgicalTheme');
  if (savedTheme && liturgicalThemes[savedTheme]) {
    applyLiturgicalTheme(savedTheme);
    return savedTheme;
  }
  return 'ordinario';
};
