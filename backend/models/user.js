const Sequelize = require('sequelize');
const dbSequelize = require('../config/database');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

const User = dbSequelize.define('user', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER.UNSIGNED
  },
  email: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true
  },
  firstname: {
    allowNull: false,
    type: Sequelize.STRING
  },
  lastname: {
    allowNull: false,
    type: Sequelize.STRING
  },
  password: {
    allowNull: false,
    type: Sequelize.STRING
  },
  refreshToken: {
    allowNull: true,
    type: Sequelize.STRING
  },
  isAdmin: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    allowNull: false,
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  username: {
    type: Sequelize.VIRTUAL,
    get() {
      return `${this.firstname} ${this.lastname}`;
    },
  }
});

User.hasMany(Post, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Post.belongsTo(User);

User.hasMany(Comment, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Comment.belongsTo(User);

User.hasMany(Like, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Like.belongsTo(User);

module.exports = User;