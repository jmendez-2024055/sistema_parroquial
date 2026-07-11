import { useState, useEffect } from 'react';
import { liturgicalThemes } from '../../../shared/themes/liturgicalThemes.js';
import { getCurrentLiturgicalSeason } from '../../../shared/utils/liturgicalCalendar.js';

const DashboardHeader = () => {
  const [currentTheme, setCurrentTheme] = useState('ordinario');

  useEffect(() => {
    setCurrentTheme(getCurrentLiturgicalSeason());
  }, []);

  const theme = liturgicalThemes[currentTheme] || liturgicalThemes.ordinario;

  return (
    <header className="parish-dashboard__header">
      <div>
        <span className="parish-dashboard__eyebrow">Administración parroquial</span>
        <h1>Panel principal</h1>
      </div>

      <div className="liturgical-season" aria-label="Tiempo litúrgico actual">
        <span className="liturgical-season__indicator" aria-hidden="true" style={{ backgroundColor: theme.primary }} />
        <span>{theme.name}</span>
      </div>
    </header>
  );
};

export default DashboardHeader;
