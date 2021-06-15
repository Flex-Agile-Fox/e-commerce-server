const router = require('express').Router();
const CartControllers = require('../controllers/CartControllers');

router.post('/:id', CartControllers.addToCart);
router.get('/', CartControllers.readItemCart);
router.put('/increase/:id', CartControllers.increment);
router.put('/decrease/:id', CartControllers.decrement);
router.delete('/:id', CartControllers.delItemCart);

module.exports = router;
