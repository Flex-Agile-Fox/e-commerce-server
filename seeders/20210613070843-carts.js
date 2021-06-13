"use strict";
let carts = require("../db.json").carts;

module.exports = {
	up: async (queryInterface, Sequelize) => {
		carts = carts.map((cart) => {
			return {
				...cart,
				UserId: 2,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		});
		await queryInterface.bulkInsert("Carts", carts);
		await queryInterface.sequelize.query(
			`SELECT setval('"Carts_id_seq"', (SELECT MAX(id) FROM "Carts"));`
		);
		/**
		 * Add seed commands here.
		 *
		 * Example:
		 * await queryInterface.bulkInsert('People', [{
		 *   name: 'John Doe',
		 *   isBetaMember: false
		 * }], {});
		 */
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete("Carts", null, {});
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
