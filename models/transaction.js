'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User)
      Transaction.belongsTo(models.Product)
    }
  };
  Transaction.init({
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'User Id must not be null'
        },
        isInt: {
          args: true,
          msg: 'User Id must be integer'
        }
      }
    },
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'id'
      },
      validate: {
        notNull: {
          args: true,
          msg: 'Product Id must not be null'
        },
        isInt: {
          args: true,
          msg: 'Product Id must be integer'
        }
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Status must not be empty'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Quantity must not be null'
        },
        isInt: {
          args: true,
          msg: 'Quantity must be integer'
        },
        min: {
          args: [0],
          msg: 'Quantity cannot be negative'
        }
      }
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: 'Total price must not be null'
        },
        isInt: {
          args: true,
          msg: 'Total price must be integer'
        },
        min: {
          args: [0],
          msg: 'Total price cannot be negative'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};