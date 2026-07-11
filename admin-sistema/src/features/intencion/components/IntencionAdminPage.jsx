import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import { intencionService } from '../../../shared/services/intencionService.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const IntencionAdminPage = () => {
    const [intenciones, setIntenciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const user = useAuthStore((state) => state.user);
    const role = user?.role ?? '';
    const isAdmin = role === 'ADMIN_ROLE';

    useEffect(() => {
        fetchIntenciones();
    }, []);

    const fetchIntenciones = async () => {
        try {
            setLoading(true);
            const response = await intencionService.listarIntenciones();
            if (response.success) {
                setIntenciones(response.data || []);
            }
        } catch (err) {
            setError('Error al cargar las intenciones');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarcarLeida = async (id) => {
        try {
            await intencionService.actualizarIntencion(id, { estado: 'LEIDA' });
            fetchIntenciones();
        } catch (err) {
            console.error('Error al marcar como leída:', err);
        }
    };

    const handleEliminar = async (id) => {
        if (!confirm('¿Estás seguro de eliminar esta intención?')) return;
        try {
            await intencionService.eliminarIntencion(id);
            fetchIntenciones();
        } catch (err) {
            console.error('Error al eliminar intención:', err);
        }
    };

    const formatFecha = (fecha) =>
        new Date(fecha).toLocaleDateString('es-GT', {
            day: '2-digit', month: 'long', year: 'numeric',
        });

    const formatFechaHora = (fecha) =>
        new Date(fecha).toLocaleString('es-GT', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
        });

    return (
        <DashboardContainer
            eyebrow="Módulo administrativo"
            title="Intenciones de Misa"
            description="Gestiona las intenciones de misa de la parroquia."
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
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando intenciones...</p>
                </section>
            )}

            {!loading && intenciones.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="heart" size={28} /></div>
                    <h2>No hay intenciones registradas</h2>
                    <p>Los fieles pueden registrar intenciones desde el formulario público.</p>
                </section>
            )}

            {!loading && intenciones.length > 0 && (
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--line)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{
                                background: 'var(--green-50)',
                                borderBottom: '1px solid var(--line)',
                            }}>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Fecha Misa
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Horario
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Solicitante
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Intención
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Estado
                                </th>
                                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {intenciones.map((intencion) => {
                                const horario = intencion.massScheduleId || {};
                                return (
                                    <tr key={intencion._id} style={{
                                        borderBottom: '1px solid var(--line)',
                                        transition: 'background .15s ease',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--green-50)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>
                                            {formatFecha(intencion.fechaMisa)}
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                <span style={{ fontWeight: 600 }}>{horario.diaSemana}</span>
                                                <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                                                    {horario.hora} - {horario.tipoMisa}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>
                                            {intencion.nombreSolicitante}
                                        </td>
                                        <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)', maxWidth: 300 }}>
                                            <div style={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}>
                                                {intencion.intencion}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span style={{
                                                fontSize: '11px', fontWeight: 700,
                                                padding: '4px 10px', borderRadius: '999px',
                                                background: intencion.estado === 'LEIDA' ? 'var(--green-100)' : '#fef3c7',
                                                color: intencion.estado === 'LEIDA' ? 'var(--green-700)' : '#d97706',
                                            }}>
                                                {intencion.estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                {intencion.estado === 'PENDIENTE' && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleMarcarLeida(intencion._id)}
                                                        style={{
                                                            padding: '6px 12px', borderRadius: '6px',
                                                            border: '1px solid var(--green-200)', background: 'var(--green-50)',
                                                            color: 'var(--green-700)', cursor: 'pointer',
                                                            fontSize: '11px', fontWeight: 600,
                                                        }}
                                                    >
                                                        Marcar leída
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleEliminar(intencion._id)}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '6px',
                                                        border: '1px solid #fed7d7', background: '#fff5f5',
                                                        color: '#c53030', cursor: 'pointer',
                                                        fontSize: '11px', fontWeight: 600,
                                                    }}
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardContainer>
    );
};

export default IntencionAdminPage;
