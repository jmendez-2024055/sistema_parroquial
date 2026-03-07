import { Router } from 'express';
import { crearAviso, listarAvisos, editarAviso, eliminarAviso } from './notice.controller.js';
import { validateCreateNotice } from '../../middlewares/Notice-validator.js';

const router = Router();

router.post('/', validateCreateNotice, crearAviso);
router.get('/', listarAvisos);
router.put('/:id', validateCreateNotice, editarAviso);
router.delete('/:id', eliminarAviso);

export default router;