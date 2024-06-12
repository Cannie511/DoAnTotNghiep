'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HISTORY_MEETING extends Model {
    static associate(models) {
      // define association here
      HISTORY_MEETING.belongsTo(models.User, { foreignKey: 'User_ID' });
      HISTORY_MEETING.belongsTo(models.Rooms, { foreignKey: 'Room_ID' });
    }
  }
  HISTORY_MEETING.init({
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Room_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'HISTORY_MEETING',
  });
  return HISTORY_MEETING;
};
