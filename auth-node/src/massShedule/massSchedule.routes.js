import { Router } from 'express';
import massScheduleController from './massSchedule.controller.js';

const router = Router();

router.get('/', massScheduleController.getAll);
router.get('/:id', massScheduleController.getById);
router.post('/', massScheduleController.create);
router.put('/:id', massScheduleController.update);
router.delete('/:id', massScheduleController.delete);

export default router;