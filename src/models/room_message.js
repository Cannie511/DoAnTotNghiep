'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ROOM_MESSAGE extends Model {
    static associate(models) {
      // define association here
      ROOM_MESSAGE.belongsTo(models.Rooms, { foreignKey: 'Room_ID' });
      ROOM_MESSAGE.belongsTo(models.User, { foreignKey: 'Send_by' });
    }
  }
  ROOM_MESSAGE.init({
    Room_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Send_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Message: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'ROOM_MESSAGE',
  });
  return ROOM_MESSAGE;
};
