import { Link } from 'react-router-dom';

export const UnauthorizedPage = () => (
  <main className="status-page">
    <span className="status-page__code">403</span>
    <h1>Acceso no autorizado</h1>
    <p>No tienes permisos para consultar esta sección del sistema.</p>
    <Link className="primary-button" to="/admin/dashboard">Volver al panel</Link>
  </main>
);

export default UnauthorizedPage;
