import { useEffect } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useCategoryStore from '../store/useCategoryStore.js';

const CATEGORY_STYLES = {
    'Litúrgico':   { badge: 'category-badge--liturgical',  bg: '#f0fdf4', border: '#bbf7d0', dot: '#16a34a' },
    'Formativo':   { badge: 'category-badge--formative',   bg: '#eff6ff', border: '#bfdbfe', dot: '#2563eb' },
    'Juvenil':     { badge: 'category-badge--youth',       bg: '#fefce8', border: '#fde68a', dot: '#d97706' },
    'Comunitario': { badge: 'category-badge--community',   bg: '#fdf4ff', border: '#e9d5ff', dot: '#9333ea' },
};

const DEFAULT_STYLE = { bg: '#f8fafc', border: '#e2e8f0', dot: '#64748b' };

const formatFecha = (fecha) =>
    new Date(fecha).toLocaleDateString('es-GT', {
        day: '2-digit', month: 'short', year: 'numeric',
    });

const CategoryPage = () => {
    const { categorias, eventos, loading, error, fetchCategoriasConEventos } = useCategoryStore();

    useEffect(() => {
        fetchCategoriasConEventos();
    }, []);

    // Agrupar eventos por categoría
    const eventosPorCategoria = (categoriaId) =>
        eventos.filter((e) => e.idCategoria?._id === categoriaId && e.isActive);

    return (
        <DashboardContainer
            eyebrow="Módulo administrativo"
            title="Categorías"
            description="Clasifica el contenido del sistema parroquial."
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
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando categorías...</p>
                </section>
            )}

            {!loading && categorias.length === 0 && (
                <section className="content-card empty-state">
                    <div className="empty-state__icon"><AppIcon name="grid" size={28} /></div>
                    <h2>No hay categorías registradas</h2>
                    <p>Las categorías aparecerán aquí una vez creadas.</p>
                </section>
            )}

            {!loading && categorias.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {categorias.map((cat) => {
                        const style = CATEGORY_STYLES[cat.nombreCategoria] || DEFAULT_STYLE;
                        const eventosDeCategoria = eventosPorCategoria(cat._id);

                        return (
                            <div key={cat._id} style={{
                                border: '1px solid var(--line)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                background: 'var(--surface)',
                                boxShadow: '0 2px 12px rgba(28,55,42,0.05)',
                            }}>
                                {/* Header de la categoría */}
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '18px 24px',
                                    background: style.bg,
                                    borderBottom: `1px solid ${style.border}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{
                                            width: 10, height: 10, borderRadius: '50%',
                                            background: style.dot, flexShrink: 0,
                                            boxShadow: `0 0 0 3px ${style.border}`,
                                        }} />
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                fontFamily: "'Playfair Display', serif",
                                                fontSize: '18px',
                                                color: 'var(--green-950)',
                                                lineHeight: 1.2,
                                            }}>
                                                {cat.nombreCategoria}
                                            </h3>
                                            {cat.descripcion && (
                                                <p style={{
                                                    margin: '3px 0 0',
                                                    fontSize: '12px',
                                                    color: 'var(--muted)',
                                                }}>
                                                    {cat.descripcion}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700,
                                        padding: '4px 12px', borderRadius: '999px',
                                        background: 'white',
                                        border: `1px solid ${style.border}`,
                                        color: style.dot,
                                    }}>
                                        {eventosDeCategoria.length} evento{eventosDeCategoria.length !== 1 ? 's' : ''}
                                    </span>
                                </div>

                                {/* Eventos de la categoría */}
                                <div style={{ padding: '16px 24px' }}>
                                    {eventosDeCategoria.length === 0 ? (
                                        <p style={{
                                            margin: 0, fontSize: '13px',
                                            color: 'var(--muted)', fontStyle: 'italic',
                                            padding: '8px 0',
                                        }}>
                                            No hay eventos en esta categoría.
                                        </p>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {eventosDeCategoria.map((evento) => (
                                                <div key={evento._id} style={{
                                                    display: 'flex', alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '12px 16px',
                                                    borderRadius: '10px',
                                                    border: '1px solid var(--line)',
                                                    background: 'white',
                                                    gap: '12px',
                                                }}>
                                                    {/* Info del evento */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{
                                                            margin: 0,
                                                            fontSize: '14px',
                                                            fontWeight: 600,
                                                            color: 'var(--green-950)',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                        }}>
                                                            {evento.titulo}
                                                        </p>
                                                        {evento.descripcion && (
                                                            <p style={{
                                                                margin: '2px 0 0',
                                                                fontSize: '11px',
                                                                color: 'var(--muted)',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {evento.descripcion}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Meta del evento */}
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center',
                                                        gap: '16px', flexShrink: 0,
                                                    }}>
                                                        <span style={{ fontSize: '12px', color: 'var(--green-800)' }}>
                                                            📅 {formatFecha(evento.fecha)}
                                                        </span>
                                                        <span style={{ fontSize: '12px', color: 'var(--green-800)' }}>
                                                            🕐 {evento.hora}
                                                        </span>
                                                        {evento.lugar && (
                                                            <span style={{ fontSize: '12px', color: 'var(--green-800)' }}>
                                                                📍 {evento.lugar}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardContainer>
    );
};

export default CategoryPage;
