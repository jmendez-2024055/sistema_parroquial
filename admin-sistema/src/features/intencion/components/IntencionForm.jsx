import { useState, useEffect } from 'react';
import { intencionService } from '../../../shared/services/intencionService.js';
import { massScheduleService } from '../../../shared/services/massScheduleService.js';

const initialForm = {
    massScheduleId: '',
    nombreSolicitante: '',
    intencion: ''
};

const IntencionForm = ({ onClose, onSuccess }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [massSchedules, setMassSchedules] = useState([]);

    useEffect(() => {
        fetchMassSchedules();
    }, []);

    const fetchMassSchedules = async () => {
        try {
            const response = await massScheduleService.getAllMassSchedules();
            if (response.success) {
                setMassSchedules(response.data || []);
            }
        } catch (error) {
            console.error('Error al cargar horarios de misa:', error);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!form.massScheduleId) newErrors.massScheduleId = 'Selecciona un horario de misa';
        if (!form.nombreSolicitante.trim()) newErrors.nombreSolicitante = 'El nombre es obligatorio';
        if (!form.intencion.trim()) newErrors.intencion = 'La intención es obligatoria';
        if (form.intencion.length > 500) newErrors.intencion = 'La intención no puede exceder 500 caracteres';
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

        setLoading(true);
        try {
            const result = await intencionService.crearIntencion(form);
            if (result.success) {
                onSuccess?.();
                onClose?.();
            }
        } catch (error) {
            console.error('Error al crear intención:', error);
        } finally {
            setLoading(false);
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
                        }}>Solicitud de misa</span>
                        <h2 style={{
                            margin: '4px 0 0',
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '20px', color: 'var(--green-950)',
                        }}>Nueva Intención</h2>
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

                    {/* Horario de Misa */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Horario de Misa *</label>
                        <select
                            name="massScheduleId" value={form.massScheduleId} onChange={handleChange}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.massScheduleId ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.massScheduleId ? '#fff5f5' : 'white',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Selecciona un horario de misa</option>
                            {massSchedules.map((schedule) => (
                                <option key={schedule._id} value={schedule._id}>
                                    {schedule.diaSemana} - {schedule.hora} - {schedule.tipoMisa}
                                </option>
                            ))}
                        </select>
                        {errors.massScheduleId && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.massScheduleId}</span>}
                    </div>

                    {/* Nombre del Solicitante */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Tu Nombre *</label>
                        <input
                            name="nombreSolicitante" value={form.nombreSolicitante} onChange={handleChange}
                            placeholder="Tu nombre completo"
                            maxLength={150}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.nombreSolicitante ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.nombreSolicitante ? '#fff5f5' : 'white',
                            }}
                        />
                        {errors.nombreSolicitante && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.nombreSolicitante}</span>}
                    </div>

                    {/* Intención */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Intención de la Misa *</label>
                        <textarea
                            name="intencion" value={form.intencion} onChange={handleChange}
                            placeholder="Ej: Por la salud de mi mamá, en memoria de..."
                            rows={4}
                            maxLength={500}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.intencion ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.intencion ? '#fff5f5' : 'white',
                                resize: 'vertical',
                            }}
                        />
                        {errors.intencion && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.intencion}</span>}
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                            {form.intencion.length}/500 caracteres
                        </span>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0 18px', minHeight: '40px', borderRadius: '9px',
                            border: '1px solid var(--line)', background: 'white',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)',
                        }}>Cancelar</button>
                        <button type="submit" disabled={loading} className="primary-button">
                            {loading ? 'Enviando...' : 'Enviar Intención'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default IntencionForm;
