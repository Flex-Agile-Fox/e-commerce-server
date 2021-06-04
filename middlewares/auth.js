const jwt = require('jsonwebtoken');
const { User, Product } = require('../models');
const { JWT_SECRET } = process.env;

const authentication = (req, res, next) => {
	const { access_token } = req.headers;
	if (!access_token) return next({ name: 'missing_access_token' });
	try {
		const decoded = jwt.verify(access_token, JWT_SECRET);
		req.userId = decoded.id;
		req.userRole = decoded.role;
	} catch (err) {
		return next({ name: 'invalid_access_token' });
	}

	User.findByPk(req.userId)
		.then((user) => {
			if (!user) throw { name: 'LOGIN_FAIL' };
			next();
		})
		.catch((err) => {
			next(err);
		});
};

const productAuthorization = (req, res, next) => {
	if (req.userRole !== 'admin') throw { name: 'not_authorized' };

	const { id } = req.params;
	if (id) {
		Product.findOne({ where: { id } })
			.then((product) => {
				if (!product) throw { name: 'product_not_found' };
				req.product = product;
				next();
			})
			.catch((err) => next(err));
	} else {
		next();
	}
};

module.exports = { authentication, productAuthorization };
