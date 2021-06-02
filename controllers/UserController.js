const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

class UserController {

  static login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) throw { name: 'EMAIL_PASSWORD_EMPTY' };

    User.findOne({ where: { email } })
      .then((user) => {
        if(!user) throw { name: 'USER_NOT_FOUND' };
        if (user && bcrypt.compareSync(password, user.password)) {
          const access_token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
          res.status(200).json({ access_token });
        } else throw { name: 'LOGIN_FAILED' };
      })
      .catch((err) => next(err));
  }

}

module.exports = UserController