class ProductController {
	static read(req, res, next) {
		res.status(200).json({});
	}
	static edit(req, res, next) {
		res.status(201).json({});
	}
}

module.exports = ProductController;
