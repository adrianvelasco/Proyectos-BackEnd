'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ToolPackDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.ToolPack, {
        foreignKey: 'toolPackId'
      });
      this.belongsTo(models.Tools, {
        foreignKey: 'toolId'
      })
    }
  }
  ToolPackDetails.init({
    commentary: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ToolPackDetails',
    paranoid: true
  });
  return ToolPackDetails;
};