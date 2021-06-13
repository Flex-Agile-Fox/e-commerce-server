const bcrypt = require('bcrypt');

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product)
      User.hasMany(models.Transaction)
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Email must not be empty'
        },
        isEmail: {
          args: true,
          msg: 'Invalid email address'
        }
      },
      unique: {
          args: true,
          msg: 'Email address already in use'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Password must not be empty'
        },
        len: {
          args: 6,
          msg: "Password must be at least 6 characters"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Role must not be empty'
        }
      }
    }
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync(8);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        if (!user.role) user.role = 'customer'
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};