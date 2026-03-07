import { Router } from 'express';
import { createCategoria } from './category.controller.js';
import { getCategorias } from './category.controller.js';
import { validateCreateCategoria } from '../../middlewares/categoria-validator.js';

const router = Router();

router.post('/', validateCreateCategoria, createCategoria);
router.get('/', getCategorias);

export default router;
