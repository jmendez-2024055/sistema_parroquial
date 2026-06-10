export const DashboardContainer = ({ eyebrow, title, description, action, children }) => (
  <section className="page-container">
    <header className="page-header">
      <div>
        {eyebrow && <span className="page-header__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {action}
    </header>
    {children}
  </section>
);

export default DashboardContainer;
