'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      // define association here
      File.belongsTo(models.MESSAGE, { foreignKey: 'Message_ID' });
    }
  }
  File.init({
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
    modelName: 'File',
  });
  return File;
};
