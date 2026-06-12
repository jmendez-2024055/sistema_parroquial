import { useState, useEffect } from 'react';
import useMassScheduleStore from '../store/useMassScheduleStore.js';

const initialForm = {
    diaSemana: '',
    hora: '',
    tipoMisa: '',
    celebrante: '',
};

const daysOfWeek = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
];

const MassScheduleForm = ({ onClose, onSuccess, editingSchedule }) => {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const { createMassSchedule, updateMassSchedule, loading } = useMassScheduleStore();

    useEffect(() => {
        if (editingSchedule) {
            setForm({
                diaSemana: editingSchedule.diaSemana,
                hora: editingSchedule.hora,
                tipoMisa: editingSchedule.tipoMisa,
                celebrante: editingSchedule.celebrante,
            });
        }
    }, [editingSchedule]);

    const validate = () => {
        const newErrors = {};
        if (!form.diaSemana) newErrors.diaSemana = 'El día de la semana es obligatorio';
        if (!form.hora) newErrors.hora = 'La hora es obligatoria';
        if (!form.tipoMisa.trim()) newErrors.tipoMisa = 'El tipo de misa es obligatorio';
        if (!form.celebrante.trim()) newErrors.celebrante = 'El celebrante es obligatorio';
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
        if (editingSchedule) {
            result = await updateMassSchedule(editingSchedule._id, form);
        } else {
            result = await createMassSchedule(form);
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
                        }}>
                            {editingSchedule ? 'Editar Horario de Misa' : 'Nuevo Horario de Misa'}
                        </h2>
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

                    {/* Día de la semana */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Día de la semana *</label>
                        <select
                            name="diaSemana" value={form.diaSemana} onChange={handleChange}
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.diaSemana ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.diaSemana ? '#fff5f5' : 'white',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="">Selecciona un día</option>
                            {daysOfWeek.map((day) => (
                                <option key={day} value={day}>{day}</option>
                            ))}
                        </select>
                        {errors.diaSemana && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.diaSemana}</span>}
                    </div>

                    {/* Hora */}
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

                    {/* Tipo de Misa */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Tipo de Misa *</label>
                        <input
                            name="tipoMisa" value={form.tipoMisa} onChange={handleChange}
                            placeholder="Ej: Misa Dominical, Misa de Vísperas"
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.tipoMisa ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.tipoMisa ? '#fff5f5' : 'white',
                            }}
                        />
                        {errors.tipoMisa && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.tipoMisa}</span>}
                    </div>

                    {/* Celebrante */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Celebrante *</label>
                        <input
                            name="celebrante" value={form.celebrante} onChange={handleChange}
                            placeholder="Nombre del sacerdote"
                            style={{
                                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                                border: `1.5px solid ${errors.celebrante ? '#c53030' : 'var(--line)'}`,
                                fontSize: '13px', outline: 'none', background: errors.celebrante ? '#fff5f5' : 'white',
                            }}
                        />
                        {errors.celebrante && <span style={{ fontSize: '11px', color: '#c53030' }}>{errors.celebrante}</span>}
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
                        <button type="button" onClick={onClose} style={{
                            padding: '0 18px', minHeight: '40px', borderRadius: '9px',
                            border: '1px solid var(--line)', background: 'white',
                            cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)',
                        }}>Cancelar</button>
                        <button type="submit" disabled={loading} className="primary-button">
                            {loading ? 'Guardando...' : (editingSchedule ? 'Actualizar Horario' : 'Guardar Horario')}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default MassScheduleForm;
