import { useState, useEffect } from 'react';
import useEventStore from '../store/useEventStore.js';

const initialForm = {
    titulo: '',
    descripcion: '',
    fecha: '',
    hora: '',
    lugar: '',
    idCategoria: '',
};

const EventForm = ({ onClose, onSuccess, evento }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const { categorias, fetchCategorias, createEvento, updateEvento, loading } = useEventStore();

    useEffect(() => {
        fetchCategorias();
    }, []);

    useEffect(() => {
        if (evento) {
            setForm({
                titulo: evento.titulo || '',
                descripcion: evento.descripcion || '',
                fecha: evento.fecha ? evento.fecha.split('T')[0] : '',
                hora: evento.hora || '',
                lugar: evento.lugar || '',
                idCategoria: evento.idCategoria?._id || evento.idCategoria || '',
            });
        } else {
            setForm(initialForm);
        }
    }, [evento]);

    const validate = () => {
        const newErrors = {};
        if (!form.titulo.trim()) newErrors.titulo = 'El título es obligatorio';
        if (!form.fecha) newErrors.fecha = 'La fecha es obligatoria';
        if (!form.hora) newErrors.hora = 'La hora es obligatoria';
        if (!form.idCategoria) newErrors.idCategoria = 'Selecciona una categoría';
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
        let result;
        if (evento) {
            result = await updateEvento(evento._id, form);
        } else {
            result = await createEvento(form);
        }
        if (result.success) {
            onSuccess?.();
            onClose?.();
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
                        }}>{evento ? 'Editar Evento' : 'Nuevo Evento'}</h2>
                    </div>
                    <button onClick={onClose} style={{
                        display: 'grid', placeItems: 'center',
                        width: 34, height: 34,
                        border: '1px solid var(--line)',
                        borderRadius: '9px', background: 'white',
                        cursor: 'pointer', color: 'var(--muted)',
                        fontSize: '16px',
                    }}>✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Título */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Título *</label>
                        <input
                            name="titulo"
                            value={form.titulo}
                            onChange={handleChange}
                            placeholder="Nombre del evento"
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.titulo ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.titulo ? '#fff5f5' : 'white',
                            }}
                        />
                        {errors.titulo && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.titulo}</span>}
                    </div>

                    {/* Fecha y Hora */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Fecha *</label>
                            <input
                                type="date" name="fecha" value={form.fecha} onChange={handleChange}
                                style={{
                                    padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                    border: `1.5px solid ${errors.fecha ? '#c53030' : 'var(--line)'}`,
                                    fontSize: '13px', outline: 'none', background: errors.fecha ? '#fff5f5' : 'white',
                                }}
                            />
                            {errors.fecha && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.fecha}</span>}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Hora *</label>
                            <input
                                type="time" name="hora" value={form.hora} onChange={handleChange}
                                style={{
                                    padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                    border: `1.5px solid ${errors.hora ? '#c53030' : 'var(--line)'}`,
                                    fontSize: '13px', outline: 'none', background: errors.hora ? '#fff5f5' : 'white',
                                }}
                            />
                            {errors.hora && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.hora}</span>}
                        </div>
                    </div>

                    {/* Categoría */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Categoría *</label>
                        <select
                            name="idCategoria" value={form.idCategoria} onChange={handleChange}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.idCategoria ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.idCategoria ? '#fff5f5' : 'white',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Selecciona una categoría</option>
                            {categorias.map((cat) => (
                                <option key={cat._id} value={cat._id}>{cat.nombreCategoria}</option>
                            ))}
                        </select>
                        {errors.idCategoria && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.idCategoria}</span>}
                    </div>

                    {/* Lugar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Lugar</label>
                        <input
                            name="lugar" value={form.lugar} onChange={handleChange}
                            placeholder="Lugar del evento"
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: '1.5px solid var(--line)', fontSize: '13px', outline: 'none',
                            }}
                        />
                    </div>

                    {/* Descripción */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Descripción</label>
                        <textarea
                            name="descripcion" value={form.descripcion} onChange={handleChange}
                            placeholder="Descripción del evento (opcional)"
                            rows={3}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: '1.5px solid var(--line)', fontSize: '13px', outline: 'none',
                                resize: 'vertical',
                            }}
                        />
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0 18px', minHeight: '40px', borderRadius: '9px',
                            border: '1px solid var(--line)', background: 'white',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)',
                        }}>Cancelar</button>
                        <button type="submit" disabled={loading} className="primary-button">
                            {loading ? 'Guardando...' : (evento ? 'Actualizar Evento' : 'Guardar Evento')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EventForm;
