'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class USER_INVITATION extends Model {
    static associate(models) {
      // define association here
      USER_INVITATION.belongsTo(models.User, { foreignKey: 'User_ID' });
      USER_INVITATION.belongsTo(models.Rooms, { foreignKey: 'Room_ID' });
      USER_INVITATION.belongsTo(models.INVITATION, { foreignKey: 'Invitation_ID' });
    }
  }
  USER_INVITATION.init({
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Room_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Invitation_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'USER_INVITATION',
  });
  return USER_INVITATION;
};
