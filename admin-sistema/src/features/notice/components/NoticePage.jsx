import { useState, useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useNoticeStore from '../store/useNoticeStore.js';
import NoticeForm from './NoticeForm.jsx';
import { useAuthStore } from '../../auth/store/authStore.js';

const NoticePage = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingNotice, setEditingNotice] = useState(null);
    const { notices, loading, error, fetchNotices, deleteNotice } = useNoticeStore();
    const user = useAuthStore((state) => state.user);
    const role = user?.role ?? '';
    const isAdmin = role === 'ADMIN_ROLE';

    useEffect(() => {
        fetchNotices();
    }, []);

    const formatFecha = (fecha) =>
        new Date(fecha).toLocaleDateString('es-GT', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });

    const handleEdit = (notice) => {
        setEditingNotice(notice);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        const result = await deleteNotice(id);
        if (result.success) {
            fetchNotices();
        }
    };

    const handleCloseForm = () => {
        setEditingNotice(null);
        setShowForm(false);
    };

    const handleSuccess = () => {
        fetchNotices();
        handleCloseForm();
    };

    return (
        <DashboardContainer
            eyebrow="Módulo administrativo"
            title="Avisos"
            description="Gestiona los comunicados y avisos para la comunidad parroquial."
            action={
                isAdmin && (
                    <button className="primary-button" type="button" onClick={() => setShowForm(true)}>
                        <AppIcon name="plus" size={18} />
                        Nuevo Aviso
                    </button>
                )
            }
        >
            {error && (
                <div style={{
                    padding: '12px 16px',
                    marginBottom: '20px',
                    borderRadius: '10px',
                    border: '1px solid #fed7d7',
                    background: '#fff5f5',
                    color: '#c53030',
                    fontSize: '13px',
                }}>
                    {error}
                </div>
            )}

            {loading && (
                <section className="content-card empty-state">
                    <div className="route-loader__spinner" style={{ width: 24, height: 24 }} />
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando avisos...</p>
                </section>
            )}

            {!loading && notices.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="bell" size={28} /></div>
                    <h2>No hay avisos registrados</h2>
                    <p>Crea el primero con el botón "Nuevo Aviso".</p>
                </section>
            )}

            {!loading && notices.length > 0 && (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                }}>
                    {notices.map((notice) => (
                        <div
                            key={notice._id}
                            style={{
                                background: 'var(--surface)',
                                border: '1px solid var(--line)',
                                borderRadius: '16px',
                                padding: '20px',
                                boxShadow: '0 4px 16px rgba(28,55,42,0.06)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                transition: 'transform .2s ease, box-shadow .2s ease, border-color .2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 10px 28px rgba(28,55,42,0.11)';
                                e.currentTarget.style.borderColor = 'var(--dashboard-green)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 16px rgba(28,55,42,0.06)';
                                e.currentTarget.style.borderColor = 'var(--line)';
                            }}
                        >
                            {/* Top: estado + fecha */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <span style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    padding: '3px 10px',
                                    borderRadius: '999px',
                                    background: notice.estado === 'ACTIVO' ? 'var(--green-50)' : '#f5f5f5',
                                    color: notice.estado === 'ACTIVO' ? 'var(--green-700)' : 'var(--muted)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}>
                                    {notice.estado}
                                </span>
                                <span style={{
                                    fontSize: '11px',
                                    color: 'var(--muted)',
                                    fontWeight: 500,
                                }}>
                                    {formatFecha(notice.fechaPublicacion)}
                                </span>
                            </div>

                            {/* Título */}
                            <h3 style={{
                                margin: 0,
                                fontFamily: "'Playfair Display', serif",
                                fontSize: '18px',
                                color: 'var(--green-950)',
                                lineHeight: 1.3,
                                fontWeight: 700,
                            }}>
                                {notice.titulo}
                            </h3>

                            {/* Contenido */}
                            <p style={{
                                margin: 0,
                                fontSize: '13px',
                                color: 'var(--text)',
                                lineHeight: 1.6,
                                maxHeight: '4.5em',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitBoxOrient: 'vertical',
                                WebkitLineClamp: 3,
                            }}>
                                {notice.contenido}
                            </p>

                            {/* Acciones */}
                            {isAdmin && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '10px',
                                    marginTop: '8px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid var(--line)',
                                }}>
                                    <button
                                        onClick={() => handleEdit(notice)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '8px 14px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            border: '1px solid var(--dashboard-green)',
                                            background: 'white',
                                            color: 'var(--dashboard-green)',
                                            cursor: 'pointer',
                                            transition: 'all .2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = 'var(--dashboard-green)';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = 'var(--dashboard-green)';
                                        }}
                                    >
                                        <AppIcon name="pencil" size={14} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(notice._id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            padding: '8px 14px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '8px',
                                            border: '1px solid #d9534f',
                                            background: 'white',
                                            color: '#d9534f',
                                            cursor: 'pointer',
                                            transition: 'all .2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.background = '#d9534f';
                                            e.currentTarget.style.color = 'white';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.background = 'white';
                                            e.currentTarget.style.color = '#d9534f';
                                        }}
                                    >
                                        <AppIcon name="trash" size={14} />
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <NoticeForm
                    notice={editingNotice}
                    onClose={handleCloseForm}
                    onSuccess={handleSuccess}
                />
            )}
        </DashboardContainer>
    );
};

export default NoticePage;
