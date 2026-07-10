import { useState, useEffect } from 'react';
import { useGeolocation } from '../../../shared/hooks/useGeolocation';
import { parishService } from '../../../shared/services/parishService';
import './ParishSelection.css';

const ParishSelection = ({ onParishSelected, selectedParishId }) => {
  const { location, error: geoError, loading: geoLoading, getCurrentLocation } = useGeolocation();
  const [parishes, setParishes] = useState([]);
  const [nearestParish, setNearestParish] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadNearestParish = async () => {
    if (!location) return;

    setLoading(true);
    setError(null);
    try {
      const response = await parishService.findNearestParish(location.latitude, location.longitude);
      if (response.success && response.data) {
        setNearestParish(response.data);
        setParishes([response.data]);
      } else {
        setError('No se encontraron parroquias cercanas');
      }
    } catch (err) {
      setError('Error al buscar parroquia más cercana');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyParishes = async () => {
    if (!location) {
      console.log('loadNearbyParishes: No hay ubicación disponible');
      return;
    }

    console.log('loadNearbyParishes: Buscando parroquias cercanas a', location.latitude, location.longitude);
    setLoading(true);
    setError(null);
    try {
      const response = await parishService.discoverNearbyParishes(location.latitude, location.longitude, 5000);
      console.log('loadNearbyParishes: Respuesta del servidor', response);
      if (response.success && response.data) {
        setParishes(response.data);
        console.log('loadNearbyParishes: Parroquias encontradas', response.data.length);
      } else {
        setError('No se encontraron parroquias cercanas');
        console.log('loadNearbyParishes: No se encontraron parroquias');
      }
    } catch (err) {
      console.error('loadNearbyParishes: Error', err);
      setError('Error al buscar parroquias cercanas');
    } finally {
      setLoading(false);
    }
  };

  const searchParishes = async () => {
    if (!searchTerm.trim()) {
      setParishes([]);
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await parishService.getAllParishes({ search: searchTerm });
      if (response.success && response.data) {
        setParishes(response.data);
        if (response.data.length === 0) {
          setError('No se encontraron parroquias con ese criterio');
        }
      } else {
        setError('No se encontraron parroquias');
      }
    } catch (err) {
      setError('Error al buscar parroquias');
    } finally {
      setLoading(false);
    }
  };

  const handleParishSelect = async (parish) => {
    try {
      // Si es un candidato (isClaimed: false), reclamarlo primero
      if (!parish.isClaimed && parish.osmId) {
        console.log('handleParishSelect: Reclamando parroquia candidato', parish.osmId);
        const response = await parishService.claimParish({
          osmId: parish.osmId,
          nombre: parish.nombre,
          direccion: parish.direccion,
          latitud: parish.latitud,
          longitud: parish.longitud
        });

        if (response.success && response.data) {
          // Usar la parroquia creada con _id real
          onParishSelected(response.data);
        } else {
          setError('Error al reclamar parroquia');
        }
      } else {
        // Parroquia ya reclamada, usar directamente
        onParishSelected(parish);
      }
    } catch (err) {
      console.error('handleParishSelect: Error', err);
      setError('Error al seleccionar parroquia');
    }
  };

  // Automatically load nearby parishes when location is obtained
  useEffect(() => {
    if (location && !geoError) {
      loadNearbyParishes();
    }
  }, [location]);

  return (
    <div className="parish-selection">
      <div className="parish-selection-header">
        <h2>Selecciona tu Parroquia</h2>
        <p>Busca tu parroquia por nombre o usa tu ubicación para encontrar la más cercana</p>
      </div>

      <div className="location-controls">
        {!location && (
          <button
            onClick={getCurrentLocation}
            disabled={geoLoading}
            className="btn-location"
          >
            {geoLoading ? 'Obteniendo ubicación...' : '📍 Usar mi ubicación actual'}
          </button>
        )}

        {location && (
          <div className="location-info">
            <span className="location-coords">
              📍 Ubicación: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
            <div className="location-actions">
              <button onClick={loadNearestParish} className="btn-nearest" disabled={loading}>
                {loading ? 'Buscando...' : '🎯 Parroquia más cercana'}
              </button>
              <button onClick={loadNearbyParishes} className="btn-nearby" disabled={loading}>
                {loading ? 'Buscando...' : '🗺️ Ver parroquias cercanas'}
              </button>
            </div>
          </div>
        )}

        {geoError && <p className="error">{geoError}</p>}
      </div>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Buscar parroquia por nombre o dirección..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          onKeyPress={(e) => e.key === 'Enter' && searchParishes()}
        />
        <button onClick={searchParishes} className="btn-search" disabled={loading}>
          {loading ? 'Buscando...' : '🔍 Buscar'}
        </button>
      </div>

      {nearestParish && (
        <div className="nearest-parish-card">
          <h3>🎯 Parroquia más cercana encontrada</h3>
          <div className="parish-card">
            <h4>{nearestParish.nombre}</h4>
            <p className="parish-address">{nearestParish.direccion}</p>
            {nearestParish.distanciaKm && (
              <p className="parish-distance">
                Distancia: {nearestParish.distanciaKm.toFixed(2)} km
              </p>
            )}
            {nearestParish.contacto?.telefono && (
              <p className="parish-contact">📞 {nearestParish.contacto.telefono}</p>
            )}
            {nearestParish.contacto?.email && (
              <p className="parish-contact">📧 {nearestParish.contacto.email}</p>
            )}
            <button
              onClick={() => handleParishSelect(nearestParish)}
              className="btn-select"
            >
              Seleccionar esta parroquia
            </button>
          </div>
        </div>
      )}

      {loading && <p className="loading">Cargando parroquias...</p>}

      {error && <p className="error">{error}</p>}

      <div className="parishes-list">
        {parishes.length > 0 && !nearestParish && (
          parishes.map((parish) => (
            <div
              key={parish._id || parish.osmId}
              className={`parish-card ${selectedParishId === parish._id ? 'selected' : ''}`}
            >
              <h4>{parish.nombre}</h4>
              {!parish.isClaimed && (
                <span className="badge-unclaimed">Ubicación referencial</span>
              )}
              <p className="parish-address">{parish.direccion}</p>
              {parish.distanciaKm && (
                <p className="parish-distance">
                  Distancia: {parish.distanciaKm.toFixed(2)} km
                </p>
              )}
              {parish.contacto?.telefono && (
                <p className="parish-contact">📞 {parish.contacto.telefono}</p>
              )}
              {parish.contacto?.email && (
                <p className="parish-contact">📧 {parish.contacto.email}</p>
              )}
              <button
                onClick={() => handleParishSelect(parish)}
                className="btn-select"
              >
                Seleccionar
              </button>
            </div>
          ))
        )}
        {parishes.length === 0 && !loading && !error && !nearestParish && (
          <p className="no-results">
            {searchTerm ? 'No se encontraron parroquias con ese criterio' : 'Usa el buscador o tu ubicación para encontrar parroquias'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ParishSelection;
