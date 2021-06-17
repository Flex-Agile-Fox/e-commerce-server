const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const {productAuthorization} = require('../middlewares/auth')

router.post('/', productAuthorization, ProductController.postProduct)
router.get('/', ProductController.getProduct)
router.get('/:id',  productAuthorization, ProductController.getProductDetail)
router.put('/:id', productAuthorization, ProductController.putProduct)
router.delete('/:id', productAuthorization, ProductController.deleteProduct)


module.exports = router