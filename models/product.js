'use strict';
const { Model } = require('sequelize');
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
						msg: 'product name cannot be null',
					},
					notEmpty: {
						args: true,
						msg: 'product name cannot be empty string',
					},
				},
			},
			image_url: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: 'product image url must not be null',
					},
					notEmpty: {
						args: true,
						msg: 'product image url must not be empty string',
					},
				},
			},
			price: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: 'price must not be null',
					},
					isNumeric: {
						args: true,
						msg: 'please input only numeric in price field',
					},
					isInt: {
						args: true,
						msg: 'please input only numeric in price field',
					},
					min: {
						args: 1,
						msg: 'price at least must be 1',
					},
				},
			},
			stock: {
				type: DataTypes.INTEGER,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: 'stock must not be null',
					},
					isNumeric: {
						args: true,
						msg: 'please input only numeric in stock field',
					},
					isInt: {
						args: true,
						msg: 'please input only numeric in stock field',
					},
					min: {
						args: 1,
						msg: 'stock at least must be 1',
					},
				},
			},
			category: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					notNull: {
						args: true,
						msg: 'product category must not null',
					},
					notEmpty: {
						args: true,
						msg: 'product category must not be empty string',
					},
				},
			},
		},
		{
			timestamps: false,
			sequelize,
			modelName: 'Product',
		}
	);
	return Product;
};
