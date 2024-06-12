'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      User_amount: {
        type: Sequelize.INTEGER
      },
      Host_id: {
        type: Sequelize.INTEGER
      },
      Create_by: {
        type: Sequelize.INTEGER
      },
      Time_start: {
        type: Sequelize.DATE
      },
      Time_end: {
        type: Sequelize.DATE
      },
      Password: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Rooms');
  }
};