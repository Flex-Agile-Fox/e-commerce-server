const router = require('express').Router();
const CartControllers = require('../controllers/CartControllers');

router.post('/:id', CartControllers.addToCart);
router.get('/', CartControllers.readItemCart);
router.put('/:id', CartControllers.updateItemCart);
router.delete('/:id', CartControllers.delItemCart);

module.exports = router;
