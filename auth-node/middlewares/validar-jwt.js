import jwt from 'jsonwebtoken';

export const validarJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const token = authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        const decoded = jwt.verify(token, 'TU_SECRETO'); 

        req.user = {
            id: decoded.id || decoded.sub || decoded.nameid
        };

        if (!req.user.id) {
            return res.status(401).json({
                success: false,
                message: 'Token sin identificador de usuario'
            });
        }

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};