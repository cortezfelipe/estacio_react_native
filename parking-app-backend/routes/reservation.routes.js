const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservation.controller');
const { verifyToken } = require('../middleware/auth');

// Create a reservation (authenticated user)
router.post('/', verifyToken, reservationController.createReservation);

// List reservations.  Authenticated users get their own; managers get all.
router.get('/', verifyToken, reservationController.listReservations);

// Edit reservation (only managers can edit)
router.put('/:id', verifyToken, reservationController.updateReservation);

module.exports = router;