const { Product, Cart } = require('../models');

class CartController {
	static addToCart(req, res, next) {
		const { qty, sumPrice } = req.body;
		const { userId } = req;
		const productId = req.params.id;
		let stock;

		Product.findOne({ where: { id: productId } })
			.then((product) => {
				stock = product.stock;
				if (!product) throw { name: 'product_not_found' };
				return Cart.findOne({ where: { userId, productId } });
			})
			.then((cart) => {
				if (cart) {
					if (qty + cart.qty > stock) {
						throw { name: 'exceed_stock' };
					}
					cart.qty += qty;
					cart.sumPrice = sumPrice;
					return cart.save();
				}
				if (qty > stock) {
					throw { name: 'exceed_stock' };
				}
				return Cart.create({ userId, productId, qty, sumPrice });
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
	static updateItemCart(req, res, next) {
		const { id } = req.params;
		const { userId } = req;
		const { qty, sumPrice } = req.body;
		let thisCart;

		Cart.findOne({ where: { id, userId } })
			.then((cart) => {
				if (!cart) throw { name: 'not_found' };

				thisCart = cart;
				return Product.findOne({ where: { id: cart.productId } });
			})
			.then((product) => {
				if (!product) throw { name: 'product_not_found' };

				if (product.stock < qty) throw { name: 'exceed_stock' };

				thisCart.qty = qty;
				thisCart.sumPrice = sumPrice;
				return thisCart.save();
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
				if (!cart) throw { name: 'not_found' };
				return cart.destroy();
			})
			.then(() => {
				res.status(200).json({ message: 'product has been removed from cart' });
			})
			.catch((err) => {
				next(err);
			});
	}
}

module.exports = CartController;
