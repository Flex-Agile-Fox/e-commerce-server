const router = require('express').Router();
const ProductControllers = require('../controllers/ProductControllers');
const { authentication, productAuthorization } = require('../middlewares/auth');

router.post(
	'/',
	authentication,
	productAuthorization,
	ProductControllers.addProduct
);
router.get('/', ProductControllers.getProducts);
router.get('/:id', ProductControllers.detailProduct);
router.use(authentication);
router.put('/:id', productAuthorization, ProductControllers.editProduct);
router.delete('/:id', productAuthorization, ProductControllers.deleteProduct);

module.exports = router;
