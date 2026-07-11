import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ForgotPasswordPage } from '../../features/auth/pages/ForgotPasswordPage.jsx';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { RegisterPage } from '../../features/auth/pages/RegisterPage.jsx';
import { ResetPasswordPage } from '../../features/auth/pages/ResetPasswordPage.jsx';
import { UnauthorizedPage } from '../../features/auth/pages/UnauthorizedPage.jsx';
import { VerifyEmail } from '../../features/auth/pages/VerifyEmail.jsx';
import { AdminLayout } from '../layouts/AdminLayout.jsx';
import { ProtectedRoutes, AdminOnlyRoute } from './ProtectedRoutes.jsx';

const DashboardPage = lazy(() => import('../../features/dashboard/pages/DashboardPage.jsx'));
const ModulePage = lazy(() => import('../layouts/ModulePage.jsx'));
const EventPage = lazy(() => import('../../features/event/components/EventPage.jsx'));
const CategoryPage = lazy(() => import('../../features/category/components/CategoryPage.jsx'));
const NoticePage = lazy(() => import('../../features/notice/components/NoticePage.jsx'));
const MassSchedulePage = lazy(() => import('../../features/massShedule/components/MassSchedulePage.jsx'));
const IntencionUserPage = lazy(() => import('../../features/intencion/components/IntencionUserPage.jsx'));
const UsersPage = lazy(() => import('../../features/user/components/UsersPage.jsx'));
const SettingsPage = lazy(() => import('../../features/settings/pages/SettingsPage.jsx'));
const GroupListPage = lazy(() => import('../../features/group/components/GroupListPage.jsx'));
const GroupRequestsAdminPage = lazy(() => import('../../features/group/components/GroupRequestsAdminPage.jsx'));
const GroupManagementPage = lazy(() => import('../../features/group/components/GroupManagementPage.jsx'));

const moduleRoutes = [];

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
          <Route path="events" element={<EventPage />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="notices" element={<NoticePage />} />
          <Route path="mass-schedules" element={<MassSchedulePage />} />
          <Route path="intenciones" element={<IntencionUserPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="groups" element={<GroupListPage />} />
          <Route element={<AdminOnlyRoute />}>
            <Route path="settings" element={<SettingsPage />} />
            <Route path="group-requests" element={<GroupRequestsAdminPage />} />
            <Route path="group-management" element={<GroupManagementPage />} />
          </Route>
        </Route>
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
