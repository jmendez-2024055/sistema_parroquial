import { body, validationResult } from 'express-validator';

export const validateCreateMassSchedule = [
    body('diaSemana')
        .notEmpty().withMessage('El día de la semana es obligatorio')
        .isIn(['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'])
        .withMessage('El día debe ser: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado o Domingo'),

    body('hora')
        .notEmpty().withMessage('La hora es obligatoria')
        .matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe tener el formato HH:MM (ej. 08:00, 18:30)'),

    body('tipoMisa')
        .notEmpty().withMessage('El tipo de misa es obligatorio')
        .isLength({ max: 100 }).withMessage('El tipo de misa no puede exceder los 100 caracteres'),

    body('celebrante')
        .notEmpty().withMessage('El celebrante es obligatorio')
        .isLength({ max: 150 }).withMessage('El nombre del celebrante no puede exceder los 150 caracteres'),

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
