const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const { authorization } = require('../middlewares/auth');


router.post('/', ProductController.add)
router.get('/', ProductController.display)
router.get('/:id', ProductController.detail)
router.put('/:id', authorization, ProductController.update)
router.delete('/:id', authorization, ProductController.delete)

module.exports = router