import { Router } from 'express';
import * as categoriaController from './category.controller.js';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esAdmin } from '../../middlewares/validar-roles.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nombre
 *         - descripcion
 *       properties:
 *         _id:
 *           type: string
 *           description: ID autogenerado por MongoDB
 *         nombre:
 *           type: string
 *           description: Nombre de la categoría
 *         descripcion:
 *           type: string
 *           description: Descripción de la categoría
 *         estado:
 *           type: boolean
 *           default: true
 *           description: Estado activo de la categoría
 *       example:
 *         nombre: "Donaciones"
 *         descripcion: "Categoría para registrar donaciones"
 */

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Obtener todas las categorías
 *     tags: [Categoria]
 */
router.get('/', validarJWT, categoriaController.getCategorias);

/**
 * @swagger
 * /category/initialize:
 *   post:
 *     summary: Inicializar categorías por defecto para la parroquia
 *     tags: [Categoria]
 */
router.post('/initialize', validarJWT, categoriaController.initializeCategorias);

/**
 * @swagger
 * /category/{id}:
 *   get:
 *     summary: Obtener una categoría por ID
 *     tags: [Categoria]
 */
router.get('/:id', validarJWT, categoriaController.getCategoriaById);

/**
 * @swagger
 * /category:
 *   post:
 *     summary: Crear una nueva categoría
 *     tags: [Categoria]
 */
router.post('/', validarJWT, esAdmin, categoriaController.createCategoria);

/**
 * @swagger
 * /category/{id}:
 *   put:
 *     summary: Actualizar una categoría
 *     tags: [Categoria]
 */
router.put('/:id', validarJWT, esAdmin, categoriaController.updateCategoria);

/**
 * @swagger
 * /category/{id}:
 *   delete:
 *     summary: Eliminar una categoría
 *     tags: [Categoria]
 */
router.delete('/:id', validarJWT, esAdmin, categoriaController.deleteCategoria);

export default router;