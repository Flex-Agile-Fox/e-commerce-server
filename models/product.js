'use strict';
const {
  Model
} = require('sequelize');
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
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Nama tidak boleh kosong"
        }
      }
    },
    
    image_url: DataTypes.STRING,
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Price tidak boleh kosong"
        },
        min: {
          args: [0],
          msg : "Stock tidak boleh minus"
        },
        isNumeric: {
          args: true,
          msg: "Price harus di isi angka"
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Stock tidak boleh kosong"
        },
        min: {
          args: [0],
          msg : "Stock tidak boleh minus"
        },
        isNumeric: {
          args: true,
          msg: "Stock harus di isi angka"
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};