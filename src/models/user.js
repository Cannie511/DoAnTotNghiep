'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.USER_FRIEND, { as: 'FriendsAsUser', foreignKey: "User_ID" });
      User.hasMany(models.USER_FRIEND, { as: 'FriendsAsFriend',foreignKey: "Friend_ID" });
      User.hasMany(models.MESSAGE, { foreignKey: "Send_by" });
      User.hasMany(models.MESSAGE, { foreignKey: "Received_by" });
      User.hasMany(models.Rooms, { foreignKey: "Host_id", as: "HostedRooms" });
      User.hasMany(models.Rooms, {
        foreignKey: "Create_by",
        as: "CreatedRooms",
      });
      User.hasMany(models.HISTORY_MEETING, { foreignKey: "User_ID" });
      User.hasMany(models.USER_INVITATION, { foreignKey: "User_ID" });
      User.hasMany(models.ROOM_MESSAGE, { foreignKey: "Send_by" });
      User.hasMany(models.INVITATION, { foreignKey: "Send_by" });
      User.hasMany(models.USER_JOININ, { foreignKey: "User_ID" });
      User.hasMany(models.SCHEDULE, { foreignKey: "User_ID" });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    display_name: DataTypes.STRING,
    language: DataTypes.INTEGER,
    premium: DataTypes.BOOLEAN,
    linked_account: DataTypes.STRING,
    avatar: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};