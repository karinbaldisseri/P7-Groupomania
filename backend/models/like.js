const Sequelize = require('sequelize');
const dbSequelize = require('../config/database');

const Like = dbSequelize.define('like', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER.UNSIGNED
  },
  likeValue: {
    allowNull: false,
    type: Sequelize.INTEGER,
    defaultValue: 1 
  }
});

module.exports = Like;