import { useState } from 'react';
import { forgotPasswordRequest, resetPasswordRequest } from '../../../shared/apis/authService.js';

// ── Hook: solicitar correo de recuperación ─────────────────────────
export const useForgotPassword = () => {
  const [status,  setStatus]  = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const sendResetLink = async (email) => {
    try {
      setStatus('loading');
      setMessage('');
      const data = await forgotPasswordRequest(email);
      if (data.success !== false) {
        setStatus('success');
        setMessage(
          data.message ||
          'Te enviamos un enlace de recuperación. Revisa tu bandeja de entrada.'
        );
        return { success: true };
      }
      setStatus('error');
      setMessage(data.message || 'No se pudo procesar la solicitud.');
      return { success: false };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title   ||
        'Error al conectar con el servidor.';
      setStatus('error');
      setMessage(msg);
      return { success: false };
    }
  };

  const resetState = () => { setStatus('idle'); setMessage(''); };

  return { status, message, sendResetLink, resetState };
};

// ── Hook: restablecer contraseña con token ─────────────────────────
export const useResetPassword = () => {
  const [status,  setStatus]  = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  const resetPassword = async ({ token, newPassword }) => {
    try {
      setStatus('loading');
      setMessage('');
      const data = await resetPasswordRequest({ token, newPassword });
      if (data.success !== false) {
        setStatus('success');
        setMessage(data.message || 'Tu contraseña fue actualizada exitosamente.');
        return { success: true };
      }
      setStatus('error');
      setMessage(data.message || 'El enlace es inválido o ya expiró.');
      return { success: false };
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title   ||
        'Error al conectar con el servidor.';
      setStatus('error');
      setMessage(msg);
      return { success: false };
    }
  };

  return { status, message, resetPassword };
};