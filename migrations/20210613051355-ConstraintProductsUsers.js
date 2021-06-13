"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addConstraint("Products", {
			fields: ["UserId"],
			type: "foreign key",
			name: "Products_UserId_Users",
			references: {
				//Required field
				table: "Users",
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
		await queryInterface.removeConstraint("Products", "Products_UserId_Users");
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
