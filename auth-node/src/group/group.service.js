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

export const getGroupsRecord = async () => {
  try {
    return await Group.find({ isActive: true })
      .sort({ nombreGrupo: 1 });
  } catch (error) {
    throw new Error('Error al obtener grupos');
  }
};

export const getGroupByIdRecord = async (id) => {
  try {
    return await Group.findById(id);
  } catch (error) {
    throw new Error('Error al buscar el grupo');
  }
};

export const updateGroupRecord = async (id, data) => {
  try {
    const group = await Group.findByIdAndUpdate(
      id,
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

export const deleteGroupRecord = async (id) => {
  try {
    const group = await Group.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    return group; 
  } catch (error) {
    throw new Error('Error al eliminar el grupo');
  }
};
