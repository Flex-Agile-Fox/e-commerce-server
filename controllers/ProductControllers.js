class ProductController {
	static addProduct(req, res, next) {
		res.status(200).json('success add');
	}
	static getProducts(req, res, next) {
		res.status(200).json('get products');
	}
	static detailProduct(req, res, next) {
		res.status(200).json('get detail product');
	}
	static editProduct(req, res, next) {
		res.status(200).json('success edit');
	}
	static deleteProduct(req, res, next) {
		res.status(200).json('success delete');
	}
}

module.exports = ProductController;
