const router = require('express').Router();
const productRouter = require('./products');
const userRouter = require('./users');
const cartRouter = require('./carts');
const { authentication } = require('../middlewares/auth');

//for search endpoint
const { Product, sequelize } = require('../models');

//search endpoint start
router.get('/search', (req, res, next) => {
  let { name } = req.query;
  name = name.toLowerCase();

  Product.findAll({
    where: {
      name: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('name')),
        'LIKE',
        `%${name}%`
      ),
    },
  })
    .then((products) => {
      res.status(200).json({ data: products });
    })
    .catch((err) => {
      next(err);
    });
});
// search endpoint end

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use(authentication);
router.use('/carts', cartRouter);

module.exports = router;
