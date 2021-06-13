"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Cart extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			Cart.belongsTo(models.Product);
			Cart.belongsTo(models.User);
		}
	}
	Cart.init(
		{
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Quantity cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Quantity cannot be empty",
					},
					min: {
						args: 1,
						msg: "Quantity must be at least 1",
					},
					isNumeric: {
						args: true,
						msg: "Quantity must be a number",
					},
				},
			},

			UserId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "UserId cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "UserId cannot be empty",
					},
				},
			},
			ProductId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "ProductId cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "ProductId cannot be empty",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Cart",
		}
	);
	return Cart;
};
