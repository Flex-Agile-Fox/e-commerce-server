"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Product extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
		}
	}
	Product.init(
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
			image_url: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Image cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Image cannot be empty",
					},
				},
			},
			price: {
				type: DataTypes.DOUBLE,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Price cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Price cannot be empty",
					},
					min: {
						args: 1,
						msg: "Price must be at least 1",
					},
				},
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Stock cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Stock cannot be empty",
					},
					min: {
						args: 1,
						msg: "Stock must be at least 1",
					},
				},
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Category cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Category cannot be empty",
					},
				},
			},
			description: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: "Category cannot be null",
					},
					notEmpty: {
						args: true,
						msg: "Category cannot be empty",
					},
				},
			},
		},
		{
			sequelize,
			modelName: "Product",
		}
	);
	return Product;
};
