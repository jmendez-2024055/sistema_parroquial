import { Router } from 'express';
import massScheduleController from './massSchedule.controller.js';
import { validateCreateMassSchedule } from '../../middlewares/MassSchedule-validator.js';

const router = Router();

router.get('/', (req, res) => massScheduleController.getAll(req, res));
router.get('/:id', (req, res) => massScheduleController.getById(req, res));
router.post('/', validateCreateMassSchedule, (req, res) => massScheduleController.create(req, res));
router.put('/:id', validateCreateMassSchedule, (req, res) => massScheduleController.update(req, res));
router.delete('/:id', (req, res) => massScheduleController.delete(req, res));

export default router;