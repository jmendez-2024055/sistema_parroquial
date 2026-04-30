import { Router } from 'express';
import massScheduleController from './massSchedule.controller.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MassSchedule:
 *       type: object
 *       required:
 *         - dia
 *         - hora
 *         - lugar
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         dia:
 *           type: string
 *           description: Día de la misa
 *         hora:
 *           type: string
 *           description: Hora de la misa
 *         lugar:
 *           type: string
 *           description: Lugar donde se celebra la misa
 *         descripcion:
 *           type: string
 *           description: Descripción adicional
 *         estado:
 *           type: boolean
 *           default: true
 *           description: Estado del horario
 *       example:
 *         dia: "Domingo"
 *         hora: "08:00"
 *         lugar: "Parroquia Central"
 *         descripcion: "Misa principal dominical"
 */

/**
 * @swagger
 * /massSchedule:
 *   get:
 *     summary: Obtener todos los horarios de misa
 *     tags: [Misa]
 *     responses:
 *       200:
 *         description: Lista de horarios
 */
router.get('/', massScheduleController.getAll);

/**
 * @swagger
 * /massSchedule/{id}:
 *   get:
 *     summary: Obtener un horario de misa por ID
 *     tags: [Misa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario encontrado
 *       404:
 *         description: No encontrado
 */
router.get('/:id', massScheduleController.getById);

/**
 * @swagger
 * /massSchedule:
 *   post:
 *     summary: Crear un horario de misa
 *     tags: [Misa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MassSchedule'
 *     responses:
 *       201:
 *         description: Horario creado correctamente
 */
router.post('/', massScheduleController.create);

/**
 * @swagger
 * /massSchedule/{id}:
 *   put:
 *     summary: Actualizar un horario de misa
 *     tags: [Misa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MassSchedule'
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente
 *       404:
 *         description: No encontrado
 */
router.put('/:id', massScheduleController.update);

/**
 * @swagger
 * /massSchedule/{id}:
 *   delete:
 *     summary: Eliminar un horario de misa
 *     tags: [Misa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del horario
 *     responses:
 *       200:
 *         description: Horario eliminado correctamente
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', massScheduleController.delete);

export default router;