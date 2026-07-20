import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../../features/auth/store/authStore.js';
import { AppIcon } from '../ui/AppIcon.jsx';
import { AvatarUser } from '../ui/AvatarUser.jsx';

const pageNames = {
  dashboard: 'Resumen',
  events: 'Eventos',
  notices: 'Avisos',
  'mass-schedules': 'Horarios de misa',
  categories: 'Categorías',
  users: 'Usuarios',
  settings: 'Configuración',
};

export const Navbar = ({ onMenuClick }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const segment = location.pathname.split('/').filter(Boolean).at(-1);
  const userName = user?.name ?? user?.fullName ?? user?.username ?? 'Administrador';
  const role = user?.role?.name ?? user?.role ?? 'Equipo parroquial';
  
  const isAdmin = role === 'ADMIN_ROLE';
  const sectionLabel = isAdmin ? 'Panel administrativo' : 'Panel principal';

  return (
    <header className="navbar">
      <div className="navbar__heading">
        <button className="icon-button navbar__menu" onClick={onMenuClick} aria-label="Abrir menú">
          <AppIcon name="menu" />
        </button>
        <div>
          <span>{sectionLabel}</span>
          <strong>{pageNames[segment] ?? 'Sistema Parroquial'}</strong>
        </div>
      </div>

      <div className="navbar__actions">
        <label className="navbar__search">
          <AppIcon name="search" size={18} />
          <input type="search" placeholder="Buscar en el sistema" aria-label="Buscar en el sistema" />
        </label>
        <div className="navbar__user">
          <AvatarUser user={user} />
          <div>
            <strong>{userName}</strong>
            <span>{role}</span>
          </div>
        </div>
        <button className="icon-button" onClick={logout} title="Cerrar sesión" aria-label="Cerrar sesión">
          <AppIcon name="logout" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
