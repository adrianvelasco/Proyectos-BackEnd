'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clasification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Tools, {
        foreignKey: 'clasificationId'
      });
    }
  }
  Clasification.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Clasification',
    paranoid:true
  });
  return Clasification;
};