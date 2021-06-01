const router = require('express').Router();
const productRouter = require('./products');
const userRouter = require('./users');

router.use('/users', userRouter);
router.use('/products', productRouter);

module.exports = router;
