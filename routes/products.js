const router = require('express').Router();
const ProductControllers = require('../controllers/ProductControllers');
const { productAuthorization } = require('../middlewares/auth');

router.post('/', ProductControllers.addProduct);
router.get('/', ProductControllers.getProducts);
router.get('/:id', productAuthorization, ProductControllers.detailProduct);
router.put('/:id', productAuthorization, ProductControllers.editProduct);
router.delete('/:id', productAuthorization, ProductControllers.deleteProduct);

module.exports = router;
