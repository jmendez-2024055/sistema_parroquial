import { Router } from 'express';
import * as eventController from './event.controller.js';
import { validateJWT } from '../middlewares/auth.middleware.js';
import { createEventoValidator } from '../validators/event.validator.js';
import { validationResult } from 'express-validator';

const router = Router();

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

router.post(
    '/',
    validateJWT,
    createEventoValidator,
    validarCampos,
    eventController.crear
);

router.get('/', eventController.listar);

router.get('/:id', eventController.obtenerPorId);

router.put(
    '/:id',
    validateJWT,
    createEventoValidator,
    validarCampos,
    eventController.actualizar
);

router.delete(
    '/:id',
    validateJWT,
    eventController.eliminar
);

export default router;