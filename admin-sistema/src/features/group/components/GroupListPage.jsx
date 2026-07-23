import { useEffect, useState } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useGroupStore from '../store/useGroupStore.js';

const formatFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-GT', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

const GroupListPage = () => {
    const { groups, myRequests, loading, error, fetchGroups, fetchMyRequests, createRequest } = useGroupStore();
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [requestMessage, setRequestMessage] = useState('');

    useEffect(() => {
        fetchGroups();
        fetchMyRequests();
    }, []);

    const handleRequestJoin = (group) => {
        setSelectedGroup(group);
        setShowModal(true);
        setRequestMessage('');
    };

    const handleSubmitRequest = async () => {
        try {
            await createRequest({
                idGrupo: selectedGroup._id,
                mensaje: requestMessage,
            });
            setShowModal(false);
            setSelectedGroup(null);
            setRequestMessage('');
        } catch (err) {
            console.error('Error al enviar solicitud:', err);
        }
    };

    const hasRequested = (groupId) => {
        return myRequests.some(r => r.idGrupo && r.idGrupo._id === groupId);
    };

    const getRequestStatus = (groupId) => {
        const request = myRequests.find(r => r.idGrupo && r.idGrupo._id === groupId);
        return request ? request.estado : null;
    };

    return (
        <DashboardContainer
            eyebrow="Grupos Parroquiales"
            title="Grupos de la Iglesia"
            description="Únete a los diferentes grupos de nuestra parroquia."
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
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando grupos...</p>
                </section>
            )}

            {!loading && groups.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="users" size={28} /></div>
                    <h2>No hay grupos disponibles</h2>
                    <p>Los grupos aparecerán aquí una vez creados por el administrador.</p>
                </section>
            )}

            {!loading && groups.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {groups.map((group) => {
                        const status = getRequestStatus(group._id);
                        const statusColors = {
                            pendiente: { bg: '#fef3c7', text: '#d97706', label: 'Pendiente' },
                            aprobada: { bg: '#d1fae5', text: '#059669', label: 'Aprobada' },
                            rechazada: { bg: '#fee2e2', text: '#dc2626', label: 'Rechazada' },
                        };

                        return (
                            <div key={group._id} style={{
                                border: '1px solid var(--line)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                boxShadow: '0 2px 12px rgba(28,55,42,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                            }}>
                                {/* Header del grupo */}
                                <div style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                                    borderBottom: '1px solid #bbf7d0',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: '12px',
                                            background: 'white', display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                        }}>
                                            <AppIcon name="users" size={24} style={{ color: '#16a34a' }} />
                                        </div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                            <h3 style={{
                                                margin: 0,
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: '18px',
                                                color: 'var(--green-950)',
                                                lineHeight: 1.2,
                                            }}>
                                                {group.nombreGrupo}
                                            </h3>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido del grupo */}
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    {group.descripcion && (
                                        <p style={{
                                            margin: '0 0 12px',
                                            fontSize: '14px',
                                            color: 'var(--muted)',
                                            lineHeight: 1.5,
                                        }}>
                                            {group.descripcion}
                                        </p>
                                    )}

                                    {group.requisitos && (
                                        <div style={{
                                            margin: '0 0 12px',
                                            padding: '12px',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: 'var(--green-800)',
                                                marginBottom: '4px',
                                            }}>
                                                Requisitos: 
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '13px',
                                                color: 'var(--muted)',
                                            }}>
                                                {group.requisitos}
                                            </p>
                                        </div>
                                    )}

                                    {group.cupoMaximo && (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '12px',
                                            color: 'var(--green-800)',
                                            marginBottom: '12px',
                                        }}>
                                            <AppIcon name="users" size={14} />
                                            <span>
                                                Cupo disponible: {group.cupoMaximo - (group.cupoActual || 0)} de {group.cupoMaximo} personas
                                            </span>
                                        </div>
                                    )}

                                    {/* Estado de solicitud o botón de acción */}
                                    {status ? (
                                        <div style={{
                                            marginTop: 'auto',
                                            padding: '10px 16px',
                                            borderRadius: '8px',
                                            background: statusColors[status].bg,
                                            color: statusColors[status].text,
                                            fontSize: '13px',
                                            fontWeight: 600,
                                            textAlign: 'center',
                                        }}>
                                            {statusColors[status].label}
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => handleRequestJoin(group)}
                                            style={{
                                                marginTop: 'auto',
                                                padding: '12px 20px',
                                                borderRadius: '10px',
                                                background: '#16a34a',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                border: 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#15803d'}
                                            onMouseLeave={(e) => e.target.style.background = '#16a34a'}
                                        >
                                            Solicitar unirse
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal de solicitud */}
            {showModal && selectedGroup && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    }}>
                        <h2 style={{
                            margin: '0 0 16px',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '22px',
                            color: 'var(--green-950)',
                        }}>
                            Solicitar unirse a {selectedGroup.nombreGrupo}
                        </h2>
                        
                        <p style={{
                            margin: '0 0 16px',
                            fontSize: '14px',
                            color: 'var(--muted)',
                        }}>
                            Envía un mensaje al administrador explicando por qué deseas unirte a este grupo.
                        </p>

                        <textarea
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                            placeholder="Escribe tu mensaje aquí..."
                            style={{
                                width: '100%',
                                minHeight: '120px',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #e2e8f0',
                                fontSize: '14px',
                                fontFamily: 'inherit',
                                resize: 'vertical',
                                marginBottom: '16px',
                            }}
                        />

                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedGroup(null);
                                    setRequestMessage('');
                                }}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: '#f1f5f9',
                                    color: 'var(--muted)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSubmitRequest}
                                disabled={!requestMessage.trim()}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: requestMessage.trim() ? '#16a34a' : '#cbd5e1',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: requestMessage.trim() ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Enviar solicitud
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardContainer>
    );
};

export default GroupListPage;
