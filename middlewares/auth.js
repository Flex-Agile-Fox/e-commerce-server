const jwt = require('jsonwebtoken');
const { Product, User } = require('../models');

const authentication = (req, res, next) => {
  if (!req.headers.access_token) return next({ name: 'MISSING_ACCESS_TOKEN' });

  try {
    const decoded = jwt.verify(req.headers.access_token, process.env.JWT_SECRET);
    req.userId = decoded.id;
  } catch (err) {
    return next({ name: 'INVALID_ACCESS_TOKEN' });
  }

  User.findByPk(req.userId)
    .then((user) => {
      if (!user) throw { name: 'USER_NOT_FOUND' };
      next();
    })
    .catch((err) => next(err));
};

const authorization = (req, res, next) => {
  const { id } = req.params;

  Product.findOne({ where: { id: id, UserId: req.userId } })
    .then((product) => {
      if (!product) throw { name: 'PRODUCT_NOT_FOUND' };

      req.product = product;
      next();
    })
    .catch((err) => next(err));
};

module.exports = { authentication, authorization };