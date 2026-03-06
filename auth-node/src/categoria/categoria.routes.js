import { Router } from 'express';
import { createCategoria } from './categoria.controller.js';
import { getCategorias } from './categoria.controller.js';
import { validateCreateCategoria } from '../../middlewares/categoria-validator.js';

const router = Router();

router.post('/', validateCreateCategoria, createCategoria);
router.get('/', getCategorias);

export default router;
