// CONNECTION to DATABASE with SEQUELIZE
require('dotenv').config();
const Sequelize = require('sequelize');

module.exports = new Sequelize(`${process.env.DB_CONNECTION_NAME}`, `${process.env.DB_CONNECTION_USERNAME}`, `${process.env.DB_CONNECTION_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,  
  dialect: 'mysql',
  },
);
