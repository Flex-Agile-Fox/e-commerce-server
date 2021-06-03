const router = require('express').Router()
const ProductController = require('../controllers/ProductController')

router.post('/', ProductController.postProduct)
router.get('/', ProductController.getProduct)
// router.get('/:id', ProductController.getDetailProduct)
router.put('/:id', ProductController.putProduct)
router.delete('/:id', ProductController.deleteProduct)


module.exports = router