'use strict';

const { hashPassword } = require('../Utils/HashPassword');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for(let i = 0; i<20; i++){
      await queryInterface.bulkInsert("Users", [
        {
          email: `user${i}@gmail.com`,
          password: hashPassword('abc123456'),
          display_name: `account_demo${i}`,
          language: 1,
          premium: false,
          linked_account: 'verify',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    }
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
