import { Router } from 'express';
import * as groupController from './group.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esAdmin } from '../../middlewares/validar-roles.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - nombreGrupo
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         nombreGrupo:
 *           type: string
 *           description: Nombre del grupo (ej: Coros, Monaguillos, etc.)
 *         descripcion:
 *           type: string
 *           description: Descripción del grupo
 *         requisitos:
 *           type: string
 *           description: Requisitos para unirse al grupo
 *         cupoMaximo:
 *           type: number
 *           description: Cupo máximo de miembros
 *         isActive:
 *           type: boolean
 *           default: true
 *           description: Estado activo del grupo
 *       example:
 *         nombreGrupo: "Coros"
 *         descripcion: "Grupo de coro para las misas dominicales"
 *         requisitos: "Tener buena voz y disponibilidad los domingos"
 *         cupoMaximo: 20
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Obtener todos los grupos
 *     tags: [Groups]
 */
router.get('/', validarJWT, groupController.getGroups);

/**
 * @swagger
 * /groups/initialize:
 *   post:
 *     summary: Inicializar grupos por defecto para la parroquia
 *     tags: [Groups]
 */
router.post('/initialize', validarJWT, esAdmin, groupController.initializeGroups);

/**
 * @swagger
 * /groups/{id}:
 *   get:
 *     summary: Obtener un grupo por ID
 *     tags: [Groups]
 */
router.get('/:id', validarJWT, groupController.getGroupById);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Crear un nuevo grupo
 *     tags: [Groups]
 */
router.post('/', validarJWT, esAdmin, groupController.createGroup);

/**
 * @swagger
 * /groups/{id}:
 *   put:
 *     summary: Actualizar un grupo
 *     tags: [Groups]
 */
router.put('/:id', validarJWT, esAdmin, groupController.updateGroup);

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     summary: Eliminar un grupo
 *     tags: [Groups]
 */
router.delete('/:id', validarJWT, esAdmin, groupController.deleteGroup);

export default router;
