const { Reservation, ParkingSlot, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a reservation for a parking slot on a given date.
 * A user cannot reserve the same slot on the same date if already booked.
 */
async function createReservation(req, res) {
  const { slotId, date } = req.body;
  const userId = req.userId;
  try {
    // Validate slot exists
    const slot = await ParkingSlot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }
    // Ensure no existing booking for this slot and date
    const existing = await Reservation.findOne({
      where: { slotId, date, status: 'booked' },
    });
    if (existing) {
      return res.status(400).json({ message: 'Parking slot already booked for this date.' });
    }
    // Create reservation
    const reservation = await Reservation.create({ slotId, userId, date, status: 'booked' });
    return res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create reservation.' });
  }
}

/**
 * Get reservations.  Users see their own reservations; managers see all.
 */
async function listReservations(req, res) {
  const userId = req.userId;
  try {
    // Determine if current user is manager
    const user = await User.findByPk(userId);
    const isManager = user && user.role === 'manager';
    const where = isManager ? {} : { userId };
    const reservations = await Reservation.findAll({
      where,
      include: [
        { model: ParkingSlot, as: 'slot' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });
    return res.status(200).json(reservations);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to list reservations.' });
  }
}

module.exports = {
  createReservation,
  listReservations,
};