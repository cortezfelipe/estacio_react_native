const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Model for individual parking spaces.  Each slot can have many reservations across dates.
const ParkingSlot = sequelize.define('ParkingSlot', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: 'Identifier for the slot, e.g. A1, B2, etc.',
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Optional description or location information.',
  },
});

module.exports = ParkingSlot;