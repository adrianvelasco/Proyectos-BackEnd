'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ToolPackDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      commentary: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      toolId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          isInt: true
        },
        references: {
          model: 'Tools',
          key: 'id',
          as: 'toolId'
        }
      },
      toolPackId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          isInt: true
        },
        references: {
          model: 'ToolPacks',
          key: 'id',
          as: 'toolPackId'
        }
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ToolPackDetails');
  }
};