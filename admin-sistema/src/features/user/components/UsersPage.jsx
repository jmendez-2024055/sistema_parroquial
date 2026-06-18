import { useEffect, useState } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useUserStore from '../store/useUserStore.js';
import { UserForm } from './UserForm.jsx';
import { useAuthStore } from '../../auth/store/authStore.js';

const roleBadgeClass = (role) => {
  const map = {
    'ADMIN_ROLE': 'role-badge--admin',
    'USER_ROLE': 'role-badge--user',
  };
  return map[role] || 'role-badge--default';
};

export const UsersPage = () => {
  const { users, loading, error, fetchUsers, updateUserRole, clearError } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? '';
  const isAdmin = role === 'ADMIN_ROLE';

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateSuccess = () => {
    setShowForm(false);
    clearError();
  };

  const handleRoleChange = async (userId, newRole) => {
    await updateUserRole(userId, newRole);
  };

  const formatFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-GT', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <DashboardContainer
      eyebrow="Gestión de usuarios"
      title="Usuarios"
      description="Administra usuarios, perfiles y accesos del sistema."
      action={
        isAdmin && !showForm && (
          <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
            <AppIcon name="plus" size={18} />
            Nuevo usuario
          </button>
        )
      }
    >
      {showForm && (
        <UserForm onSuccess={handleCreateSuccess} onCancel={() => setShowForm(false)} />
      )}

      {!showForm && (
        <>
          {error && (
            <div style={{
              padding: '12px 16px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: '1px solid #fed7d7',
              background: '#fff5f5',
              color: '#c53030',
              fontSize: '13px',
            }}>
              {error}
            </div>
          )}

          {loading && users.length === 0 ? (
            <section className="content-card empty-state">
              <div className="route-loader__spinner" style={{ width: 24, height: 24 }} />
              <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando usuarios...</p>
            </section>
          ) : users.length === 0 ? (
            <section className="content-card empty-state">
              <div className="empty-state__icon">
                <AppIcon name="users" size={48} />
              </div>
              <h2>No hay usuarios registrados</h2>
              <p>Crea el primer usuario del sistema haciendo clic en "Nuevo usuario".</p>
            </section>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}>
              {users.map((user) => (
                <div key={user.id} style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--line)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 16px rgba(28,55,42,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  transition: 'transform .2s ease, box-shadow .2s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 28px rgba(28,55,42,0.12)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,55,42,0.06)';
                  }}
                >
                  {/* Decorative top border */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, var(--green-700), var(--green-500))',
                  }} />

                  {/* Header con rol y estado */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <span className={`category-badge ${roleBadgeClass(user.role || 'USER_ROLE')}`}>
                      {user.role === 'ADMIN_ROLE' ? 'Administrador' : 'Usuario'}
                    </span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: String(user.status || 'active').toLowerCase() === 'active' ? 'var(--green-50)' : '#f5f5f5',
                      color: String(user.status || 'active').toLowerCase() === 'active' ? 'var(--green-700)' : 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {user.status || 'Activo'}
                    </span>
                  </div>

                  {/* Nombre y username */}
                  <div>
                    <h3 style={{
                      margin: '0 0 4px',
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '20px',
                      color: 'var(--green-950)',
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}>
                      {user.name} {user.surname}
                    </h3>
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--muted)',
                      fontWeight: 500,
                    }}>
                      @{user.username}
                    </p>
                  </div>

                  {/* Información de contacto */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'var(--green-50)',
                  }}>
                    <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      📧 {user.email}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      📱 {user.phone}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      📅 Creado: {formatFecha(user.createdAt)}
                    </span>
                  </div>

                  {/* Cambio de rol (solo admin) */}
                  {isAdmin && (
                    <div style={{
                      padding: '12px',
                      borderRadius: '10px',
                      background: '#f8faf8',
                      border: '1px solid var(--line)',
                    }}>
                      <label style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        color: 'var(--muted)',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '6px',
                      }}>
                        Cambiar rol
                      </label>
                      <select
                        value={user.role || 'USER_ROLE'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid var(--line)',
                          background: 'white',
                          color: 'var(--text)',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="USER_ROLE">Usuario</option>
                        <option value="ADMIN_ROLE">Administrador</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardContainer>
  );
};

export default UsersPage;
