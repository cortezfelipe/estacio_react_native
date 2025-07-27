const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './parking.db', // ou qualquer nome que quiser para o arquivo
  logging: false
});

module.exports = { sequelize };
