'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class INVITATION extends Model {
    static associate(models) {
      // define association here
      INVITATION.belongsTo(models.User, { foreignKey: 'Send_by' });
      INVITATION.hasMany(models.USER_INVITATION, { foreignKey: 'Invitation_ID' });
    }
  }
  INVITATION.init({
    Send_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Message_invite: {
      type: DataTypes.STRING(500),
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'INVITATION',
  });
  return INVITATION;
};
