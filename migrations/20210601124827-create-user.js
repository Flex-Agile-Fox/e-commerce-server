'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				notEmpty: true,
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				notEmpty: true,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				notEmpty: true,
			},
			role: {
				type: Sequelize.STRING,
				allowNull: false,
				notEmpty: true,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Users');
	},
};
