const router = require('express').Router();
const ProductControllers = require('../controllers/ProductControllers');

router.post('/', ProductControllers.addProduct);
router.get('/', ProductControllers.getProducts);
router.get('/:id', ProductControllers.detailProduct);
router.put('/:id', ProductControllers.editProduct);
router.delete('/:id', ProductControllers.deleteProduct);

module.exports = router;
