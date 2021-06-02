const { Product } = require("../models");
class ProductController {
	static read(req, res, next) {
		res.status(200).json({});
	}

	static readById(req, res, next) {
		res.status(200).json({});
	}

	static add(req, res, next) {
		const { name, image_url, price, stock, category, description } = req.body;
		Product.create({ name, image_url, price, stock, category, description })
			.then((product) => {
				res.status(201).json({ success: true, data: product });
			})
			.catch((err) => next(err));
	}

	static edit(req, res, next) {
		const { id } = req.params;
		const { name, image_url, price, stock, category, description } = req.body;
		let product = req.product;
		product.name = name;
		product.image_url = image_url;
		product.price = price;
		product.stock = stock;
		product.category = category;
		product.description = description;
		product
			.save()
			.then((_) => {
				res
					.status(201)
					.json({ success: true, message: "Product Successfully Editted" });
			})
			.catch((err) => next(err));
	}

	static delete(req, res, next) {
		let product = req.product;
		product
			.destroy()
			.then((_) => {
				res
					.status(201)
					.json({ success: true, message: "Product Successfully Deleted" });
			})
			.catch((err) => next(err));
	}
}

module.exports = ProductController;
