import { Router } from 'express';
import { body } from 'express-validator';
import {
    crearAviso,
    listarAvisos,
    obtenerAvisoPorId,
    editarAviso,
    eliminarAviso
} from './notice.controller.js';

import { validarCampos } from '../../middlewares/validar-campos.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';

const router = Router();

const validarAviso = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 150 }),

    body('contenido')
        .notEmpty().withMessage('El contenido es obligatorio')
        .isLength({ max: 1000 }),

    body('estado')
        .optional()
        .isIn(['ACTIVO', 'INACTIVO']),

    validarCampos
];

/**
 * @swagger
 * components:
 *   schemas:
 *     Aviso:
 *       type: object
 *       required:
 *         - titulo
 *         - contenido
 *       properties:
 *         _id:
 *           type: string
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *         estado:
 *           type: string
 *           enum: [ACTIVO, INACTIVO]
 *       example:
 *         titulo: "Cambio de horario"
 *         contenido: "La misa del domingo será a las 9:00 AM"
 *         estado: "ACTIVO"
 */

/**
 * @swagger
 * /notice:
 *   post:
 *     summary: Crear un aviso
 *     tags: [Aviso]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aviso'
 *     responses:
 *       201:
 *         description: Aviso creado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 */
router.post('/', validarJWT, validarAviso, crearAviso);

/**
 * @swagger
 * /notice/{id}:
 *   put:
 *     summary: Editar un aviso
 *     tags: [Aviso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aviso'
 *     responses:
 *       200:
 *         description: Aviso actualizado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Aviso no encontrado
 */
router.put('/:id', validarJWT, validarAviso, editarAviso);

/**
 * @swagger
 * /notice/{id}:
 *   delete:
 *     summary: Eliminar un aviso
 *     tags: [Aviso]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aviso eliminado correctamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Aviso no encontrado
 */
router.delete('/:id', validarJWT, eliminarAviso);

/**
 * @swagger
 * /notice:
 *   get:
 *     summary: Obtener todos los avisos
 *     tags: [Aviso]
 *     responses:
 *       200:
 *         description: Lista de avisos
 */
router.get('/', listarAvisos);

/**
 * @swagger
 * /notice/{id}:
 *   get:
 *     summary: Obtener un aviso por ID
 *     tags: [Aviso]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Aviso encontrado
 *       404:
 *         description: Aviso no encontrado
 */
router.get('/:id', obtenerAvisoPorId);

export default router;