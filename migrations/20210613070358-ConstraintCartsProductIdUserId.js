"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addConstraint("Carts", {
			fields: ["UserId"],
			type: "foreign key",
			name: "Carts_UserId_Users",
			references: {
				//Required field
				table: "Users",
				field: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		});
		await queryInterface.addConstraint("Carts", {
			fields: ["ProductId"],
			type: "foreign key",
			name: "Carts_UserId_Products",
			references: {
				//Required field
				table: "Products",
				field: "id",
			},
			onDelete: "cascade",
			onUpdate: "cascade",
		});
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeConstraint("Carts", "Carts_UserId_Users");
		await queryInterface.removeConstraint("Carts", "Carts_UserId_Products");
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
