const { Product, Cart } = require('../models');

class CartController {
  static addToCart(req, res, next) {
    const { userId } = req;
    const { productId } = req.params;
    let stock;

    Product.findOne({ where: { id: productId } })
      .then((product) => {
        stock = product.stock;
        if (!product) throw { name: 'product_not_found' };
        return Cart.findOne({ where: { userId, productId } });
      })
      .then((cart) => {
        if (cart) {
          if (cart.qty < stock) {
            cart.qty += 1;
            return cart.save();
          }
          throw { name: 'exceed_stock' };
        }
        return Cart.create({ userId, productId, qty: 1 });
      })
      .then((cart) => {
        res.status(201).json({ data: cart });
      })
      .catch((err) => {
        next(err);
      });
  }
  static readItemCart(req, res, next) {
    const { userId } = req;
    Cart.findAll({ where: { userId }, include: Product })
      .then((items) => {
        res.status(200).json({ data: items });
      })
      .catch((err) => {
        next(err);
      });
  }
  static increment(req, res, next) {
    const { userId } = req;
    const { id } = req.params;
    let thisCart;

    Cart.findOne({ where: { id, userId } })
      .then((cart) => {
        if (cart) {
          thisCart = cart;
          return Product.findOne({ where: { id: cart.productId } });
        } else {
          throw { name: 'cart_not_found' };
        }
      })
      .then((product) => {
        if (product) {
          if (product.stock > thisCart.qty) {
            thisCart.qty++;
            return thisCart.save();
          } else {
            throw { name: 'exceed_stock' };
          }
        } else {
          throw { name: 'not_found' };
        }
      })
      .then((updatedCart) => {
        res.status(200).json({ data: updatedCart });
      })
      .catch((err) => {
        next(err);
      });
  }
  static decrement(req, res, next) {
    const { userId } = req;
    const { id } = req.params;

    Cart.findOne({ where: { id, userId } })
      .then((cart) => {
        if (cart) {
          if (cart.qty !== 1) {
            cart.qty--;
            return cart.save();
          }
          throw { name: 'exceed_min_qty' };
        }
        throw { name: 'cart_not_found' };
      })
      .then((updatedCart) => {
        res.status(200).json({ data: updatedCart });
      })
      .catch((err) => {
        next(err);
      });
  }
  static delItemCart(req, res, next) {
    const { id } = req.params;
    const { userId } = req;

    Cart.findOne({ where: { id, userId } })
      .then((cart) => {
        if (!cart) throw { name: 'cart_not_found' };
        return cart.destroy();
      })
      .then(() => {
        res
          .status(200)
          .json({ message: 'product has been removed from cart list' });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = CartController;
