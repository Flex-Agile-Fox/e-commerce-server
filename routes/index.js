const router = require('express').Router()
const routesUser = require('./user')
const routesProduct = require('./product')

router.get('/', (req,res,next) =>{
    res.send('hello world')
})

router.use('/', routesUser)
router.use('/product', routesProduct)

module.exports = router