import { Router } from 'express';
import * as categoriaController from './category.controller.js';
import { validateJWT } from '../middlewares/auth.middleware.js';
import { validateCreateCategoria } from '../middlewares/categoria-validator.js';
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
    validateCreateCategoria,
    validarCampos,
    categoriaController.createCategoria
);

router.get('/', categoriaController.getCategorias);

router.get('/:id', categoriaController.getCategoriaById);

router.put(
    '/:id',
    validateJWT,
    validateCreateCategoria,
    validarCampos,
    categoriaController.updateCategoria
);

router.delete(
    '/:id',
    validateJWT,
    categoriaController.deleteCategoria
);

export default router;