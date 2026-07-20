import { Router } from 'express';
import * as eventController from './event.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esAdmin } from '../../middlewares/validar-roles.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Evento:
 *       type: object
 *       required:
 *         - nombre
 *         - fecha
 *         - lugar
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         nombre:
 *           type: string
 *           description: Nombre del evento
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del evento
 *         lugar:
 *           type: string
 *           description: Lugar donde se realizará el evento
 *         descripcion:
 *           type: string
 *           description: Descripción del evento
 *         estado:
 *           type: boolean
 *           default: true
 *           description: Estado del evento
 *       example:
 *         nombre: "Misa dominical"
 *         fecha: "2026-05-10"
 *         lugar: "Parroquia Central"
 *         descripcion: "Celebración de la misa dominical"
 */

/**
 * @swagger
 * /event:
 *   get:
 *     summary: Obtener todos los eventos
 *     tags: [Evento]
 *     responses:
 *       200:
 *         description: Lista de eventos
 */
router.get('/', validarJWT, eventController.listar);

/**
 * @swagger
 * /event/{id}:
 *   get:
 *     summary: Obtener un evento por ID
 *     tags: [Evento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento encontrado
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id', validarJWT, eventController.obtenerPorId);

/**
 * @swagger
 * /event:
 *   post:
 *     summary: Crear un evento
 *     tags: [Evento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       201:
 *         description: Evento creado correctamente
 */
router.post('/', validarJWT, esAdmin, eventController.crear);

/**
 * @swagger
 * /event/{id}:
 *   put:
 *     summary: Actualizar un evento
 *     tags: [Evento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Evento'
 *     responses:
 *       200:
 *         description: Evento actualizado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.put('/:id', validarJWT, esAdmin, eventController.actualizar);

/**
 * @swagger
 * /event/{id}:
 *   delete:
 *     summary: Eliminar un evento
 *     tags: [Evento]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del evento
 *     responses:
 *       200:
 *         description: Evento eliminado correctamente
 *       404:
 *         description: Evento no encontrado
 */
router.delete('/:id', validarJWT, esAdmin, eventController.eliminar);

export default router;