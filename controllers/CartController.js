const { Cart, Product } = require("../models");
const printToPdf = require("../helpers/jspdf");

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
				if (stock < Number(quantity)) {
					throw {
						name: "QtyInsufficient",
						message: "Quantity Not Sufficient",
					};
				}
				return Cart.findOne({
					where: {
						UserId: req.user_id,
						ProductId: product_id,
					},
				});
			})
			.then((cart) => {
				if (cart) {
					if (stock < Number(quantity) + Number(cart.quantity)) {
						throw {
							name: "QtyInsufficient",
							message: "Quantity Not Sufficient",
						};
					}
					cart.quantity += Number(quantity);
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
				if (!carts.length) {
					throw {
						name: "NoItemInCarts",
						message: "No Item In Carts",
					};
				}
				carts.forEach(async (cart) => {
					let product = await Product.findByPk(cart.ProductId);
					product.stock -= cart.quantity;
					await product.save();
					await cart.destroy();
				});
				// res
				// .status(200)
				// .json({ success: true, message: "Checkout Successfull" })
				res.contentType("application/pdf");
				res.send(printToPdf(carts));
			})
			.catch((err) => next(err));
	}
}

module.exports = CartController;
