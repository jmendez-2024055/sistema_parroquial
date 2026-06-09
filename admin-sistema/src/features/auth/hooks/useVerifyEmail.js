import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyEmailRequest } from '../../../shared/apis/authService.js';

export const useVerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('No se encontró el token de verificación en el enlace.');
      return;
    }

    verifyEmailRequest({ token })
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Tu correo ha sido verificado exitosamente.');
        } else {
          setStatus('error');
          setMessage(data.message || 'El token es inválido o ya expiró.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Ocurrió un error al verificar tu correo. Intenta de nuevo.');
      });
  }, []); // eslint-disable-line

  return { status, message };
};