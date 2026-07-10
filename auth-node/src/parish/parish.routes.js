import express from 'express';
import {
    createParishController,
    getAllParishesController,
    getParishByIdController,
    updateParishController,
    deleteParishController,
    findNearestParishController,
    findParishesWithinRadiusController,
    discoverNearbyParishesController,
    claimParishController
} from './parish.controller.js';

const router = express.Router();

// CRUD básico
router.post('/', createParishController);
router.get('/', getAllParishesController);
router.get('/search', getAllParishesController); // Búsqueda por texto
router.get('/nearest', findNearestParishController); // Parroquia más cercana
router.get('/nearby', findParishesWithinRadiusController); // Parroquias en radio
router.get('/discover', discoverNearbyParishesController); // Descubrir parroquias (BD + Overpass)
router.post('/claim', claimParishController); // Reclamar o crear parroquia desde candidato
router.get('/:id', getParishByIdController);
router.put('/:id', updateParishController);
router.delete('/:id', deleteParishController);

export default router;
