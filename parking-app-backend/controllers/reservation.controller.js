const { Reservation, ParkingSlot, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create a reservation for a parking slot on a given date.
 */
async function createReservation(req, res) {
  const { slotId, date } = req.body;
  const userId = req.userId;

  try {
    const slot = await ParkingSlot.findByPk(slotId);
    if (!slot) {
      return res.status(404).json({ message: 'Parking slot not found.' });
    }

    const existing = await Reservation.findOne({
      where: { slotId, date, status: 'booked' },
    });

    if (existing) {
      return res.status(400).json({ message: 'Parking slot already booked for this date.' });
    }

    const reservation = await Reservation.create({
      slotId,
      userId,
      date,
      status: 'booked',
    });

    return res.status(201).json(reservation);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create reservation.' });
  }
}

/**
 * Get reservations. Users see their own reservations; managers see all.
 */
async function listReservations(req, res) {
  const userId = req.userId;

  try {
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

/**
 * Update a reservation (only manager).
 */
async function updateReservation(req, res) {
  const userId = req.userId;
  const { id } = req.params;
  const { slotId, date } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Only managers can update reservations.' });
    }

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    // Optional: check if the new slot/date is already booked by another reservation
    if (slotId && date) {
      const conflict = await Reservation.findOne({
        where: {
          id: { [Op.ne]: id },
          slotId,
          date,
          status: 'booked',
        },
      });

      if (conflict) {
        return res.status(400).json({ message: 'This slot is already booked for the selected date.' });
      }
    }

    if (slotId) reservation.slotId = slotId;
    if (date) reservation.date = date;

    await reservation.save();

    return res.status(200).json({ message: 'Reservation updated successfully.', reservation });
  } catch (err) {
    console.error('Failed to update reservation:', err);
    return res.status(500).json({ message: 'Failed to update reservation.' });
  }
}

/**
 * Delete a reservation (only manager).
 */
async function deleteReservation(req, res) {
  const userId = req.userId;
  const { id } = req.params;

  try {
    const user = await User.findByPk(userId);
    if (!user || user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Only managers can delete reservations.' });
    }

    const reservation = await Reservation.findByPk(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found.' });
    }

    await reservation.destroy();
    return res.status(200).json({ message: 'Reservation deleted successfully.' });
  } catch (err) {
    console.error('Failed to delete reservation:', err);
    return res.status(500).json({ message: 'Failed to delete reservation.' });
  }
}


module.exports = {
  createReservation,
  listReservations,
  updateReservation,
  deleteReservation,
};
