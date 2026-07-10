import express from 'express';
import { validarJWT } from '../../middlewares/validar-jwt.js';
import { esAdmin } from '../../middlewares/validar-roles.js';
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
router.post('/', validarJWT, esAdmin, createParishController);
router.get('/', getAllParishesController);
router.get('/search', getAllParishesController); // Búsqueda por texto
router.get('/nearest', findNearestParishController); // Parroquia más cercana
router.get('/nearby', findParishesWithinRadiusController); // Parroquias en radio
router.get('/discover', discoverNearbyParishesController); // Descubrir parroquias (BD + Overpass)
router.post('/claim', validarJWT, claimParishController); // Reclamar o crear parroquia desde candidato
router.get('/:id', getParishByIdController);
router.put('/:id', validarJWT, esAdmin, updateParishController);
router.delete('/:id', validarJWT, esAdmin, deleteParishController);

export default router;
