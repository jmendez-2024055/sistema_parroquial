import { body, validationResult } from 'express-validator';

export const validateCreateNotice = [
    body('titulo')
        .notEmpty().withMessage('El título es obligatorio')
        .isLength({ max: 150 }).withMessage('El título no puede superar los 150 caracteres'),

    body('contenido')
        .notEmpty().withMessage('El contenido es obligatorio')
        .isLength({ max: 1000 }).withMessage('El contenido no puede superar los 1000 caracteres'),

    body('fechaPublicacion')
        .notEmpty().withMessage('La fecha de publicación es obligatoria')
        .isISO8601().withMessage('Debe ser una fecha válida (YYYY-MM-DD)'),

    body('usuario')
        .notEmpty().withMessage('El ID del usuario es obligatorio')
        .isMongoId().withMessage('El ID del usuario no es válido'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: errors.array(),
            });
        }
        next();
    },
];