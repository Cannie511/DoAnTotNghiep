'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('IMAGE_VIDEO', {
      ID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      Path: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      Message_ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'MESSAGE',
          key: 'ID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('IMAGE_VIDEO');
  }
};
