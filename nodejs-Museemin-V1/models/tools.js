'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tools extends Model {
    static associate(models) {
      // define association here
      this.belongsTo(models.Clasification, {
        foreignKey: 'clasificationId'
      });
      this.hasMany(models.ToolPackDetails, {
        foreignKey: 'toolId'
      });
    }
  }
  Tools.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    tradeMark: DataTypes.STRING,
    estatus: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tools',
    paranoid: true
  });
  return Tools;
};