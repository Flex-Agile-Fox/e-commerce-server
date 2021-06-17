const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { OAuth2Client } = require('google-auth-library');

class UserController {

  static register(req, res, next) {
    const { email, password } = req.body;
    User.create({ email, password })
      .then(() => {
        res.status(201).json({ message: 'User registered successfully' });
      })
      .catch((err) => next(err));
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) throw { name: 'EMAIL_PASSWORD_EMPTY' };

    User.findOne({ where: { email } })
      .then((user) => {
        if(!user) throw { name: 'USER_NOT_FOUND' };
        if (user && bcrypt.compareSync(password, user.password)) {
          const access_token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
          res.status(200).json({ access_token });
        } else throw { name: 'LOGIN_FAILED' };
      })
      .catch((err) => next(err));
  }

  static google(req, res, next) {
    const client = new OAuth2Client(process.env.CLIENT_ID);
    const { idToken } = req.body;
    if (!idToken) return next('MISSING_ACCESS_TOKEN');

    let email;
    let statusCode = 200;
    client
      .verifyIdToken({ idToken, audience: process.env.CLIENT_ID })
      .then((ticket) => {
        email = ticket.getPayload().email;
        return User.findOne({ where: { email } });
      })
      .then((user) => {
        if (user) return user;
        statusCode = 201;
        return User.create({
          email,
          password: process.env.DEFAULT_PASSWORD,
          role: 'customer'
        });
      })
      .then((user) => {
        const access_token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
        res.status(statusCode).json({ access_token });
      })
      .catch((err) => next(err));
  }

}

module.exports = UserController