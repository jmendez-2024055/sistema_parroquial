const StatCard = ({ label, value }) => (
  <article className="stat-card">
    <span className="stat-card__label">{label}</span>
    <strong className="stat-card__value">{value}</strong>
    <span className="stat-card__line" aria-hidden="true" />
  </article>
);

export default StatCard;
