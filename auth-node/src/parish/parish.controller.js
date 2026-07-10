import {
    createParish,
    getAllParishes,
    getParishById,
    updateParish,
    deleteParish,
    findNearestParish,
    findParishesWithinRadius,
    searchParishes,
    discoverNearbyParishes,
    claimOrCreateParish
} from './parish.service.js';

// Crear nueva parroquia
export const createParishController = async (req, res) => {
    try {
        const parish = await createParish(req.body);
        res.status(201).json({
            success: true,
            message: 'Parroquia creada exitosamente',
            data: parish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener todas las parroquias
export const getAllParishesController = async (req, res) => {
    try {
        const { isActive, search } = req.query;
        
        let parishes;
        if (search) {
            parishes = await searchParishes(search);
        } else {
            parishes = await getAllParishes({ isActive: isActive === 'false' ? false : true });
        }
        
        res.status(200).json({
            success: true,
            message: 'Parroquias obtenidas exitosamente',
            data: parishes,
            count: parishes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Obtener parroquia por ID
export const getParishByIdController = async (req, res) => {
    try {
        const parish = await getParishById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Parroquia obtenida exitosamente',
            data: parish
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Actualizar parroquia
export const updateParishController = async (req, res) => {
    try {
        const parish = await updateParish(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: 'Parroquia actualizada exitosamente',
            data: parish
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Eliminar parroquia
export const deleteParishController = async (req, res) => {
    try {
        const parish = await deleteParish(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Parroquia eliminada exitosamente',
            data: parish
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Encontrar parroquia más cercana
export const findNearestParishController = async (req, res) => {
    try {
        const { lat, lon, maxDistance } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Las coordenadas (lat, lon) son requeridas'
            });
        }
        
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const maxDistanceKm = maxDistance ? parseFloat(maxDistance) : 50;
        
        const nearestParish = await findNearestParish(latitude, longitude, maxDistanceKm);
        
        res.status(200).json({
            success: true,
            message: 'Parroquia más cercana encontrada',
            data: nearestParish
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        });
    }
};

// Buscar parroquias dentro de un radio
export const findParishesWithinRadiusController = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Las coordenadas (lat, lon) son requeridas'
            });
        }
        
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const radiusKm = radius ? parseFloat(radius) : 50;
        
        const parishes = await findParishesWithinRadius(latitude, longitude, radiusKm);
        
        res.status(200).json({
            success: true,
            message: `Parroquias encontradas dentro de ${radiusKm} km`,
            data: parishes,
            count: parishes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Descubrir parroquias cercanas combinando base de datos y Overpass API
export const discoverNearbyParishesController = async (req, res) => {
    try {
        const { lat, lon, radius } = req.query;
        
        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                message: 'Las coordenadas (lat, lon) son requeridas'
            });
        }
        
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);
        const radiusMeters = radius ? parseInt(radius) : 5000;
        
        const parishes = await discoverNearbyParishes(latitude, longitude, radiusMeters);
        
        res.status(200).json({
            success: true,
            message: 'Parroquias descubiertas exitosamente',
            data: parishes,
            count: parishes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Reclamar o crear parroquia desde un candidato de Overpass
export const claimParishController = async (req, res) => {
    try {
        const { osmId, nombre, direccion, latitud, longitud } = req.body;
        
        if (!osmId || !nombre || !direccion || !latitud || !longitud) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos (osmId, nombre, direccion, latitud, longitud) son requeridos'
            });
        }
        
        const parish = await claimOrCreateParish({
            osmId,
            nombre,
            direccion,
            latitud: parseFloat(latitud),
            longitud: parseFloat(longitud)
        });
        
        res.status(200).json({
            success: true,
            message: 'Parroquia reclamada o creada exitosamente',
            data: parish
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
