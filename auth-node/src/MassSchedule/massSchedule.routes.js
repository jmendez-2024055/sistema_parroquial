import { Router } from 'express';
import massScheduleController from './massSchedule.controller.js';

const router = Router();

router.get('/', (req, res) => massScheduleController.getAll(req, res));
router.get('/:id', (req, res) => massScheduleController.getById(req, res));
router.post('/', (req, res) => massScheduleController.create(req, res));
router.put('/:id', (req, res) => massScheduleController.update(req, res));
router.delete('/:id', (req, res) => massScheduleController.delete(req, res));

export default router;