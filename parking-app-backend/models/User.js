const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

// Define the User model.  Users can be either regular clients or parking managers.
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'manager'),
    allowNull: false,
    defaultValue: 'user',
  },
});

module.exports = User;