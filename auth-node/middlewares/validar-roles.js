export const validarRol = (rolesPermitidos = []) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            const userRole = req.user.role || '';
            
            // Si rolesPermitidos está vacío, permitir acceso a cualquier usuario autenticado
            if (rolesPermitidos.length === 0) {
                return next();
            }

            // Verificar si el usuario tiene alguno de los roles permitidos
            const tieneRolPermitido = rolesPermitidos.includes(userRole);

            if (!tieneRolPermitido) {
                return res.status(403).json({
                    success: false,
                    message: 'No tienes permisos para realizar esta acción'
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Error al validar roles'
            });
        }
    };
};

export const esAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        const userRole = req.user.role || '';
        
        // Verificar si el usuario es admin
        if (userRole !== 'ADMIN_ROLE') {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para realizar esta acción'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al validar roles'
        });
    }
};
