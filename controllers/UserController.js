const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class UserController {

      static login(req, res, next) {
        res.status(200).json({});
      }

}

module.exports = UserController