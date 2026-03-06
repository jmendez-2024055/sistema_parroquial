const express = require('express');
const router = express.Router();
const massScheduleController = require('./massSchedule.controller');

router.get('/', massScheduleController.getAll);
router.get('/:id', massScheduleController.getById);
router.post('/', massScheduleController.create);
router.put('/:id', massScheduleController.update);
router.delete('/:id', massScheduleController.delete);

module.exports = router;