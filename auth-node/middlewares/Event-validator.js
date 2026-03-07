import { body, validationResult } from 'express-validator';

export const validateCreateEvent = [
    body('titulo')
        .notEmpty().withMessage('El título del evento es obligatorio')
        .isLength({ max: 150 }).withMessage('El título no puede exceder los 150 caracteres'),

    body('descripcion')
        .optional()
        .isLength({ max: 500 }).withMessage('La descripción no puede exceder los 500 caracteres'),

    body('fecha')
        .notEmpty().withMessage('La fecha del evento es obligatoria')
        .isISO8601().withMessage('La fecha debe tener un formato válido (ej. 2025-12-31)'),

    body('hora')
        .notEmpty().withMessage('La hora del evento es obligatoria')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe tener el formato HH:MM (ej. 08:00, 18:30)'),

    body('lugar')
        .optional()
        .isLength({ max: 200 }).withMessage('El lugar no puede exceder los 200 caracteres'),

    body('idCategoria')
        .notEmpty().withMessage('El ID de la categoría es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID de la categoría debe ser un número entero positivo'),

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