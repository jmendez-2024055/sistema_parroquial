import Parish from './parish.model.js';
import { findNearbyCatholicChurches } from './overpass.service.js';

// Calcular distancia entre dos coordenadas usando fórmula de Haversine
// Retorna distancia en kilómetros
const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
};

const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
};

// Crear nueva parroquia
const createParish = async (parishData) => {
    try {
        const parish = new Parish(parishData);
        await parish.save();
        return parish;
    } catch (error) {
        throw new Error(`Error al crear parroquia: ${error.message}`);
    }
};

// Obtener todas las parroquias
const getAllParishes = async (filters = {}) => {
    try {
        const { isActive = true } = filters;
        const query = isActive !== undefined ? { isActive } : {};
        return await Parish.find(query).sort({ nombre: 1 });
    } catch (error) {
        throw new Error(`Error al obtener parroquias: ${error.message}`);
    }
};

// Obtener parroquia por ID
const getParishById = async (id) => {
    try {
        const parish = await Parish.findById(id);
        if (!parish) {
            throw new Error('Parroquia no encontrada');
        }
        return parish;
    } catch (error) {
        throw new Error(`Error al obtener parroquia: ${error.message}`);
    }
};

// Actualizar parroquia
const updateParish = async (id, updateData) => {
    try {
        const parish = await Parish.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );
        if (!parish) {
            throw new Error('Parroquia no encontrada');
        }
        return parish;
    } catch (error) {
        throw new Error(`Error al actualizar parroquia: ${error.message}`);
    }
};

// Eliminar parroquia (soft delete)
const deleteParish = async (id) => {
    try {
        const parish = await Parish.findByIdAndUpdate(
            id, 
            { isActive: false }, 
            { new: true }
        );
        if (!parish) {
            throw new Error('Parroquia no encontrada');
        }
        return parish;
    } catch (error) {
        throw new Error(`Error al eliminar parroquia: ${error.message}`);
    }
};

// Encontrar parroquia más cercana basada en coordenadas
const findNearestParish = async (lat, lon, maxDistanceKm = 50) => {
    try {
        const parishes = await Parish.find({ isActive: true });
        
        if (parishes.length === 0) {
            throw new Error('No hay parroquias activas disponibles');
        }

        let nearestParish = null;
        let minDistance = Infinity;

        parishes.forEach(parish => {
            const distance = calculateDistance(
                lat, 
                lon, 
                parish.ubicacion.latitud, 
                parish.ubicacion.longitud
            );
            
            if (distance < minDistance && distance <= maxDistanceKm) {
                minDistance = distance;
                nearestParish = {
                    ...parish.toObject(),
                    distanciaKm: parseFloat(distance.toFixed(2))
                };
            }
        });

        if (!nearestParish) {
            throw new Error(`No se encontró ninguna parroquia dentro de ${maxDistanceKm} km`);
        }

        return nearestParish;
    } catch (error) {
        throw new Error(`Error al buscar parroquia más cercana: ${error.message}`);
    }
};

// Buscar parroquias dentro de un radio específico
const findParishesWithinRadius = async (lat, lon, radiusKm = 50) => {
    try {
        const parishes = await Parish.find({ isActive: true });
        
        const parishesWithinRadius = parishes
            .map(parish => {
                const distance = calculateDistance(
                    lat, 
                    lon, 
                    parish.ubicacion.latitud, 
                    parish.ubicacion.longitud
                );
                
                return {
                    ...parish.toObject(),
                    distanciaKm: parseFloat(distance.toFixed(2))
                };
            })
            .filter(parish => parish.distanciaKm <= radiusKm)
            .sort((a, b) => a.distanciaKm - b.distanciaKm);

        return parishesWithinRadius;
    } catch (error) {
        throw new Error(`Error al buscar parroquias en el radio: ${error.message}`);
    }
};

// Buscar parroquias por texto (nombre o dirección)
const searchParishes = async (searchTerm) => {
    try {
        const parishes = await Parish.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { nombre: { $regex: searchTerm, $options: 'i' } },
                        { direccion: { $regex: searchTerm, $options: 'i' } }
                    ]
                }
            ]
        });
        return parishes;
    } catch (error) {
        throw new Error(`Error al buscar parroquias: ${error.message}`);
    }
};

// Descubrir parroquias cercanas combinando base de datos y Overpass API
const discoverNearbyParishes = async (lat, lon, radiusMeters = 5000) => {
    try {
        const radiusKm = radiusMeters / 1000;

        // Paso 1: Buscar parroquias existentes en MongoDB dentro del radio
        const existingParishes = await findParishesWithinRadius(lat, lon, radiusKm);

        // Paso 2: Buscar iglesias católicas en Overpass
        const overpassChurches = await findNearbyCatholicChurches(lat, lon, radiusMeters);

        // Paso 3: Filtrar resultados de Overpass para evitar duplicados
        const existingOsmIds = new Set(existingParishes.filter(p => p.osmId).map(p => p.osmId));
        const existingCoordinates = existingParishes.map(p => ({
            lat: p.ubicacion.latitud,
            lon: p.ubicacion.longitud
        }));

        const newCandidates = overpassChurches.filter(church => {
            // Descartar si ya existe por osmId
            if (existingOsmIds.has(church.osmId)) {
                return false;
            }

            // Descartar si está a menos de 50 metros de una parroquia existente
            const isTooClose = existingCoordinates.some(coord => {
                const distance = calculateDistance(
                    church.latitud,
                    church.longitud,
                    coord.lat,
                    coord.lon
                );
                return distance < 0.05; // 50 metros = 0.05 km
            });

            return !isTooClose;
        });

        // Paso 4: Combinar resultados y calcular distancias
        const combinedResults = [
            ...existingParishes.map(p => ({
                ...p,
                isClaimed: true
            })),
            ...newCandidates.map(church => ({
                ...church,
                distanciaKm: parseFloat(calculateDistance(lat, lon, church.latitud, church.longitud).toFixed(2))
            }))
        ];

        // Ordenar por distancia
        combinedResults.sort((a, b) => a.distanciaKm - b.distanciaKm);

        return combinedResults;
    } catch (error) {
        throw new Error(`Error al descubrir parroquias cercanas: ${error.message}`);
    }
};

// Reclamar o crear parroquia desde un candidato de Overpass
const claimOrCreateParish = async ({ osmId, nombre, direccion, latitud, longitud }) => {
    try {
        // Verificar si ya existe una parroquia con ese osmId
        const existingParish = await Parish.findOne({ osmId });
        
        if (existingParish) {
            // Idempotente: si ya existe, devolverla tal cual
            return existingParish;
        }

        // Crear nueva parroquia con isClaimed: false
        const newParish = await createParish({
            nombre,
            direccion,
            ubicacion: {
                latitud,
                longitud
            },
            osmId,
            isClaimed: false,
            isActive: true
        });

        return newParish;
    } catch (error) {
        throw new Error(`Error al reclamar o crear parroquia: ${error.message}`);
    }
};

export {
    createParish,
    getAllParishes,
    getParishById,
    updateParish,
    deleteParish,
    findNearestParish,
    findParishesWithinRadius,
    searchParishes,
    discoverNearbyParishes,
    claimOrCreateParish,
    calculateDistance
};
