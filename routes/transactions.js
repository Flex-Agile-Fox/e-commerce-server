const router = require('express').Router()
const TransactionController = require('../controllers/TransactionController')
const { customerAuthorization } = require('../middlewares/auth');


router.post('/:productId', TransactionController.add)
router.get('/', TransactionController.display)
router.get('/:id', TransactionController.detail)
router.put('/:id', customerAuthorization, TransactionController.update)
router.patch('/:id', customerAuthorization, TransactionController.updateQty)
router.delete('/:id', customerAuthorization, TransactionController.delete)

module.exports = router