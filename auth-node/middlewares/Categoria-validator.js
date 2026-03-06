import { body, validationResult } from 'express-validator';

export const validateCreateCategoria = [
    body('idCategoria')
        .notEmpty().withMessage('El ID de la categoría es obligatorio')
        .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo'),

    body('nombreCategoria')
        .notEmpty().withMessage('El nombre de la categoría es obligatorio')
        .isIn(['Litúrgico', 'Formativo', 'Juvenil', 'Comunitario'])
        .withMessage('El nombre debe ser: Litúrgico, Formativo, Juvenil o Comunitario'),

    body('descripcion')
        .optional()
        .isLength({ max: 255 }).withMessage('La descripción no puede exceder los 255 caracteres'),

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