'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Key extends Model {
    static associate(models) {
      // define association here if needed
    }
  }
  Key.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Key',
  });
  return Key;
};
