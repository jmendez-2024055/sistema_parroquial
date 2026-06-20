import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useEventStore from '../store/useEventStore.js';
import EventForm from './EventForm.jsx';
import { useAuthStore } from '../../auth/store/authStore.js';

const categoryBadgeClass = (nombre) => {
    const map = {
        'Litúrgico': 'category-badge--liturgical',
        'Formativo': 'category-badge--formative',
        'Juvenil': 'category-badge--youth',
        'Comunitario': 'category-badge--community',
    };
    return map[nombre] || 'category-badge--default';
};

const EventPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const { eventos, loading, error, fetchEventos, deleteEvento } = useEventStore();
    const user = useAuthStore((state) => state.user);
    const role = user?.role ?? '';
    const isAdmin = role === 'ADMIN_ROLE';

    useEffect(() => { fetchEventos(); }, []);

    const handleEdit = (evento) => {
        setEditingEvent(evento);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setEditingEvent(null);
        setShowForm(false);
    };

    const handleSuccess = () => {
        fetchEventos();
        handleCloseForm();
    };

    const formatFecha = (fecha) =>
        new Date(fecha).toLocaleDateString('es-GT', {
            day: '2-digit', month: 'long', year: 'numeric',
        });

    return (
        <DashboardContainer
            eyebrow="Módulo administrativo"
            title="Eventos"
            description="Gestiona las actividades y celebraciones parroquiales."
            action={
                isAdmin && (
                    <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
                        <AppIcon name="plus" size={18} />
                        Nuevo Evento
                    </button>
                )
            }
        >
            {error && (
                <div style={{
                    padding: '12px 16px', marginBottom: '20px',
                    borderRadius: '10px', border: '1px solid #fed7d7',
                    background: '#fff5f5', color: '#c53030', fontSize: '13px',
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <section className="content-card empty-state">
                    <div className="route-loader__spinner" style={{ width: 24, height: 24 }} />
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando eventos...</p>
                </section>
            )}

            {!loading && eventos.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="calendar" size={28} /></div>
                    <h2>No hay eventos registrados</h2>
                    <p>Crea el primero con el botón "Nuevo Evento".</p>
                </section>
            )}

            {!loading && eventos.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '18px',
                }}>
                    {eventos.map((evento) => {
                        const catNombre = evento.idCategoria?.nombreCategoria || 'Sin categoría';
                        return (
                            <div key={evento._id} style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--line)',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 16px rgba(28,55,42,0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                transition: 'transform .2s ease, box-shadow .2s ease',
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-3px)';
                                    e.currentTarget.style.boxShadow = '0 10px 28px rgba(28,55,42,0.11)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,55,42,0.06)';
                                }}
                            >
                                {/* Top: categoría + estado */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={`category-badge ${categoryBadgeClass(catNombre)}`}>
                                        {catNombre}
                                    </span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700,
                                        padding: '3px 10px', borderRadius: '999px',
                                        background: evento.isActive ? 'var(--green-50)' : '#f5f5f5',
                                        color: evento.isActive ? 'var(--green-700)' : 'var(--muted)',
                                    }}>
                                        {evento.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>

                                {/* Título */}
                                <h3 style={{
                                    margin: 0,
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: '17px',
                                    color: 'var(--green-950)',
                                    lineHeight: 1.3,
                                }}>
                                    {evento.titulo}
                                </h3>

                                {/* Descripción */}
                                {evento.descripcion && (
                                    <p style={{
                                        margin: 0, fontSize: '12px',
                                        color: 'var(--muted)', lineHeight: 1.6,
                                    }}>
                                        {evento.descripcion}
                                    </p>
                                )}

                                {/* Meta */}
                                <div style={{
                                    display: 'flex', flexDirection: 'column', gap: '5px',
                                    padding: '12px', borderRadius: '10px',
                                    background: 'var(--green-50)',
                                }}>
                                    <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <AppIcon name="calendar" size={14} /> {formatFecha(evento.fecha)}
                                    </span>
                                    <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <AppIcon name="clock" size={14} /> {evento.hora}
                                    </span>
                                    {evento.lugar && (
                                        <span style={{ fontSize: '12px', color: 'var(--green-800)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <AppIcon name="map-pin" size={14} /> {evento.lugar}
                                        </span>
                                    )}
                                </div>

                                {/* Acciones */}
                                {isAdmin && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 'auto' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleEdit(evento)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '8px',
                                                border: '1px solid var(--green-200)', background: 'var(--green-50)',
                                                color: 'var(--green-700)', cursor: 'pointer',
                                                fontSize: '12px', fontWeight: 600,
                                            }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => deleteEvento(evento._id)}
                                            style={{
                                                padding: '6px 14px', borderRadius: '8px',
                                                border: '1px solid #fed7d7', background: '#fff5f5',
                                                color: '#c53030', cursor: 'pointer',
                                                fontSize: '12px', fontWeight: 600,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {showForm && (
                <EventForm
                    evento={editingEvent}
                    onClose={handleCloseForm}
                    onSuccess={handleSuccess}
                />
            )}
        </DashboardContainer>
    );
};

export default EventPage;
