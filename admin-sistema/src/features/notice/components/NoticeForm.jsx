import { useState, useEffect } from 'react';
import useNoticeStore from '../store/useNoticeStore.js';
import { useAuthStore } from '../../auth/store/authStore.js';

const initialForm = {
    titulo: '',
    contenido: '',
    estado: 'ACTIVO',
};

const NoticeForm = ({ notice, onClose, onSuccess }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const { createNotice, updateNotice, loading } = useNoticeStore();

    useEffect(() => {
        if (notice) {
            setForm({
                titulo: notice.titulo || '',
                contenido: notice.contenido || '',
                estado: notice.estado || 'ACTIVO',
            });
        }
    }, [notice]);

    const validate = () => {
        const newErrors = {};
        if (!form.titulo.trim()) {
            newErrors.titulo = 'El título es obligatorio';
        } else if (form.titulo.length > 150) {
            newErrors.titulo = 'El título no puede exceder 150 caracteres';
        }
        if (!form.contenido.trim()) {
            newErrors.contenido = 'El contenido es obligatorio';
        } else if (form.contenido.length > 1000) {
            newErrors.contenido = 'El contenido no puede exceder 1000 caracteres';
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = useAuthStore.getState().token;
        if (!token) {
            setErrors({ submit: 'Necesitas iniciar sesión para realizar esta acción.' });
            return;
        }

        try {
            let result;
            if (notice) {
                result = await updateNotice(notice._id, form);
            } else {
                result = await createNotice(form);
            }

            if (result && result.success) {
                onSuccess?.();
                onClose?.();
            } else {
                setErrors({ submit: (result && result.message) || 'Error en la operación' });
            }
        } catch (err) {
            setErrors({ submit: err?.response?.data?.message || err.message || 'Error en la operación' });
        }
    };

    return (
        <>
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0,
                background: 'rgba(16, 45, 34, 0.5)',
                zIndex: 40,
            }} />
            <div style={{
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 50,
                width: 'min(540px, calc(100vw - 32px))',
                background: 'var(--surface)',
                borderRadius: '16px',
                boxShadow: '0 24px 60px rgba(16, 45, 34, 0.18)',
                overflow: 'hidden',
            }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--line)',
                }}>
                    <div>
                        <span style={{
                            display: 'block',
                            color: 'var(--green-700)', fontSize: '10px',
                            fontWeight: 700, letterSpacing: '0.13em', textTransform: 'uppercase',
                        }}>Módulo administrativo</span>
                        <h2 style={{
                            margin: '4px 0 0',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '20px', color: 'var(--green-950)',
                        }}>{notice ? 'Editar Aviso' : 'Nuevo Aviso'}</h2>
                    </div>
                    <button onClick={onClose} style={{
                        display: 'grid', placeItems: 'center',
                        width: 34, height: 34,
                        border: '1px solid var(--line)',
                        borderRadius: '9px', background: 'white',
                        cursor: 'pointer', color: 'var(--muted)',
                        fontSize: '16px',
                    }} aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Error general */}
                    {errors.submit && (
                        <div style={{
                            padding: '12px 16px', borderRadius: '10px', border: '1px solid #fed7d7',
                            background: '#fff5f5', color: '#c53030', fontSize: '12px',
                        }}>
                            {errors.submit}
                        </div>
                    )}

                    {/* Título */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text)',
                        }}>
                            Título *
                        </label>
                        <input
                            type="text"
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Ej: Cambio de horarios"
                            maxLength="150"
                            style={{
                                padding: '10px 12px',
                                borderRadius: '9px',
                                fontFamily: 'inherit',
                                border: `1.5px solid ${errors.titulo ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px',
                                outline: 'none',
                                background: errors.titulo ? '#fff5f5' : 'white',
                                transition: 'border-color .2s ease',
                            }}
                            onFocus={(e) => {
                                if (!errors.titulo) {
                                    e.currentTarget.style.borderColor = 'var(--dashboard-green)';
                                }
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.titulo ? '#c53030' : 'var(--line)';
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            {errors.titulo && (
                                <span style={{ fontSize: '11px', color: '#c53030' }}>
                                    {errors.titulo}
                                </span>
                            )}
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--muted)',
                                marginLeft: 'auto',
                            }}>
                                {form.titulo.length}/150
                            </span>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: 'var(--text)',
                        }}>
                            Contenido *
                        </label>
                        <textarea
                            name="contenido"
                            value={form.contenido}
                            onChange={handleChange}
                            placeholder="Escribe el contenido del aviso..."
                            maxLength="1000"
                            rows="6"
                            style={{
                                padding: '10px 12px',
                                borderRadius: '9px',
                                fontFamily: 'inherit',
                                border: `1.5px solid ${errors.contenido ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px',
                                outline: 'none',
                                background: errors.contenido ? '#fff5f5' : 'white',
                                resize: 'vertical',
                                transition: 'border-color .2s ease',
                            }}
                            onFocus={(e) => {
                                if (!errors.contenido) {
                                    e.currentTarget.style.borderColor = 'var(--dashboard-green)';
                                }
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = errors.contenido ? '#c53030' : 'var(--line)';
                            }}
                        />
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            {errors.contenido && (
                                <span style={{ fontSize: '11px', color: '#c53030' }}>
                                    {errors.contenido}
                                </span>
                            )}
                            <span style={{
                                fontSize: '11px',
                                color: 'var(--muted)',
                                marginLeft: 'auto',
                            }}>
                                {form.contenido.length}/1000
                            </span>
                        </div>
                    </div>

                    {/* Estado */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Estado</label>
                        <select
                            name="estado"
                            value={form.estado}
                            onChange={handleChange}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: '1.5px solid var(--line)',
                                fontSize: '13px', outline: 'none', background: 'white',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                        </select>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0 18px', minHeight: '40px', borderRadius: '9px',
                            border: '1px solid var(--line)', background: 'white',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)',
                        }}>Cancelar</button>
                        <button type="submit" disabled={loading} className="primary-button">
                            {loading ? 'Guardando...' : (notice ? 'Actualizar Aviso' : 'Crear Aviso')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default NoticeForm;
