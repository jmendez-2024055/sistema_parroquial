import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import IntencionForm from './IntencionForm.jsx';
import { intencionService } from '../../../shared/services/intencionService.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const IntencionUserPage = () => {
    const [showForm, setShowForm] = useState(false);
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

    const handleSuccess = () => {
        setShowForm(false);
        fetchIntenciones();
    };

    const handleActualizarEstado = async (intencion, nuevoEstado) => {
        try {
            const dataCompleta = { ...intencion };

            if (dataCompleta.massScheduleId && typeof dataCompleta.massScheduleId === 'object') {
                dataCompleta.massScheduleId = dataCompleta.massScheduleId._id;
            }

            dataCompleta.estado = nuevoEstado;

            delete dataCompleta._id;
            delete dataCompleta.__v;
            delete dataCompleta.createdAt;
            delete dataCompleta.updatedAt;

            await intencionService.actualizarIntencion(intencion._id, dataCompleta);
            fetchIntenciones();
        } catch (err) {
            console.error('Error al actualizar:', err);
            alert('No se pudo actualizar la intención. Revisa la consola.');
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

    return (
        <DashboardContainer
            eyebrow={isAdmin ? "Módulo administrativo" : "Solicitud de misa"}
            title="Intenciones de Misa"
            description={isAdmin ? "Gestiona las intenciones de misa de la parroquia." : "Envía tu intención para una misa específica."}
            action={
                !isAdmin && (
                    <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
                        <AppIcon name="plus" size={18} /> Nueva Intención
                    </button>
                )
            }
        >
            {error && (
                <div style={{ padding: '12px 16px', marginBottom: '20px', borderRadius: '10px', border: '1px solid #fed7d7', background: '#fff5f5', color: '#c53030', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            {!loading && intenciones.length > 0 && (
                <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: '16px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: 'var(--green-50)', borderBottom: '1px solid var(--line)' }}>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>Horario</th>
                                {isAdmin && <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>Solicitante</th>}
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>Intención</th>
                                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>Estado</th>
                                {isAdmin && <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '12px', fontWeight: 700, color: 'var(--green-900)' }}>Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {intenciones.map((intencion) => (
                                <tr key={intencion._id} style={{ borderBottom: '1px solid var(--line)' }}>
                                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>{intencion.massScheduleId?.hora}</td>
                                    {isAdmin && <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>{intencion.nombreSolicitante}</td>}
                                    <td style={{ padding: '14px 16px', fontSize: '13px', color: 'var(--ink)' }}>{intencion.intencion}</td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: intencion.estado === 'CONFIRMADA' ? '#d1fae5' : intencion.estado === 'LEIDA' ? 'var(--green-100)' : '#fef3c7', color: intencion.estado === 'CONFIRMADA' ? '#065f46' : intencion.estado === 'LEIDA' ? 'var(--green-700)' : '#d97706' }}>
                                            {intencion.estado}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                                                {intencion.estado === 'PENDIENTE' && (
                                                    <button type="button" onClick={() => handleActualizarEstado(intencion, 'CONFIRMADA')} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #d1fae5', background: '#ecfdf5', color: '#065f46', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                                                        Confirmar
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => handleEliminar(intencion._id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #fed7d7', background: '#fff5f5', color: '#c53030', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <IntencionForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
            )}
        </DashboardContainer>
    );
};

export default IntencionUserPage;