const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/evento.controller');

router.post('/', eventoController.crear);
router.get('/', eventoController.listar);
router.get('/:id', eventoController.obtenerPorId);
router.put('/:id', eventoController.actualizar);
router.delete('/:id', eventoController.eliminar);

module.exports = router;