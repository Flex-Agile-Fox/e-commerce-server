const router = require('express').Router();
const productRouter = require('./products');
const userRouter = require('./users');
const { authentication } = require('../middlewares/auth');

router.use('/users', userRouter);
router.use(authentication);
router.use('/products', productRouter);

module.exports = router;
