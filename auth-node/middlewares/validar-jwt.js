import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'E$3cr3tK3yF0rK1n4lSp0rts@In6am2024';

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

        const decoded = jwt.verify(token, JWT_SECRET); 

        req.user = {
            id: decoded.id || decoded.sub || decoded.nameid,
            role: decoded.role || decoded.roles || []
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