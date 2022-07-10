'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ToolPack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ToolPackDetails, {
        foreignKey: 'toolPackId'
      })
    }
  }
  ToolPack.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ToolPack',
    paranoid: true
  });
  return ToolPack;
};