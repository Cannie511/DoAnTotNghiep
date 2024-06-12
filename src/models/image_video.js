'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class IMAGE_VIDEO extends Model {
    static associate(models) {
      // define association here
      IMAGE_VIDEO.belongsTo(models.MESSAGE, { foreignKey: 'Message_ID' });
    }
  }
  IMAGE_VIDEO.init({
    Path: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    Message_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'IMAGE_VIDEO',
  });
  return IMAGE_VIDEO;
};
