import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage.jsx';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../../features/auth/pages/RegisterPage.jsx';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx';
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';

const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage.jsx'));
const ModulePage = lazy(() => import('../layouts/ModulePage.jsx'));

const moduleRoutes = [
  { path: 'events', title: 'Eventos', description: 'Gestiona las actividades y celebraciones parroquiales.' },
  { path: 'notices', title: 'Avisos', description: 'Administra los comunicados para la comunidad.' },
  { path: 'mass-schedules', title: 'Horarios de misa', description: 'Organiza los horarios de las celebraciones.' },
  { path: 'categories', title: 'Categorías', description: 'Clasifica el contenido del sistema parroquial.' },
  { path: 'users', title: 'Usuarios', description: 'Administra usuarios, perfiles y accesos.' },
  { path: 'settings', title: 'Configuración', description: 'Configura los datos generales de la parroquia.' },
];

const RouteLoader = () => (
  <div className="route-loader" role="status">
    <span className="route-loader__spinner" />
    Cargando módulo...
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<RouteLoader />}>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/recover" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          {moduleRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<ModulePage title={route.title} description={route.description} />}
            />
          ))}
        </Route>
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
