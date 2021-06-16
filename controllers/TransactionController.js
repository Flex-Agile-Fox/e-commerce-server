const { Transaction, Product } = require('../models');

class TransactionController {

  static add(req, res, next) {
    const newTransaction = {
      UserId: req.userId,
      ProductId: req.params.productId,
      status: req.body.status,
      quantity: req.body.quantity,
      total_price: req.body.total_price
    }
    Transaction.findOne({ where: { ProductId: req.params.productId } })
      .then((transaction) => {
        if (transaction) {
          transaction.quantity += 1
          transaction.total_price += newTransaction.total_price
          return transaction.save()
        } else return Transaction.create(newTransaction)
      })
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

  static updateQty(req, res, next) {
    const { quantity, total_price } = req.body
    const { transaction } = req

    transaction.quantity = quantity
    transaction.total_price = total_price

    transaction.save()
      .then((_) => {
        res.status(200).json({ data: transaction });
      })
      .catch((err) => next(err));
  }
}

module.exports = TransactionController