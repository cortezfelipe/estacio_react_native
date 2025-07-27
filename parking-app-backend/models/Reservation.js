const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const ParkingSlot = require('./ParkingSlot');

// Reservation model represents a booking of a parking slot by a user on a specific date.
const Reservation = sequelize.define('Reservation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    comment: 'Date of the reservation (YYYY-MM-DD)',
  },
  status: {
    type: DataTypes.ENUM('booked', 'cancelled'),
    allowNull: false,
    defaultValue: 'booked',
  },
});

// Define relationships
User.hasMany(Reservation, { foreignKey: 'userId', as: 'reservations' });
Reservation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ParkingSlot.hasMany(Reservation, { foreignKey: 'slotId', as: 'reservations' });
Reservation.belongsTo(ParkingSlot, { foreignKey: 'slotId', as: 'slot' });

module.exports = Reservation;