import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('La geolocalización no está soportada por este navegador');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        setLoading(false);
      },
      (err) => {
        let errorMessage = 'Error al obtener la ubicación';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado por el usuario';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado al obtener ubicación. Intenta usar el buscador manual.';
            break;
          default:
            errorMessage = 'Error desconocido al obtener ubicación';
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000
      }
    );
  }, []);

  return {
    location,
    error,
    loading,
    getCurrentLocation
  };
};
