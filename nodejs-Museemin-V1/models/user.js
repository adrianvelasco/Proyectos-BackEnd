'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });

  User.prototype.validPassword = (password, hash) => {
    return bcrypt.compare(password, hash);
  };
  User.addHook("beforeValidate", async (user) => {
    if(user.password){
      const salt = await bcrypt.genSalt(10);
      user.password =  await bcrypt.hash(user.password, salt);
    }
  });
  return User;
};