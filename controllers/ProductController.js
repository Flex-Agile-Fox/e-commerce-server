const { Product, User } = require('../models');

class ProductController {

  static add(req, res, next) {
    const product = {
      name: req.body.name,
      image_url: req.body.image_url,
      price: req.body.price,
      stock: req.body.stock,
      UserId: req.userId
    }
    Product.create(product)
      .then(product => {
        res.status(201).json({ data: product })
      })
      .catch((err) => next(err));
  }

  static display(req, res, next) {
    Product.findAll({
      order: [['due_date', 'ASC']],
      include: [User]
    })
      .then(products => {
        res.status(200).json({ data: products })
      })
      .catch((err) => next(err));
  }

  static detail(req, res) {
    // res.status(200).json({ data: req.product });
    const { id } = req.params;

    Product.findOne({ where: { id: id } })
    .then((product) => {
      if (!product) throw { name: 'TASK_NOT_FOUND' };
      res.status(200).json({ data: product })
      // req.product = product;
      // next();
    })
    .catch((err) => next(err));
  }

  static update(req, res, next) {
    const { name, image_url, price, stock } = req.body
    const { product } = req

    product.name = name
    product.image_url = image_url
    product.price = price
    product.stock = stock

    product.save()
      .then((_) => {
        res.status(200).json({ data: product });
      })
      .catch((err) => next(err));
  }

  static delete(req, res, next) {
    const { product } = req

    product.destroy()
      .then((_) => {
        res.status(200).json({ message: 'Product success to delete' });
      })
      .catch((err) => next(err));
  }
}

module.exports = ProductController