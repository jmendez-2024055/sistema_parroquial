// src/app/routes/AppRoutes.jsx
// ──────────────────────────────────────────────────────────────────
// CAMBIOS RESPECTO AL ORIGINAL:
//   + import ForgotPasswordPage
//   + import ResetPasswordPage
//   + <Route path="/recover"        → ForgotPasswordPage />
//   + <Route path="/reset-password" → ResetPasswordPage  />
// ──────────────────────────────────────────────────────────────────

import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ProtectedRoutes } from './ProtectedRoutes.jsx';

// Páginas de auth (importación directa — no lazy, son críticas para UX)
import { LoginPage }           from '../features/auth/pages/LoginPage.jsx';
import { RegisterPage }        from '../features/auth/pages/RegisterPage.jsx';
import { VerifyEmail }         from '../features/auth/pages/VerifyEmail.jsx';
import { ForgotPasswordPage }  from '../features/auth/pages/ForgotPasswordPage.jsx';
import { ResetPasswordPage }   from '../features/auth/pages/ResetPasswordPage.jsx';

// Páginas lazy
const DashboardPage    = lazy(() => import('../layouts/DashboardPage.jsx'));
const UnauthorizedPage = lazy(() => import('../features/auth/pages/UnauthorizedPage.jsx'));

const Loader = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontSize: 14, color: '#7a7a8c',
  }}>
    Cargando…
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<Loader />}>
    <Routes>
      {/* ── Públicas ──────────────────────────────────────────── */}
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/verify-email"   element={<VerifyEmail />} />

      {/* ── Recuperación de contraseña ────────────────────────── */}
      <Route path="/recover"        element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* ── Protegidas ────────────────────────────────────────── */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard"       element={<DashboardPage />} />
        <Route path="/admin/dashboard" element={<DashboardPage />} />
      </Route>

      {/* ── Errores / fallbacks ───────────────────────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/"             element={<Navigate to="/login" replace />} />
      <Route path="*"             element={<Navigate to="/login" replace />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;