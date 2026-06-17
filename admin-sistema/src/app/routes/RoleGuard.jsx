import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore.js';

export const RoleGuard = ({ allowedRoles = [] }) => {
  const user = useAuthStore((state) => state.user);
  const role = user?.role ?? '';

  return allowedRoles.includes(role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleGuard;
