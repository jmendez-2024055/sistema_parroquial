import Group from './group.model.js';

export const createGroupRecord = async (data) => {
  try {
    const group = new Group(data);
    await group.save();
    return group;
  } catch (error) {
    throw new Error('Error al crear el grupo');
  }
};

export const getGroupsRecord = async (parroquiaId) => {
  try {
    // Solo devolver grupos si se proporciona parroquiaId
    if (!parroquiaId) {
      return [];
    }
    return await Group.find({ isActive: true, parroquiaId })
      .sort({ nombreGrupo: 1 });
  } catch (error) {
    throw new Error('Error al obtener grupos');
  }
};

export const getGroupByIdRecord = async (id, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    return await Group.findOne({ _id: id, parroquiaId });
  } catch (error) {
    throw new Error('Error al buscar el grupo');
  }
};

export const updateGroupRecord = async (id, data, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const group = await Group.findOneAndUpdate(
      { _id: id, parroquiaId },
      data,
      {
        new: true,
        runValidators: true
      }
    );

    return group;
  } catch (error) {
    throw new Error('Error al actualizar el grupo');
  }
};

export const deleteGroupRecord = async (id, parroquiaId) => {
  try {
    if (!parroquiaId) {
      return null;
    }
    const group = await Group.findOneAndUpdate(
      { _id: id, parroquiaId },
      { isActive: false },
      { new: true }
    );

    return group; 
  } catch (error) {
    throw new Error('Error al eliminar el grupo');
  }
};
