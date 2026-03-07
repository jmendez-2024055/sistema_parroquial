import { Router } from 'express';
import * as eventController from './event.controller.js';

const router = Router();

router.post('/', eventController.crear);
router.get('/', eventController.listar);
router.get('/:id', eventController.obtenerPorId);
router.put('/:id', eventController.actualizar);
router.delete('/:id', eventController.eliminar);

export default router;