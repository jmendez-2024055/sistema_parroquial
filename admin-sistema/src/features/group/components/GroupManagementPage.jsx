import { useEffect, useState } from 'react';
import { DashboardContainer } from '../../../shared/components/layout/DashboardContainer.jsx';
import { AppIcon } from '../../../shared/components/ui/AppIcon.jsx';
import useGroupStore from '../store/useGroupStore.js';

const GroupManagementPage = () => {
    const { groups, loading, error, fetchGroups, createGroup, updateGroup, deleteGroup } = useGroupStore();
    const [showModal, setShowModal] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [formData, setFormData] = useState({
        nombreGrupo: '',
        descripcion: '',
        requisitos: '',
        cupoMaximo: null,
        isActive: true
    });
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        if (!hasLoaded) {
            fetchGroups();
            setHasLoaded(true);
        }
    }, [hasLoaded, fetchGroups]);

    const handleCreate = () => {
        setEditingGroup(null);
        setFormData({
            nombreGrupo: '',
            descripcion: '',
            requisitos: '',
            cupoMaximo: null,
            isActive: true
        });
        setShowModal(true);
    };

    const handleEdit = (group) => {
        setEditingGroup(group);
        setFormData({
            nombreGrupo: group.nombreGrupo,
            descripcion: group.descripcion || '',
            requisitos: group.requisitos || '',
            cupoMaximo: group.cupoMaximo || null,
            isActive: group.isActive
        });
        setShowModal(true);
    };

    const handleDelete = async (groupId) => {
        if (window.confirm('¿Estás seguro de eliminar este grupo?')) {
            try {
                await deleteGroup(groupId);
            } catch (err) {
                console.error('Error al eliminar grupo:', err);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingGroup) {
                await updateGroup(editingGroup._id, formData);
            } else {
                await createGroup(formData);
            }
            setShowModal(false);
            setEditingGroup(null);
        } catch (err) {
            console.error('Error al guardar grupo:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <DashboardContainer
            eyebrow="Gestión de Grupos"
            title="Administración de Grupos"
            description="Crea y gestiona los grupos parroquiales disponibles para los usuarios."
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

            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={handleCreate}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '8px',
                        background: 'var(--green-800)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <AppIcon name="plus" size={16} />
                    Crear Grupo
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="route-loader__spinner" style={{ width: 32, height: 32 }} />
                    <p style={{ color: 'var(--muted)', marginTop: 12 }}>Cargando grupos...</p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                }}>
                    {groups.map(group => (
                        <div key={group._id} style={{
                            padding: '20px',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            background: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: '8px',
                                    background: '#f0fdf4', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <AppIcon name="users" size={20} style={{ color: '#16a34a' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>
                                        {group.nombreGrupo}
                                    </h3>
                                    <span style={{
                                        fontSize: '12px',
                                        padding: '2px 8px',
                                        borderRadius: '999px',
                                        background: group.isActive ? '#dcfce7' : '#fee2e2',
                                        color: group.isActive ? '#16a34a' : '#dc2626',
                                    }}>
                                        {group.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            {group.descripcion && (
                                <p style={{
                                    margin: '0 0 8px',
                                    fontSize: '13px',
                                    color: 'var(--muted)',
                                    lineHeight: 1.4,
                                }}>
                                    {group.descripcion}
                                </p>
                            )}

                            {group.cupoMaximo && (
                                <div style={{
                                    fontSize: '12px',
                                    color: 'var(--green-800)',
                                    marginBottom: '12px',
                                }}>
                                    Cupo: {group.cupoMaximo - (group.cupoActual || 0)} de {group.cupoMaximo}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleEdit(group)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: 'var(--green-50)',
                                        color: 'var(--green-700)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(group._id)}
                                    style={{
                                        flex: 1,
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        background: '#fef2f2',
                                        color: '#dc2626',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
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
                        borderRadius: '12px',
                        padding: '24px',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto',
                    }}>
                        <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>
                            {editingGroup ? 'Editar Grupo' : 'Crear Grupo'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                                    Nombre del grupo *
                                </label>
                                <input
                                    type="text"
                                    name="nombreGrupo"
                                    value={formData.nombreGrupo}
                                    onChange={handleChange}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                                    Descripción
                                </label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                                    Requisitos
                                </label>
                                <textarea
                                    name="requisitos"
                                    value={formData.requisitos}
                                    onChange={handleChange}
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                        resize: 'vertical',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '16px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                                    Cupo máximo
                                </label>
                                <input
                                    type="number"
                                    name="cupoMaximo"
                                    value={formData.cupoMaximo || ''}
                                    onChange={handleChange}
                                    min="1"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '14px',
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600 }}>
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={formData.isActive}
                                        onChange={handleChange}
                                        style={{ width: '16px', height: '16px' }}
                                    />
                                    Grupo activo
                                </label>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        background: 'var(--green-50)',
                                        color: 'var(--green-700)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        flex: 1,
                                        padding: '10px 20px',
                                        borderRadius: '6px',
                                        background: 'var(--green-800)',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {editingGroup ? 'Actualizar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardContainer>
    );
};

export default GroupManagementPage;
