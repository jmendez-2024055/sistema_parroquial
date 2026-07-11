import { NavLink } from 'react-router-dom';
import { AppIcon } from '../ui/AppIcon.jsx';
import { useAuthStore } from '../../../features/auth/store/authStore.js';

const navigation = [
  { to: '/admin/dashboard', label: 'Resumen', icon: 'dashboard', end: true },
  { to: '/admin/events', label: 'Eventos', icon: 'calendar' },
  { to: '/admin/notices', label: 'Avisos', icon: 'notice' },
  { to: '/admin/mass-schedules', label: 'Horarios de misa', icon: 'church' },
  { to: '/admin/intenciones', label: 'Intenciones', icon: 'heart' },
  { to: '/admin/groups', label: 'Grupos', icon: 'users' },
  { to: '/admin/users', label: 'Usuarios', icon: 'users', adminOnly: true },
  { to: '/admin/group-requests', label: 'Solicitudes de grupos', icon: 'users', adminOnly: true },
  { to: '/admin/group-management', label: 'Gestión de grupos', icon: 'settings', adminOnly: true },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? '';
  const isAdmin = role === 'ADMIN_ROLE';

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-mark">SP</div>
          <div>
            <strong>San Cristóbal</strong>
            <span>Administración parroquial</span>
          </div>
          <button className="icon-button sidebar__close" onClick={onClose} aria-label="Cerrar menú">
            <AppIcon name="close" />
          </button>
        </div>

        <nav className="sidebar__nav" aria-label="Navegación principal">
          <span className="sidebar__section-label">Gestión</span>
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
            >
              <AppIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          {isAdmin && (
            <NavLink to="/admin/settings" onClick={onClose} className="sidebar__link">
              <AppIcon name="settings" />
              <span>Configuración</span>
            </NavLink>
          )}
          <div className="sidebar__version">Sistema Parroquial · v1.0</div>
        </div>
      </aside>
      {isOpen && <button className="sidebar-overlay" onClick={onClose} aria-label="Cerrar menú" />}
    </>
  );
};

export default Sidebar;
