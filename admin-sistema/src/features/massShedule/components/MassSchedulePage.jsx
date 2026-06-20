import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useMassScheduleStore from '../store/useMassScheduleStore.js';
import MassScheduleForm from './MassScheduleForm.jsx';
import { useAuthStore } from '../../auth/store/authStore.js';

const dayOrder = {
    'Domingo': 0,
    'Lunes': 1,
    'Martes': 2,
    'Miércoles': 3,
    'Jueves': 4,
    'Viernes': 5,
    'Sábado': 6
};

const dayBadgeClass = (dia) => {
    const map = {
        'Domingo': 'day-badge--sunday',
        'Sábado': 'day-badge--saturday',
    };
    return map[dia] || 'day-badge--default';
};

const MassSchedulePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);
    const { massSchedules, loading, error, fetchMassSchedules, deleteMassSchedule } = useMassScheduleStore();
    const user = useAuthStore((state) => state.user);
    const role = user?.role ?? '';
    const isAdmin = role === 'ADMIN_ROLE';

    useEffect(() => { fetchMassSchedules(); }, []);

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingSchedule(null);
    };

    const handleSuccess = () => {
        fetchMassSchedules();
        handleCloseForm();
    };

    const sortedSchedules = [...massSchedules].sort((a, b) => {
        const dayA = dayOrder[a.diaSemana] ?? 7;
        const dayB = dayOrder[b.diaSemana] ?? 7;
        if (dayA !== dayB) return dayA - dayB;
        return a.hora.localeCompare(b.hora);
    });

    return (
        <DashboardContainer
            eyebrow="Módulo administrativo"
            title="Horarios de Misa"
            description="Gestiona los horarios de las celebraciones eucarísticas."
            action={
                isAdmin && (
                    <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
                        <AppIcon name="plus" size={18} />
                        Nuevo Horario
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
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando horarios...</p>
                </section>
            )}

            {!loading && massSchedules.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="clock" size={28} /></div>
                    <h2>No hay horarios registrados</h2>
                    <p>Crea el primer horario con el botón "Nuevo Horario".</p>
                </section>
            )}

            {!loading && massSchedules.length > 0 && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                    gap: '20px',
                }}>
                    {sortedSchedules.map((schedule) => (
                        <div key={schedule._id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--line)',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 4px 16px rgba(28,55,42,0.06)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            transition: 'transform .2s ease, box-shadow .2s ease',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 12px 28px rgba(28,55,42,0.12)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,55,42,0.06)';
                            }}
                        >
                            {/* Decorative top border */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '4px',
                                background: 'linear-gradient(90deg, var(--green-700), var(--green-500))',
                            }} />

                            {/* Header con día y hora */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <span className={`category-badge ${dayBadgeClass(schedule.diaSemana)}`} style={{ marginBottom: '8px', display: 'inline-block' }}>
                                        {schedule.diaSemana}
                                    </span>
                                    <h3 style={{
                                        margin: '8px 0 0',
                                        fontFamily: "'Playfair Display', serif",
                                        fontSize: '28px',
                                        color: 'var(--green-950)',
                                        fontWeight: 700,
                                        lineHeight: 1.2,
                                    }}>
                                        {schedule.hora}
                                    </h3>
                                </div>
                                <div style={{
                                    display: 'grid',
                                    width: '48px',
                                    height: '48px',
                                    placeItems: 'center',
                                    borderRadius: '12px',
                                    background: 'var(--green-50)',
                                    color: 'var(--green-700)',
                                    fontSize: '20px',
                                }}>
                                    <AppIcon name="church" size={24} />
                                </div>
                            </div>

                            {/* Tipo de misa */}
                            <div style={{
                                padding: '12px',
                                borderRadius: '10px',
                                background: 'var(--green-50)',
                                border: '1px solid var(--green-100)',
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    color: 'var(--green-700)',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    display: 'block',
                                    marginBottom: '4px',
                                }}>
                                    Tipo de celebración
                                </span>
                                <p style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    color: 'var(--ink)',
                                    fontWeight: 600,
                                }}>
                                    {schedule.tipoMisa}
                                </p>
                            </div>

                            {/* Celebrante */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                borderRadius: '10px',
                                background: '#f8faf8',
                            }}>
                                <div style={{
                                    display: 'grid',
                                    width: '36px',
                                    height: '36px',
                                    placeItems: 'center',
                                    borderRadius: '50%',
                                    background: 'var(--green-100)',
                                    color: 'var(--green-700)',
                                    fontSize: '16px',
                                }}>
                                    <AppIcon name="user" size={18} />
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        color: 'var(--muted)',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        display: 'block',
                                    }}>
                                        Celebrante
                                    </span>
                                    <p style={{
                                        margin: '2px 0 0',
                                        fontSize: '13px',
                                        color: 'var(--ink)',
                                        fontWeight: 500,
                                    }}>
                                        {schedule.celebrante}
                                    </p>
                                </div>
                            </div>

                            {/* Acciones */}
                            {isAdmin && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'flex-end', 
                                    gap: '10px', 
                                    marginTop: 'auto',
                                    paddingTop: '12px',
                                    borderTop: '1px solid var(--line)',
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => handleEdit(schedule)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px',
                                            border: '1px solid var(--green-200)', 
                                            background: 'var(--green-50)',
                                            color: 'var(--green-700)', cursor: 'pointer',
                                            fontSize: '12px', fontWeight: 600,
                                            transition: 'all 0.2s ease',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'var(--green-100)';
                                            e.currentTarget.style.borderColor = 'var(--green-300)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'var(--green-50)';
                                            e.currentTarget.style.borderColor = 'var(--green-200)';
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => deleteMassSchedule(schedule._id)}
                                        style={{
                                            padding: '8px 16px', borderRadius: '8px',
                                            border: '1px solid #fed7d7', background: '#fff5f5',
                                            color: '#c53030', cursor: 'pointer',
                                            fontSize: '12px', fontWeight: 600,
                                            transition: 'all 0.2s ease',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = '#fed7d7';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = '#fff5f5';
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <MassScheduleForm
                    onClose={handleCloseForm}
                    onSuccess={handleSuccess}
                    editingSchedule={editingSchedule}
                />
            )}
        </DashboardContainer>
    );
};

export default MassSchedulePage;
