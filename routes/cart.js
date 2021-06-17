const router = require('express').Router()
const CartController = require('../controllers/CartController')
const {cartAuthorization} = require('../middlewares/auth')

router.get('/', CartController.listCart)
router.post('/', CartController.addCart)
router.put('/:id', cartAuthorization, CartController.editCart)
router.delete('/:id', cartAuthorization, CartController.deleteCart)

module.exports = router