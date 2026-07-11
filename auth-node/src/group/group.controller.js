import * as groupService from './group.service.js';

export const createGroup = async (req, res, next) => {
  try {
    const data = req.body;

    const group = await groupService.createGroupRecord(data);

    res.status(201).json({
      success: true,
      message: 'Grupo registrado correctamente',
      data: group,
    });

  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const groups = await groupService.getGroupsRecord();

    res.json({
      success: true,
      message: 'Grupos obtenidos correctamente',
      total: groups.length,
      data: groups,
    });

  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req, res, next) => {
  try {
    const group = await groupService.getGroupByIdRecord(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    res.json({
      success: true,
      data: group,
    });

  } catch (error) {
    next(error);
  }
};

export const updateGroup = async (req, res, next) => {
  try {
    const group = await groupService.updateGroupRecord(
      req.params.id,
      req.body
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Grupo actualizado correctamente',
      data: group,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const group = await groupService.deleteGroupRecord(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    res.json({
      success: true,
      message: 'Grupo eliminado correctamente',
    });

  } catch (error) {
    next(error);
  }
};
