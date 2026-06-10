import StatCard from './StatCard.jsx';

const StatsGrid = ({ stats }) => (
  <section className="stats-grid" aria-label="Resumen semanal">
    {stats.map((stat) => (
      <StatCard key={stat.id} label={stat.label} value={stat.value} />
    ))}
  </section>
);

export default StatsGrid;
