const express = require('express');
const router = express.Router();
const parkingController = require('../controllers/parking.controller');
const { verifyToken, isManager } = require('../middleware/auth');

// 🔐 Apenas administradores podem criar, atualizar ou remover vagas
router.post('/', [verifyToken, isManager], parkingController.createSlot);
router.put('/:id', [verifyToken, isManager], parkingController.updateSlot);
router.delete('/:id', [verifyToken, isManager], parkingController.deleteSlot);

// ✅ Todos podem visualizar vagas disponíveis
router.get('/', parkingController.listSlots);

module.exports = router;
