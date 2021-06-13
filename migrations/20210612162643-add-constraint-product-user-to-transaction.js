'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Transactions', {
      fields: ['UserId'],
      type: 'foreign key',
      name: 'fk_transaction_UserId',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    queryInterface.addConstraint('Transactions', {
      fields: ['ProductId'],
      type: 'foreign key',
      name: 'fk_transaction_ProductId',
      references: {
        table: 'Products',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Transactions', 'fk_transaction_UserId');
    await queryInterface.removeConstraint('Transactions', 'fk_transaction_ProductId');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
