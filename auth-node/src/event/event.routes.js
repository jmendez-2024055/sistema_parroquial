import { Router } from 'express';
import * as eventController from './event.controller.js';
import { validateCreateEvent } from '../../middlewares/Event-validator.js';

const router = Router();

router.post('/', validateCreateEvent, eventController.crear);
router.get('/', eventController.listar);
router.get('/:id', eventController.obtenerPorId);
router.put('/:id', validateCreateEvent, eventController.actualizar);
router.delete('/:id', eventController.eliminar);

export default router;