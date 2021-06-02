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
		res.status(201).json({});
	}

	static delete(req, res, next) {
		res.status(201).json({});
	}
}

module.exports = ProductController;
