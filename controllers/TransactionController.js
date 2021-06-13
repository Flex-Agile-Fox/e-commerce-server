const { Transaction, Product } = require('../models');

class TransactionController {

  static add(req, res, next) {
    const transaction = {
      UserId: req.userId,
      ProductId: req.body.productId,
      status: req.body.status,
      quantity: req.body.quantity,
      total_price: req.body.total_price
    }
    Transaction.create(transaction)
      .then(transaction => {
        res.status(201).json({ data: transaction })
      })
      .catch((err) => next(err));
  }

  static display(req, res, next) {
    Transaction.findAll({
      include: [Product]
    })
      .then(transactions => {
        res.status(200).json({ data: transactions })
      })
      .catch((err) => next(err));
  }

  static detail(req, res) {
    const { id } = req.params;

    Transaction.findOne({ where: { id: id } })
      .then((transaction) => {
        if (!transaction) throw { name: 'TRANSACTION_NOT_FOUND' };
        res.status(200).json({ data: transaction })
      })
      .catch((err) => next(err));
  }

  static update(req, res, next) {
    const { status, quantity, total_price } = req.body
    const { transaction } = req

    transaction.status = status
    transaction.quantity = quantity
    transaction.total_price = total_price

    transaction.save()
      .then((_) => {
        res.status(200).json({ data: transaction });
      })
      .catch((err) => next(err));
  }

  static delete(req, res, next) {
    const { transaction } = req

    transaction.destroy()
      .then((_) => {
        res.status(200).json({ message: 'Cart success to delete' });
      })
      .catch((err) => next(err));
  }
}

module.exports = TransactionController