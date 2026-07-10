import { useEffect, useMemo } from 'react';
import DashboardHeader from '../components/DashboardHeader.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import EventsTable from '../components/EventsTable.jsx';
import MassScheduleTable from '../components/MassScheduleTable.jsx';
import useEventStore from '../../event/store/useEventStore.js';
import useNoticeStore from '../../notice/store/useNoticeStore.js';
import useMassScheduleStore from '../../massShedule/store/useMassScheduleStore.js';
import useParishStore from '../../parish/store/useParishStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

import '../../../styles/dashboard.css';

const DashboardPage = () => {
  const { eventos, fetchEventos } = useEventStore();
  const { notices, fetchNotices } = useNoticeStore();
  const { massSchedules, fetchMassSchedules } = useMassScheduleStore();
  const { currentParish } = useParishStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchEventos();
    fetchNotices();
    fetchMassSchedules();
  }, [fetchEventos, fetchNotices, fetchMassSchedules]);

  // Calcular estadísticas reales
  const dashboardStats = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // Misas esta semana (horarios de misa)
    const weeklyMasses = massSchedules.filter(schedule => {
      // Para simplificar, contamos todos los horarios de misa
      return true;
    }).length;

    // Eventos próximos (eventos futuros)
    const upcomingEvents = eventos.filter(evento => {
      const eventDate = new Date(evento.fecha);
      return eventDate >= now;
    }).length;

    // Avisos activos
    const activeNotices = notices.filter(notice => notice.estado === 'ACTIVO').length;

    return [
      {
        id: 'weekly-masses',
        label: 'Misas esta semana',
        value: weeklyMasses,
      },
      {
        id: 'upcoming-events',
        label: 'Eventos próximos',
        value: upcomingEvents,
      },
      {
        id: 'active-notices',
        label: 'Avisos activos',
        value: activeNotices,
      },
    ];
  }, [eventos, notices, massSchedules]);

  // Transformar eventos al formato que espera EventsTable
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return eventos
      .filter(evento => new Date(evento.fecha) >= now)
      .slice(0, 5) // Mostrar máximo 5 eventos
      .map(evento => ({
        id: evento._id,
        name: evento.titulo,
        category: evento.idCategoria?.nombreCategoria || 'General',
        date: new Date(evento.fecha).toLocaleDateString('es-GT', { weekday: 'short', day: 'numeric', month: 'short' }),
        time: evento.hora,
        place: evento.lugar || 'Por definir',
      }));
  }, [eventos]);

  // Transformar horarios de misa al formato que espera MassScheduleTable
  const upcomingMasses = useMemo(() => {
    return massSchedules.slice(0, 7); // Mostrar máximo 7 horarios (uno por día)
  }, [massSchedules]);

  return (
    <div className="parish-dashboard">
      <DashboardHeader />

      {currentParish && (
        <div className="parish-info-banner">
          <h3>🏛️ {currentParish.nombre}</h3>
          <p>{currentParish.direccion}</p>
          {currentParish.contacto?.telefono && <span>📞 {currentParish.contacto.telefono}</span>}
        </div>
      )}

      <StatsGrid
        stats={dashboardStats}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        <EventsTable
          events={upcomingEvents}
        />
        <MassScheduleTable
          massSchedules={upcomingMasses}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
