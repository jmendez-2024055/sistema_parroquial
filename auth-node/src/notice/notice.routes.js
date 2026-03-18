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

router.post('/', validarJWT, validarAviso, crearAviso);
router.put('/:id', validarJWT, validarAviso, editarAviso);
router.delete('/:id', validarJWT, eliminarAviso);

router.get('/', listarAvisos);
router.get('/:id', obtenerAvisoPorId);

export default router;