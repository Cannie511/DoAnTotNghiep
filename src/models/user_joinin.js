'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USER_JOININ extends Model {
    static associate(models) {
      // define association here
      USER_JOININ.belongsTo(models.User, { foreignKey: 'User_ID' });
      USER_JOININ.belongsTo(models.Rooms, { foreignKey: 'Room_ID' });
    }
  }
  USER_JOININ.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Room_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'USER_JOININ',
  });
  return USER_JOININ;
};
