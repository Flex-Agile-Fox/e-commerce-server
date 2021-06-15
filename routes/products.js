const router = require('express').Router()
const ProductController = require('../controllers/ProductController')
const { authentication, adminAuthorization } = require('../middlewares/auth');

router.get('/display', ProductController.display)
router.use(authentication);
router.post('/', adminAuthorization, ProductController.add)
router.get('/', ProductController.display)
router.get('/:id', ProductController.detail)
router.put('/:id', adminAuthorization, ProductController.update)
router.delete('/:id', adminAuthorization, ProductController.delete)

module.exports = router