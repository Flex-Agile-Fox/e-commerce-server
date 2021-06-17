const router = require('express').Router()
const routesUser = require('./user')
const routesProduct = require('./product')
const routesCart = require('./cart')
const {authentication} = require('../middlewares/auth')

router.get('/', (req,res,next) =>{
    res.send('hello world')
})

router.use('/', routesUser)
router.use(authentication)
router.use('/product', routesProduct)
router.use('/cart', routesCart)

module.exports = router