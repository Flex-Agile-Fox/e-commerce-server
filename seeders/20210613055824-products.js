"use strict";
let products = require("../db.json").products;

module.exports = {
	up: async (queryInterface, Sequelize) => {
		products = products.map((product) => {
			return {
				...product,
				UserId: 1,
				createdAt: new Date(),
				updatedAt: new Date(),
			};
		});
		await queryInterface.bulkInsert("Products", products);
		await queryInterface.sequelize.query(
			`SELECT setval('"Products_id_seq"', (SELECT MAX(id) FROM "Products"));`
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
		await queryInterface.bulkDelete("Products", null, {});
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
