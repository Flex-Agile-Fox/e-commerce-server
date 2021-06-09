const { Product } = require("../models");
class ProductController {
	static read(req, res, next) {
		Product.findAll()
			.then((products) => {
				res.status(200).json({ success: true, products });
			})
			.catch((err) => next(err));
	}

	static readById(req, res, next) {
		const { id } = req.params;
		Product.findByPk(id)
			.then((product) => {
				res.status(200).json({ success: true, product });
			})
			.catch((err) => {
				throw { name: "ProductNotFound", message: "Product Not Found" };
			});
	}

	static add(req, res, next) {
		const { name, image_url, price, stock, category, description } = req.body;
		console.log(req.body);
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
