'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SCHEDULE extends Model {
    static associate(models) {
      // define association here
      SCHEDULE.belongsTo(models.User, { foreignKey: 'User_ID' });
      SCHEDULE.belongsTo(models.Rooms, { foreignKey: 'Room_ID' });
    }
  }
  SCHEDULE.init({
    ID: {
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
    },
    Time: {
      type: DataTypes.TIME,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'SCHEDULE',
  });
  return SCHEDULE;
};
