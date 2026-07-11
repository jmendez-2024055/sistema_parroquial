import GroupRequest from './groupRequest.model.js';
import Group from './group.model.js';

export const createGroupRequestRecord = async (data) => {
  try {
    // Verificar si ya existe una solicitud para este usuario y grupo
    const existingRequest = await GroupRequest.findOne({
      idGrupo: data.idGrupo,
      idUsuario: data.idUsuario
    });

    if (existingRequest) {
      throw new Error('Ya existe una solicitud para este grupo');
    }

    // Obtener el grupo para verificar cupo
    const group = await Group.findById(data.idGrupo);
    if (!group) {
      throw new Error('Grupo no encontrado');
    }

    // Verificar si hay cupo disponible
    if (group.cupoMaximo !== null && group.cupoActual >= group.cupoMaximo) {
      throw new Error('No hay cupo disponible en este grupo');
    }

    const groupRequest = new GroupRequest(data);
    await groupRequest.save();
    
    // Decrementar el cupo actual del grupo
    await Group.findByIdAndUpdate(
      data.idGrupo,
      { $inc: { cupoActual: 1 } }
    );
    
    // Populate para devolver datos completos (solo grupo, no usuario)
    const populatedRequest = await GroupRequest.findById(groupRequest._id)
      .populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual');
    
    return populatedRequest;
  } catch (error) {
    throw new Error(error.message || 'Error al crear la solicitud');
  }
};

export const getGroupRequestsRecord = async (estado = null) => {
  try {
    const query = estado ? { estado } : {};
    return await GroupRequest.find(query)
      .populate('idGrupo', 'nombreGrupo descripcion')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error al obtener solicitudes');
  }
};

export const getGroupRequestsByUserRecord = async (idUsuario) => {
  try {
    return await GroupRequest.find({ idUsuario })
      .populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error al obtener solicitudes del usuario');
  }
};

export const getGroupRequestByIdRecord = async (id) => {
  try {
    return await GroupRequest.findById(id)
      .populate('idGrupo', 'nombreGrupo descripcion');
  } catch (error) {
    throw new Error('Error al buscar la solicitud');
  }
};

export const approveGroupRequestRecord = async (id, respuestaAdmin = '') => {
  try {
    const request = await GroupRequest.findByIdAndUpdate(
      id,
      { 
        estado: 'aprobada',
        respuestaAdmin
      },
      { new: true }
    ).populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual');

    return request;
  } catch (error) {
    throw new Error('Error al aprobar la solicitud');
  }
};

export const rejectGroupRequestRecord = async (id, respuestaAdmin = '') => {
  try {
    const request = await GroupRequest.findById(id);
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    // Liberar el cupo del grupo
    await Group.findByIdAndUpdate(
      request.idGrupo,
      { $inc: { cupoActual: -1 } }
    );

    const updatedRequest = await GroupRequest.findByIdAndUpdate(
      id,
      { 
        estado: 'rechazada',
        respuestaAdmin
      },
      { new: true }
    ).populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual');

    return updatedRequest;
  } catch (error) {
    throw new Error('Error al rechazar la solicitud');
  }
};

export const deleteGroupRequestRecord = async (id) => {
  try {
    const request = await GroupRequest.findById(id);
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    // Solo liberar cupo si la solicitud estaba pendiente
    if (request.estado === 'pendiente') {
      await Group.findByIdAndUpdate(
        request.idGrupo,
        { $inc: { cupoActual: -1 } }
      );
    }

    const deletedRequest = await GroupRequest.findByIdAndDelete(id);
    return deletedRequest;
  } catch (error) {
    throw new Error('Error al eliminar la solicitud');
  }
};
