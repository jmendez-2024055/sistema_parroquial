import * as groupRequestService from './groupRequest.service.js';

export const createGroupRequest = async (req, res, next) => {
  try {
    const data = req.body;
    
    // Asignar el usuario del token
    data.idUsuario = req.user.id;

    const groupRequest = await groupRequestService.createGroupRequestRecord(data);

    res.status(201).json({
      success: true,
      message: 'Solicitud enviada correctamente',
      data: groupRequest,
    });

  } catch (error) {
    next(error);
  }
};

export const getGroupRequests = async (req, res, next) => {
  try {
    const { estado } = req.query;
    const requests = await groupRequestService.getGroupRequestsRecord(estado);

    res.json({
      success: true,
      message: 'Solicitudes obtenidas correctamente',
      total: requests.length,
      data: requests,
    });

  } catch (error) {
    next(error);
  }
};

export const getGroupRequestsByUser = async (req, res, next) => {
  try {
    const requests = await groupRequestService.getGroupRequestsByUserRecord(req.user.id);

    res.json({
      success: true,
      message: 'Solicitudes del usuario obtenidas correctamente',
      total: requests.length,
      data: requests,
    });

  } catch (error) {
    next(error);
  }
};

export const getGroupRequestById = async (req, res, next) => {
  try {
    const request = await groupRequestService.getGroupRequestByIdRecord(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
    }

    res.json({
      success: true,
      data: request,
    });

  } catch (error) {
    next(error);
  }
};

export const approveGroupRequest = async (req, res, next) => {
  try {
    const { respuestaAdmin } = req.body;
    const request = await groupRequestService.approveGroupRequestRecord(
      req.params.id,
      respuestaAdmin
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Solicitud aprobada correctamente',
      data: request,
    });

  } catch (error) {
    next(error);
  }
};

export const rejectGroupRequest = async (req, res, next) => {
  try {
    const { respuestaAdmin } = req.body;
    const request = await groupRequestService.rejectGroupRequestRecord(
      req.params.id,
      respuestaAdmin
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Solicitud rechazada correctamente',
      data: request,
    });

  } catch (error) {
    next(error);
  }
};

export const deleteGroupRequest = async (req, res, next) => {
  try {
    const request = await groupRequestService.deleteGroupRequestRecord(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no encontrada',
      });
    }

    res.json({
      success: true,
      message: 'Solicitud eliminada correctamente',
    });

  } catch (error) {
    next(error);
  }
};
