import { Router } from 'express';
import * as groupRequestController from './groupRequest.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     GroupRequest:
 *       type: object
 *       required:
 *         - idGrupo
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         idGrupo:
 *           type: string
 *           description: ID del grupo al que se solicita unirse
 *         idUsuario:
 *           type: string
 *           description: ID del usuario que hace la solicitud
 *         estado:
 *           type: string
 *           enum: [pendiente, aprobada, rechazada]
 *           default: pendiente
 *         mensaje:
 *           type: string
 *           description: Mensaje del usuario al solicitar
 *         respuestaAdmin:
 *           type: string
 *           description: Respuesta del administrador
 *       example:
 *         idGrupo: "507f1f77bcf86cd799439011"
 *         mensaje: "Me gustaría unirme al coro"
 */

/**
 * @swagger
 * /group-requests:
 *   get:
 *     summary: Obtener todas las solicitudes (admin)
 *     tags: [GroupRequests]
 */
router.get('/', validarJWT, groupRequestController.getGroupRequests);

/**
 * @swagger
 * /group-requests/my-requests:
 *   get:
 *     summary: Obtener las solicitudes del usuario actual
 *     tags: [GroupRequests]
 */
router.get('/my-requests', validarJWT, groupRequestController.getGroupRequestsByUser);

/**
 * @swagger
 * /group-requests/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [GroupRequests]
 */
router.get('/:id', validarJWT, groupRequestController.getGroupRequestById);

/**
 * @swagger
 * /group-requests:
 *   post:
 *     summary: Crear una nueva solicitud de unión
 *     tags: [GroupRequests]
 */
router.post('/', validarJWT, groupRequestController.createGroupRequest);

/**
 * @swagger
 * /group-requests/{id}/approve:
 *   put:
 *     summary: Aprobar una solicitud
 *     tags: [GroupRequests]
 */
router.put('/:id/approve', validarJWT, groupRequestController.approveGroupRequest);

/**
 * @swagger
 * /group-requests/{id}/reject:
 *   put:
 *     summary: Rechazar una solicitud
 *     tags: [GroupRequests]
 */
router.put('/:id/reject', validarJWT, groupRequestController.rejectGroupRequest);

/**
 * @swagger
 * /group-requests/{id}:
 *   delete:
 *     summary: Eliminar una solicitud
 *     tags: [GroupRequests]
 */
router.delete('/:id', validarJWT, groupRequestController.deleteGroupRequest);

export default router;
