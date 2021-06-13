const router = require('express').Router()
const userRoutes = require('./users')
const productRoutes = require('./products')
const transactionRoutes = require('./transactions')
const { authentication } = require('../middlewares/auth');


router.use('/users', userRoutes)
router.use(authentication);
router.use('/products', productRoutes)
router.use('/transactions', transactionRoutes)


module.exports = router