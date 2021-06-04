const router = require('express').Router();
const ProductControllers = require('../controllers/ProductControllers');
const { productAuthorization } = require('../middlewares/auth');

router.post('/', productAuthorization, ProductControllers.addProduct);
router.get('/', ProductControllers.getProducts);
router.get('/:id', ProductControllers.detailProduct);
router.put('/:id', productAuthorization, ProductControllers.editProduct);
router.delete('/:id', productAuthorization, ProductControllers.deleteProduct);

module.exports = router;
