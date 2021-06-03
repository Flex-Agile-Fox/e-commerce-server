'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	User.init(
		{
			name: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						args: true,
						msg: 'please input your name',
					},
					len: {
						args: [3],
						msg: 'name at least must be 3 characters',
					},
				},
			},
			email: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						args: true,
						msg: 'please input your mail address',
					},
					isEmail: {
						args: true,
						msg: 'please input valid mail address',
					},
				},
			},
			password: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						args: true,
						msg: 'please input your password',
					},
					len: {
						args: [6],
						msg: 'password at least must be 6 characters',
					},
				},
			},
			role: {
				type: DataTypes.STRING,
				validate: {
					notEmpty: {
						args: true,
						msg: 'role must not be empty',
					},
				},
			},
		},
		{
			sequelize,
			hooks: {
				beforeCreate(user) {
					const salt = bcrypt.genSaltSync(8);
					user.password = bcrypt.hashSync(user.password, salt);
				},
			},
			modelName: 'User',
		}
	);
	return User;
};
