import { Router } from 'express';
import { body } from 'express-validator';
import {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
} from './intencion.controller.js';

import { validarCampos } from '../../middlewares/validar-campos.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esAdmin } from '../../middlewares/validar-roles.js';

const router = Router();

const validarIntencion = [
    body('massScheduleId')
        .notEmpty().withMessage('El horario de misa es obligatorio')
        .isMongoId().withMessage('El horario de misa debe ser un ID válido'),

    body('nombreSolicitante')
        .notEmpty().withMessage('El nombre del solicitante es obligatorio')
        .trim()
        .isLength({ max: 150 }).withMessage('El nombre no puede exceder 150 caracteres'),

    body('intencion')
        .notEmpty().withMessage('La intención es obligatoria')
        .trim()
        .isLength({ max: 500 }).withMessage('La intención no puede exceder 500 caracteres'),

    validarCampos
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Intencion:
 *       type: object
 *       required:
 *         - massScheduleId
 *         - fechaMisa
 *         - nombreSolicitante
 *         - intencion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         massScheduleId:
 *           type: string
 *           description: ID del horario de misa
 *         fechaMisa:
 *           type: string
 *           format: date-time
 *           description: Fecha de la misa
 *         nombreSolicitante:
 *           type: string
 *           description: Nombre del solicitante
 *         intencion:
 *           type: string
 *           description: Texto de la intención
 *         userId:
 *           type: string
 *           description: ID del usuario que crea la intención
 *         estado:
 *           type: string
 *           enum: [PENDIENTE, LEIDA]
 *           default: PENDIENTE
 *       example:
 *         massScheduleId: "64abc123..."
 *         fechaMisa: "2026-07-15T10:00:00.000Z"
 *         nombreSolicitante: "Juan Pérez"
 *         intencion: "Por la salud de mi mamá"
 */

/**
 * @swagger
 * /intencion:
 *   post:
 *     summary: Crear una intención de misa
 *     tags: [Intencion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intencion'
 *     responses:
 *       201:
 *         description: Intención creada correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', validarJWT, validarIntencion, crear);

/**
 * @swagger
 * /intencion:
 *   get:
 *     summary: Obtener todas las intenciones de la parroquia
 *     tags: [Intencion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de intenciones
 *       401:
 *         description: No autorizado
 */
router.get('/', validarJWT, listar);

/**
 * @swagger
 * /intencion/{id}:
 *   get:
 *     summary: Obtener una intención por ID
 *     tags: [Intencion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la intención
 *     responses:
 *       200:
 *         description: Intención encontrada
 *       404:
 *         description: Intención no encontrada
 */
router.get('/:id', validarJWT, obtenerPorId);

/**
 * @swagger
 * /intencion/{id}:
 *   put:
 *     summary: Actualizar una intención
 *     tags: [Intencion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la intención
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Intencion'
 *     responses:
 *       200:
 *         description: Intención actualizada correctamente
 *       404:
 *         description: Intención no encontrada
 */
router.put('/:id', validarJWT, validarIntencion, actualizar);

/**
 * @swagger
 * /intencion/{id}:
 *   delete:
 *     summary: Eliminar una intención
 *     tags: [Intencion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la intención
 *     responses:
 *       200:
 *         description: Intención eliminada correctamente
 *       404:
 *         description: Intención no encontrada
 */
router.delete('/:id', validarJWT, eliminar);

export default router;
