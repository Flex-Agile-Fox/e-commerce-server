"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			User.hasMany(models.Product);
			User.hasMany(models.Cart);
		}
	}
	User.init(
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Name cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Name cannot be empty",
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Email cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Email cannot be empty",
					},
					isEmail: {
						args: true,
						msg: "Email must have a valid email format",
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Password cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Password cannot be empty",
					},
					len: {
						args: [6, 32],
						msg: "Password must be at least 6 characters long and maximum 32 characters long",
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Role cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Role cannot be empty",
					},
				},
			},
		},
		{
			hooks: {
				beforeCreate(user) {
					const salt = bcrypt.genSaltSync(10);
					const hash = bcrypt.hashSync(user.password, salt);
					user.password = hash;
					return user;
				},
			},
			sequelize,
			modelName: "User",
		}
	);
	return User;
};
