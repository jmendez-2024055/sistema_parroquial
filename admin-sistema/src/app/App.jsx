import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginPage }    from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../features/auth/pages/RegisterPage.jsx';
import { VerifyEmail }  from '../features/auth/pages/VerifyEmail.jsx';
import { useAuthStore } from '../features/auth/store/authStore.js';


const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoadingAuth   = useAuthStore((s) => s.isLoadingAuth);

  if (isLoadingAuth) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', fontFamily: 'Segoe UI, sans-serif',
        fontSize: 14, color: '#7a7a8c',
      }}>
        Cargando…
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const Dashboard = () => {
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div style={{
      minHeight: '100vh', background: '#f0f2f5',
      fontFamily: 'Segoe UI, Helvetica Neue, Arial, sans-serif',
    }}>
      {/* Navbar simple */}
      <nav style={{
        background: '#fff', borderBottom: '1px solid #e8eaf0',
        padding: '0 32px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 1px 4px rgba(0,0,0,.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#3a7d44',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
          }}>✝</div>
          <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>
            Sistema Parroquial
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 13, color: '#7a7a8c' }}>
            {user?.name || user?.username || 'Usuario'}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '7px 18px', background: '#6b5fd6', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              fontSize: 13, fontWeight: 600,
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Contenido */}
      <main style={{ padding: '40px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>
          Bienvenido{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p style={{ color: '#7a7a8c', marginBottom: 32, fontSize: 14 }}>
          Has iniciado sesión correctamente en el Sistema Parroquial.
        </p>

        {/* Cards de acceso rápido */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 20,
        }}>
          {[
            { title: 'Eventos', desc: 'Gestión de eventos parroquiales' },
            { title: 'Horario de Misas', desc: 'Administra los horarios' },
            { title: 'Avisos', desc: 'Comunicados y noticias' },
            { title: 'Usuarios', desc: 'Gestión de usuarios', adminOnly: true },
          ].map((item) => (
            <div key={item.title} style={{
              background: '#fff', borderRadius: 14, padding: '24px 20px',
              border: '1px solid #e8eaf0',
              boxShadow: '0 2px 8px rgba(0,0,0,.04)',
              cursor: 'pointer',
              transition: 'box-shadow .2s, transform .15s',
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.10)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,.04)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{item.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#1a1a2e', margin: '0 0 6px', fontSize: 15 }}>
                {item.title}
              </h3>
              <p style={{ color: '#7a7a8c', fontSize: 13, margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Info de sesión */}
        <div style={{
          marginTop: 40, background: '#fff', borderRadius: 14,
          padding: '20px 24px', border: '1px solid #e8eaf0',
        }}>
          <h3 style={{ fontWeight: 700, color: '#1a1a2e', margin: '0 0 12px', fontSize: 14 }}>
            Datos de sesión
          </h3>
          <pre style={{
            background: '#f7f8fc', borderRadius: 8, padding: '12px 16px',
            fontSize: 12, color: '#444', overflow: 'auto', margin: 0,
          }}>
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
};

function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/login"        element={<LoginPage />} />
        <Route path="/register"     element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protegidas */}
        <Route
          path="/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />
        <Route
          path="/admin/dashboard"
          element={<PrivateRoute><Dashboard /></PrivateRoute>}
        />

        {/* Fallback */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;