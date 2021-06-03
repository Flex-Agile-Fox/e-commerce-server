"use strict";
const bcrypt = require("bcrypt");

module.exports = {
	up: async (queryInterface, Sequelize) => {
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync("123456", salt);
		queryInterface.bulkInsert("Users", [
			{
				name: "admin",
				email: "admin@admin.com",
				password: hash,
				role: "admin",
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
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
		queryInterface.bulkDelete("Users", null, {});
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
