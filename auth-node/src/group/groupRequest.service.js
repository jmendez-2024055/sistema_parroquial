import GroupRequest from './groupRequest.model.js';
import Group from './group.model.js';

export const createGroupRequestRecord = async (data) => {
  try {
    // Verificar si ya existe una solicitud para este usuario y grupo
    const existingRequest = await GroupRequest.findOne({
      idGrupo: data.idGrupo,
      idUsuario: data.idUsuario,
      parroquiaId: data.parroquiaId
    });

    if (existingRequest) {
      throw new Error('Ya existe una solicitud para este grupo');
    }

    // Obtener el grupo para verificar cupo (filtrando por parroquia)
    const group = await Group.findOne({ _id: data.idGrupo, parroquiaId: data.parroquiaId });
    if (!group) {
      throw new Error('Grupo no encontrado');
    }

    // Verificar si hay cupo disponible
    if (group.cupoMaximo !== null && group.cupoActual >= group.cupoMaximo) {
      throw new Error('No hay cupo disponible en este grupo');
    }

    const groupRequest = new GroupRequest(data);
    await groupRequest.save();

    // Decrementar el cupo actual del grupo (filtrando por parroquia)
    await Group.findOneAndUpdate(
      { _id: data.idGrupo, parroquiaId: data.parroquiaId },
      { $inc: { cupoActual: 1 } }
    );

    // Populate para devolver datos completos (solo grupo, no usuario)
    const populatedRequest = await GroupRequest.findOne({ _id: groupRequest._id, parroquiaId: data.parroquiaId })
      .populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual');

    return populatedRequest;
  } catch (error) {
    throw new Error(error.message || 'Error al crear la solicitud');
  }
};

export const getGroupRequestsRecord = async (parroquiaId, estado = null) => {
  try {
    if (!parroquiaId) {
      return [];
    }
    const query = estado ? { estado, parroquiaId } : { parroquiaId };
    return await GroupRequest.find(query)
      .populate('idGrupo', 'nombreGrupo descripcion')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error al obtener solicitudes');
  }
};

export const getGroupRequestsByUserRecord = async (idUsuario, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return [];
    }
    return await GroupRequest.find({ idUsuario, parroquiaId })
      .populate('idGrupo', 'nombreGrupo descripcion cupoMaximo cupoActual')
      .sort({ createdAt: -1 });
  } catch (error) {
    throw new Error('Error al obtener solicitudes del usuario');
  }
};

export const getGroupRequestByIdRecord = async (id, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    return await GroupRequest.findOne({ _id: id, parroquiaId })
      .populate('idGrupo', 'nombreGrupo descripcion');
  } catch (error) {
    throw new Error('Error al buscar la solicitud');
  }
};

export const approveGroupRequestRecord = async (id, parroquiaId, respuestaAdmin = '') => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const request = await GroupRequest.findOneAndUpdate(
      { _id: id, parroquiaId },
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

export const rejectGroupRequestRecord = async (id, parroquiaId, respuestaAdmin = '') => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const request = await GroupRequest.findOne({ _id: id, parroquiaId });
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    // Liberar el cupo del grupo (filtrando por parroquia)
    await Group.findOneAndUpdate(
      { _id: request.idGrupo, parroquiaId },
      { $inc: { cupoActual: -1 } }
    );

    const updatedRequest = await GroupRequest.findOneAndUpdate(
      { _id: id, parroquiaId },
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

export const deleteGroupRequestRecord = async (id, parroquiaId, userId, role) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const request = await GroupRequest.findOne({ _id: id, parroquiaId });
    if (!request) {
      throw new Error('Solicitud no encontrada');
    }

    // Verificar permisos: admin puede borrar cualquier solicitud, usuario normal solo la suya
    if (role !== 'ADMIN_ROLE' && request.idUsuario !== userId) {
      return null; // No tiene permiso, retorna null para que el controller responda 404
    }

    // Liberar cupo si la solicitud estaba pendiente o aprobada (no si estaba rechazada)
    if (request.estado === 'pendiente' || request.estado === 'aprobada') {
      await Group.findOneAndUpdate(
        { _id: request.idGrupo, parroquiaId },
        { $inc: { cupoActual: -1 } }
      );
    }

    const deletedRequest = await GroupRequest.findOneAndDelete({ _id: id, parroquiaId });
    return deletedRequest;
  } catch (error) {
    throw new Error('Error al eliminar la solicitud');
  }
};
