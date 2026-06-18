import { useState } from 'react';
import useUserStore from '../store/useUserStore.js';

const validate = (data) => {
  const errors = {};

  if (!data.Name?.trim()) errors.Name = 'El nombre es obligatorio.';
  else if (data.Name.trim().length > 25) errors.Name = 'Máximo 25 caracteres.';

  if (!data.Surname?.trim()) errors.Surname = 'El apellido es obligatorio.';
  else if (data.Surname.trim().length > 25) errors.Surname = 'Máximo 25 caracteres.';

  if (!data.Username?.trim()) errors.Username = 'El nombre de usuario es obligatorio.';
  else if (/\s/.test(data.Username) || /[^a-zA-Z0-9_-]/.test(data.Username))
    errors.Username = 'Sin espacios ni caracteres especiales.';

  if (!data.Email?.trim()) errors.Email = 'El correo es obligatorio.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email))
    errors.Email = 'Correo electrónico inválido.';

  if (!data.Password) errors.Password = 'La contraseña es obligatoria.';
  else if (data.Password.length < 8) errors.Password = 'Mínimo 8 caracteres.';

  if (!data.Phone?.trim()) errors.Phone = 'El teléfono es obligatorio.';
  else if (!/^\d{8}$/.test(data.Phone.trim())) errors.Phone = 'Debe tener exactamente 8 dígitos.';

  return errors;
};

export const UserForm = ({ onSuccess, onCancel }) => {
  const createUser = useUserStore((s) => s.createUser);
  const loading = useUserStore((s) => s.loading);
  const error = useUserStore((s) => s.error);
  const clearError = useUserStore((s) => s.clearError);

  const [formData, setFormData] = useState({
    Name: '',
    Surname: '',
    Username: '',
    Email: '',
    Password: '',
    Phone: '',
    Role: 'ADMIN_ROLE',
  });
  const [fieldErrs, setFieldErrs] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (touched[field]) {
      const errs = validate(updated);
      setFieldErrs((prev) => ({ ...prev, [field]: errs[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errs = validate(formData);
    setFieldErrs((prev) => ({ ...prev, [field]: errs[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    const allTouched = Object.keys(formData).reduce((a, k) => ({ ...a, [k]: true }), {});
    setTouched(allTouched);
    const errs = validate(formData);
    setFieldErrs(errs);
    if (Object.keys(errs).length > 0) return;

    const result = await createUser(formData);
    if (result.success) {
      onSuccess?.();
    }
  };

  return (
    <>
      <div onClick={onCancel} style={{
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
            }}>Nuevo Usuario</h2>
          </div>
          <button onClick={onCancel} style={{
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

          {/* Error general */}
          {error && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', border: '1px solid #fed7d7',
              background: '#fff5f5', color: '#c53030', fontSize: '12px',
            }}>
              {error}
            </div>
          )}

          {/* Nombre y Apellido */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Nombre *</label>
              <input
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                onBlur={() => handleBlur('Name')}
                disabled={loading}
                maxLength={25}
                style={{
                  padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                  border: `1.5px solid ${fieldErrs.Name ? '#c53030' : 'var(--line)'}`,
                  fontSize: '13px', outline: 'none', background: fieldErrs.Name ? '#fff5f5' : 'white',
                }}
              />
              {fieldErrs.Name && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Name}</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Apellido *</label>
              <input
                value={formData.Surname}
                onChange={(e) => handleChange('Surname', e.target.value)}
                onBlur={() => handleBlur('Surname')}
                disabled={loading}
                maxLength={25}
                style={{
                  padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                  border: `1.5px solid ${fieldErrs.Surname ? '#c53030' : 'var(--line)'}`,
                  fontSize: '13px', outline: 'none', background: fieldErrs.Surname ? '#fff5f5' : 'white',
                }}
              />
              {fieldErrs.Surname && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Surname}</span>}
            </div>
          </div>

          {/* Username */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Nombre de usuario *</label>
            <input
              value={formData.Username}
              onChange={(e) => handleChange('Username', e.target.value)}
              onBlur={() => handleBlur('Username')}
              disabled={loading}
              style={{
                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                border: `1.5px solid ${fieldErrs.Username ? '#c53030' : 'var(--line)'}`,
                fontSize: '13px', outline: 'none', background: fieldErrs.Username ? '#fff5f5' : 'white',
              }}
            />
            {fieldErrs.Username && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Username}</span>}
          </div>

          {/* Email */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Correo electrónico *</label>
            <input
              type="email"
              value={formData.Email}
              onChange={(e) => handleChange('Email', e.target.value)}
              onBlur={() => handleBlur('Email')}
              disabled={loading}
              style={{
                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                border: `1.5px solid ${fieldErrs.Email ? '#c53030' : 'var(--line)'}`,
                fontSize: '13px', outline: 'none', background: fieldErrs.Email ? '#fff5f5' : 'white',
              }}
            />
            {fieldErrs.Email && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Email}</span>}
          </div>

          {/* Contraseña */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Contraseña *</label>
            <input
              type="password"
              value={formData.Password}
              onChange={(e) => handleChange('Password', e.target.value)}
              onBlur={() => handleBlur('Password')}
              disabled={loading}
              minLength={8}
              style={{
                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                border: `1.5px solid ${fieldErrs.Password ? '#c53030' : 'var(--line)'}`,
                fontSize: '13px', outline: 'none', background: fieldErrs.Password ? '#fff5f5' : 'white',
              }}
            />
            {fieldErrs.Password && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Password}</span>}
          </div>

          {/* Teléfono */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ink)' }}>Teléfono *</label>
            <input
              type="tel"
              value={formData.Phone}
              onChange={(e) => handleChange('Phone', e.target.value.replace(/\D/g, '').slice(0, 8))}
              onBlur={() => handleBlur('Phone')}
              disabled={loading}
              maxLength={8}
              style={{
                padding: '10px 12px', borderRadius: '9px', fontFamily: 'inherit',
                border: `1.5px solid ${fieldErrs.Phone ? '#c53030' : 'var(--line)'}`,
                fontSize: '13px', outline: 'none', background: fieldErrs.Phone ? '#fff5f5' : 'white',
              }}
            />
            {fieldErrs.Phone && <span style={{ fontSize: '11px', color: '#c53030' }}>{fieldErrs.Phone}</span>}
          </div>

          {/* Acciones */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onCancel} style={{
              padding: '0 18px', minHeight: '40px', borderRadius: '9px',
              border: '1px solid var(--line)', background: 'white',
              cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: 'var(--muted)',
            }}>Cancelar</button>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
