import { useEffect, useState } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useGroupStore from '../store/useGroupStore.js';

const formatFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-GT', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

const GroupRequestsAdminPage = () => {
    const { groupRequests, loading, error, fetchGroupRequests, approveRequest, rejectRequest } = useGroupStore();
    const [filter, setFilter] = useState('pendiente');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

    useEffect(() => {
        fetchGroupRequests(filter);
    }, [filter]);

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setActionType('approve');
        setShowResponseModal(true);
        setResponseMessage('');
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setActionType('reject');
        setShowResponseModal(true);
        setResponseMessage('');
    };

    const handleSubmitResponse = async () => {
        try {
            if (actionType === 'approve') {
                await approveRequest(selectedRequest._id, responseMessage);
            } else {
                await rejectRequest(selectedRequest._id, responseMessage);
            }
            setShowResponseModal(false);
            setSelectedRequest(null);
            setResponseMessage('');
            setActionType(null);
            fetchGroupRequests(filter);
        } catch (err) {
            console.error('Error al procesar solicitud:', err);
        }
    };

    const statusColors = {
        pendiente: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
        aprobada: { bg: '#d1fae5', text: '#059669', border: '#6ee7b7' },
        rechazada: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
    };

    const filteredRequests = groupRequests.filter(r => r.estado === filter);

    return (
        <DashboardContainer
            eyebrow="Administración"
            title="Solicitudes de Grupos"
            description="Gestiona las solicitudes de los usuarios para unirse a los grupos parroquiales."
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

            {/* Filtros */}
            <div style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
                flexWrap: 'wrap',
            }}>
                {['pendiente', 'aprobada', 'rechazada'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        style={{
                            padding: '10px 20px',
                            borderRadius: '8px',
                            background: filter === status ? statusColors[status].bg : '#f1f5f9',
                            color: filter === status ? statusColors[status].text : 'var(--muted)',
                            fontSize: '14px',
                            fontWeight: 600,
                            border: filter === status ? `1px solid ${statusColors[status].border}` : '1px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        {groupRequests.filter(r => r.estado === status).length > 0 && (
                            <span style={{
                                marginLeft: '8px',
                                padding: '2px 8px',
                                borderRadius: '999px',
                                background: 'white',
                                fontSize: '12px',
                            }}>
                                {groupRequests.filter(r => r.estado === status).length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {loading && (
                <section className="content-card empty-state">
                    <div className="route-loader__spinner" style={{ width: 24, height: 24 }} />
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando solicitudes...</p>
                </section>
            )}

            {!loading && filteredRequests.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="users" size={28} /></div>
                    <h2>No hay solicitudes {filter}s</h2>
                    <p>No hay solicitudes con estado "{filter}" en este momento.</p>
                </section>
            )}

            {!loading && filteredRequests.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredRequests.map((request) => (
                        <div key={request._id} style={{
                            border: '1px solid var(--line)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            background: 'var(--surface)',
                            boxShadow: '0 2px 8px rgba(28,55,42,0.05)',
                        }}>
                            {/* Header de la solicitud */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px 20px',
                                background: statusColors[request.estado].bg,
                                borderBottom: `1px solid ${statusColors[request.estado].border}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'white', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                    }}>
                                        <AppIcon name="user" size={20} style={{ color: statusColors[request.estado].text }} />
                                    </div>
                                    <div>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: statusColors[request.estado].text,
                                        }}>
                                            Usuario ID: {request.idUsuario}
                                        </p>
                                        <p style={{
                                            margin: '2px 0 0',
                                            fontSize: '12px',
                                            color: statusColors[request.estado].text,
                                            opacity: 0.8,
                                        }}>
                                            {formatFecha(request.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <div style={{
                                    padding: '6px 12px',
                                    borderRadius: '999px',
                                    background: 'white',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: statusColors[request.estado].text,
                                    border: `1px solid ${statusColors[request.estado].border}`,
                                }}>
                                    {request.estado.charAt(0).toUpperCase() + request.estado.slice(1)}
                                </div>
                            </div>

                            {/* Contenido de la solicitud */}
                            <div style={{ padding: '20px' }}>
                                <div style={{ marginBottom: '16px' }}>
                                    <p style={{
                                        margin: '0 0 4px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: 'var(--green-800)',
                                    }}>
                                        Grupo solicitado:
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: 'var(--green-950)',
                                    }}>
                                        {request.idGrupo?.nombreGrupo || 'Grupo'}
                                    </p>
                                </div>

                                {request.idGrupo?.descripcion && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{
                                            margin: '0 0 4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--green-800)',
                                        }}>
                                            Descripción del grupo:
                                        </p>
                                        <p style={{
                                            margin: 0,
                                            fontSize: '13px',
                                            color: 'var(--muted)',
                                        }}>
                                            {request.idGrupo.descripcion}
                                        </p>
                                    </div>
                                )}

                                {request.mensaje && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{
                                            margin: '0 0 4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--green-800)',
                                        }}>
                                            Mensaje del usuario:
                                        </p>
                                        <div style={{
                                            padding: '12px',
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: 'var(--green-950)',
                                                fontStyle: 'italic',
                                            }}>
                                                "{request.mensaje}"
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {request.respuestaAdmin && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <p style={{
                                            margin: '0 0 4px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: 'var(--green-800)',
                                        }}>
                                            Respuesta del administrador:
                                        </p>
                                        <div style={{
                                            padding: '12px',
                                            background: request.estado === 'aprobada' ? '#d1fae5' : '#fee2e2',
                                            borderRadius: '8px',
                                            border: `1px solid ${request.estado === 'aprobada' ? '#6ee7b7' : '#fca5a5'}`,
                                        }}>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: request.estado === 'aprobada' ? '#059669' : '#dc2626',
                                            }}>
                                                {request.respuestaAdmin}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    fontSize: '12px',
                                    color: 'var(--muted)',
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <AppIcon name="calendar" size={14} />
                                        {formatFecha(request.createdAt)}
                                    </span>
                                </div>

                                {/* Acciones para solicitudes pendientes */}
                                {request.estado === 'pendiente' && (
                                    <div style={{
                                        marginTop: '16px',
                                        display: 'flex',
                                        gap: '12px',
                                        justifyContent: 'flex-end',
                                    }}>
                                        <button
                                            onClick={() => handleReject(request)}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                background: '#fee2e2',
                                                color: '#dc2626',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                border: '1px solid #fca5a5',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#fecaca'}
                                            onMouseLeave={(e) => e.target.style.background = '#fee2e2'}
                                        >
                                            Rechazar
                                        </button>
                                        <button
                                            onClick={() => handleApprove(request)}
                                            style={{
                                                padding: '10px 20px',
                                                borderRadius: '8px',
                                                background: '#d1fae5',
                                                color: '#059669',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                                border: '1px solid #6ee7b7',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={(e) => e.target.style.background = '#a7f3d0'}
                                            onMouseLeave={(e) => e.target.style.background = '#d1fae5'}
                                        >
                                            Aprobar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de respuesta */}
            {showResponseModal && selectedRequest && (
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
                            {actionType === 'approve' ? 'Aprobar' : 'Rechazar'} solicitud
                        </h2>
                        
                        <p style={{
                            margin: '0 0 16px',
                            fontSize: '14px',
                            color: 'var(--muted)',
                        }}>
                            {actionType === 'approve' 
                                ? `Estás aprobando la solicitud para unirse a ${selectedRequest.idGrupo?.nombreGrupo || 'el grupo'}.`
                                : `Estás rechazando la solicitud para unirse a ${selectedRequest.idGrupo?.nombreGrupo || 'el grupo'}.`
                            }
                        </p>

                        <p style={{
                            margin: '0 0 8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: 'var(--green-800)',
                        }}>
                            Mensaje de respuesta (opcional):
                        </p>
                        <textarea
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            placeholder="Escribe una respuesta para el usuario..."
                            style={{
                                width: '100%',
                                minHeight: '100px',
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
                                    setShowResponseModal(false);
                                    setSelectedRequest(null);
                                    setResponseMessage('');
                                    setActionType(null);
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
                                onClick={handleSubmitResponse}
                                style={{
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    background: actionType === 'approve' ? '#059669' : '#dc2626',
                                    color: 'white',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {actionType === 'approve' ? 'Aprobar' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardContainer>
    );
};

export default GroupRequestsAdminPage;
