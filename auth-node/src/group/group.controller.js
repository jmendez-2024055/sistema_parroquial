import * as groupService from './group.service.js';
import { seedGroups } from './group.seeder.js';

export const createGroup = async (req, res, next) => {
  try {
    const data = { ...req.body };
    // Eliminar cualquier parroquiaId que venga del body para evitar spoofing
    delete data.parroquiaId;
    // Asignar parroquiaId del usuario autenticado
    data.parroquiaId = req.user.parroquiaId;

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

export const initializeGroups = async (req, res, next) => {
  try {
    const parroquiaId = req.user?.parroquiaId;

    if (!parroquiaId) {
      return res.status(400).json({
        success: false,
        message: 'No se puede inicializar grupos sin parroquiaId'
      });
    }

    await seedGroups(parroquiaId);

    res.json({
      success: true,
      message: 'Grupos inicializados correctamente para la parroquia'
    });

  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const parroquiaId = req.user?.parroquiaId;
    const groups = await groupService.getGroupsRecord(parroquiaId);

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
    const parroquiaId = req.user?.parroquiaId;
    const group = await groupService.getGroupByIdRecord(req.params.id, parroquiaId);

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
    const parroquiaId = req.user?.parroquiaId;
    const group = await groupService.updateGroupRecord(
      req.params.id,
      req.body,
      parroquiaId
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
    const parroquiaId = req.user?.parroquiaId;
    const group = await groupService.deleteGroupRecord(req.params.id, parroquiaId);

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
