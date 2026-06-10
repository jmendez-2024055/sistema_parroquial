const DashboardHeader = () => (
  <header className="parish-dashboard__header">
    <div>
      <span className="parish-dashboard__eyebrow">Administración parroquial</span>
      <h1>Panel principal</h1>
    </div>

    <div className="liturgical-season" aria-label="Tiempo litúrgico actual">
      <span className="liturgical-season__indicator" aria-hidden="true" />
      <span>Tiempo ordinario</span>
    </div>
  </header>
);

export default DashboardHeader;
