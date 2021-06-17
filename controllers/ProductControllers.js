const { Product } = require('../models');

class ProductController {
  static addProduct(req, res, next) {
    const { name, image_url, price, stock, category } = req.body;

    Product.create({ name, image_url, price, stock, category })
      .then((product) => {
        res.status(201).json({ data: product });
      })
      .catch((err) => {
        next(err);
      });
  }
  static getProducts(req, res, next) {
    Product.findAll()
      .then((products) => {
        res.status(200).json({ data: products });
      })
      .catch((err) => {
        next(err);
      });
  }
  static detailProduct(req, res, next) {
    const { id } = req.params;

    Product.findOne({ where: { id } })
      .then((product) => {
        if (!product) throw { name: 'product_not_found' };
        res.status(200).json({ data: product });
      })
      .catch((err) => {
        next(err);
      });
  }
  static editProduct(req, res, next) {
    const { product } = req;
    const { name, image_url, price, stock, category } = req.body;

    product.name = name;
    product.image_url = image_url;
    product.price = price;
    product.stock = stock;
    product.category = category;
    product
      .save()
      .then((updatedProduct) => {
        res.status(200).json({ data: updatedProduct });
      })
      .catch((err) => {
        next(err);
      });
  }
  static deleteProduct(req, res, next) {
    const { product } = req;
    product
      .destroy()
      .then(() => {
        res.status(200).json({ message: 'product has been deleted' });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = ProductController;
