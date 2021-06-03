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
      Product.belongsTo(models.User)
    }
  };
  Product.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Name must not be empty'
        }
      }
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Image url must not be empty'
        },
        isUrl: {
          args: true,
          msg: 'Invalid url'
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Price must not be null'
        },
        isInt: {
          args: true,
          msg: 'Price must be integer'
        },
        min: {
          args: [0],
          msg: 'Price cannot be negative'
        }
      }
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Stock must not be null'
        },
        isInt: {
          args: true,
          msg: 'Stock must be integer'
        },
        min: {
          args: [0],
          msg: 'Stock cannot be negative'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        notEmpty: {
          args: true,
          msg: 'User Id must not be empty'
        },
        isInt: {
          args: true,
          msg: 'User Id must be integer'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};