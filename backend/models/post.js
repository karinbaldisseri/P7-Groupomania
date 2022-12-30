const Sequelize = require('sequelize');
const dbSequelize = require('../config/database');
const Comment = require('../models/comment');
const Like = require('../models/like');

const Post = dbSequelize.define('post', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER.UNSIGNED
  },
  content: {
    allowNull: false,
    type: Sequelize.STRING
  },
  imageUrl: {
    allowNull: true,
    type: Sequelize.STRING
  }
});

Post.hasMany(Comment, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Comment.belongsTo(Post);

Post.hasMany(Like, {
  foreignKey: { allowNull: false },
  onDelete: "CASCADE"
});
Like.belongsTo(Post);

module.exports = Post;