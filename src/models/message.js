'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MESSAGE extends Model {
    static associate(models) {
      // define association here
      MESSAGE.belongsTo(models.User, { foreignKey: 'Send_by', as: 'Sender' });
      MESSAGE.belongsTo(models.User, { foreignKey: 'Received_by', as: 'Receiver' });
      MESSAGE.hasMany(models.File, { foreignKey: 'Message_ID' });
      MESSAGE.hasMany(models.IMAGE_VIDEO, { foreignKey: 'Message_ID' });
    }
  }
  MESSAGE.init({
    Message: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    Send_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    Received_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'MESSAGE',
  });
  return MESSAGE;
};
