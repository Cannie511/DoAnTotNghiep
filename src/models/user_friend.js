'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USER_FRIEND extends Model {
    static associate(models) {
      // define association here
      USER_FRIEND.belongsTo(models.User, { foreignKey: 'User_ID', as: 'User', onDelete: 'CASCADE' });
      USER_FRIEND.belongsTo(models.User, { foreignKey: 'Friend_ID', as: 'Friend', onDelete: 'CASCADE' });
    }
  }
  USER_FRIEND.init({
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Friend_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
    
  }, {
    sequelize,
    modelName: 'USER_FRIEND',
    tableName: 'user_friend'
  });
  return USER_FRIEND;
};
