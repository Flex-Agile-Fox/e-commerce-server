const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class UserController {
  static register(req, res, next) {
    const { name, email, password } = req.body;

    User.create({ name, email, password, role: 'customer' })
      .then((user) => {
        const access_token = jwt.sign(
          { id: user.id, role: user.role },
          JWT_SECRET
        );
        res.status(201).json({ access_token, user });
      })
      .catch((err) => {
        next(err);
      });
  }

  static login(req, res, next) {
    const { email, password } = req.body;

    User.findOne({ where: { email } })
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const access_token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET
          );
          return res.status(200).json({ access_token, user });
        }
        throw { name: 'LOGIN_FAIL' };
      })
      .catch((err) => {
        next(err);
      });
  }

  static loginGoogle(req, res, next) {
    const { idToken } = req.body;
    if (!idToken) return next('missing_access_token');

    let email;
    let statusCode = 200;
    client
      .verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID })
      .then((ticket) => {
        name = ticket.getPayload().given_name;
        email = ticket.getPayload().email;
        return User.findOne({ where: { email } });
      })
      .then((user) => {
        const role = customer;

        if (user) return user;
        statusCode = 201;
        return User.create({
          name,
          email,
          password: process.env.GOOGLE_DEFAULT_PASSWORD,
          role,
        });
      })
      .then((user) => {
        const access_token = jwt.sign({ id: user.id }, JWT_SECRET);
        res.status(statusCode).json({ access_token, user_id: user.id });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
