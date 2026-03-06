import { Router } from 'express';
import * as eventoController from './evento.controller.js';

const router = Router();

router.post('/', eventoController.crear);
router.get('/', eventoController.listar);
router.get('/:id', eventoController.obtenerPorId);
router.put('/:id', eventoController.actualizar);
router.delete('/:id', eventoController.eliminar);

export default router;