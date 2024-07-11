'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rooms extends Model {
    static associate(models) {
      // define association here
      Rooms.belongsTo(models.User, { foreignKey: 'Host_id', as: 'Host' });
      Rooms.belongsTo(models.User, { foreignKey: 'Create_by', as: 'Creator' });
      Rooms.hasMany(models.HISTORY_MEETING, { foreignKey: 'Room_ID' });
      Rooms.hasMany(models.USER_INVITATION, { foreignKey: 'Room_ID' });
      Rooms.hasMany(models.ROOM_MESSAGE, { foreignKey: 'Room_ID' });
      Rooms.hasMany(models.USER_JOININ, { foreignKey: 'Room_ID' });
      Rooms.hasMany(models.SCHEDULE, { foreignKey: 'Room_ID' });
    }
  }
  Rooms.init(
    {
      Room_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      User_amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      Host_id: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be NULL initially
      },
      Create_by: {
        type: DataTypes.INTEGER,
        allowNull: true, // Can be NULL initially
      },
      Time_start: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      Time_end: {
        type: DataTypes.DATE,
      },
      Password: {
        type: DataTypes.STRING(100),
      },
    },
    {
      sequelize,
      modelName: "Rooms",
    }
  );
  return Rooms;
};
