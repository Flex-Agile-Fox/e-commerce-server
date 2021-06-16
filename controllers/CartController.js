const { Cart, Product } = require("../models");

class CartController {
	static read(req, res, next) {
		Cart.findAll({ where: { UserId: req.user_id }, include: Product })
			.then((carts) => {
				res.status(200).json({ success: true, carts });
			})
			.catch((err) => next(err));
	}
	static add(req, res, next) {
		const { quantity, product_id } = req.body;
		let stock;
		Product.findByPk(product_id)
			.then((product) => {
				if (!product) {
					throw { name: "ProductNotFound", message: "Product Not Found" };
				}
				stock = product.stock;
				return Cart.findOne({
					where: {
						UserId: req.user_id,
						ProductId: product_id,
					},
				});
			})
			.then((cart) => {
				if (cart) {
					if (stock < +quantity + +cart.quantity) {
						throw {
							name: "QtyInsufficient",
							message: "Quantity Not Sufficient",
						};
					}
					cart.quantity += +quantity;
					return cart.save();
				}
				if (!cart) {
					return Cart.create({
						quantity,
						ProductId: product_id,
						UserId: req.user_id,
					});
				}
			})
			.then(() => {
				res
					.status(200)
					.json({ success: true, message: "Added Successfully to carts" });
			})
			.catch((err) => {
				next(err);
			});
	}
	static edit(req, res, next) {
		const { quantity } = req.body;
		let stock;
		let cart = req.cart;
		Product.findByPk(cart.ProductId)
			.then((product) => {
				if (!product) {
					throw { name: "ProductNotFound", message: "Product Not Found" };
				}
				stock = product.stock;
				if (stock < +quantity) {
					throw {
						name: "QtyInsufficient",
						message: "Quantity Not Sufficient",
					};
				}
				cart.quantity = +quantity;
				return cart.save();
			})
			.then(() => {
				res
					.status(200)
					.json({ success: true, message: "Carts Eddited Successfully" });
			})
			.catch((err) => {
				next(err);
			});
	}
	static delete(req, res, next) {
		let cart = req.cart;
		cart
			.destroy()
			.then((_) => {
				res
					.status(201)
					.json({ success: true, message: "Cart Successfully Deleted" });
			})
			.catch((err) => next(err));
	}
	static checkout(req, res, next) {
		Cart.findAll({ where: { UserId: req.user_id }, include: Product })
			.then((carts) => {
				let checkout = "Checkout Summary\n";
				let total = 0;
				carts.forEach(async (cart) => {
					const subTotalItem = cart.quantity * cart.Product.price;
					checkout += `${cart.name.toUpperCase()}: ${cart.quantity} x ${
						cart.Product.price
					} = ${subTotalItem} \n`;
					total += subTotalItem;
				});
				checkout += `Total checkout ${total}`;
				res.status(200).json({ success: true, checkout });
			})
			.catch((err) => next(err));
	}
}

module.exports = CartController;
