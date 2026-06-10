import { DashboardContainer } from '../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../shared/components/ui/AppIcon.jsx';

const ModulePage = ({ title, description }) => (
  <DashboardContainer
    eyebrow="Módulo administrativo"
    title={title}
    description={description}
    action={(
      <button className="primary-button" type="button">
        <AppIcon name="plus" size={18} />
        Nuevo registro
      </button>
    )}
  >
    <section className="content-card empty-state">
      <div className="empty-state__icon"><AppIcon name="settings" size={28} /></div>
      <h2>{title} está listo para crecer</h2>
      <p>La ruta y el espacio de trabajo ya forman parte del panel. La gestión de datos se incorporará en la siguiente fase.</p>
    </section>
  </DashboardContainer>
);

export default ModulePage;
