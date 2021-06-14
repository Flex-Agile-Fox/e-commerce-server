const router = require('express').Router();
const productRouter = require('./products');
const userRouter = require('./users');
const cartRouter = require('./carts');
const { authentication } = require('../middlewares/auth');

router.use('/users', userRouter);
router.use('/products', productRouter);
router.use(authentication);
router.use('/carts', cartRouter);

module.exports = router;
