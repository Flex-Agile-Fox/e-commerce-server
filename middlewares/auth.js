const jwt = require("jsonwebtoken");
const { User, Product, Cart } = require("../models");

const authentication = (req, res, next) => {
	const { access_token } = req.headers;
	if (!access_token) {
		throw {
			name: "MissingToken",
			message: "Missing Token",
		};
	}
	try {
		const verify = jwt.verify(access_token, process.env.JWT_SECRET);
		req.user_id = verify.id;
		req.user_role = verify.role;
	} catch (error) {
		next({ name: "InvalidToken", message: "Invalid Token" });
	}
	User.findByPk(req.user_id)
		.then((user) => {
			if (!user)
				throw { name: "LoginFail", message: "Invalid User / Password" };
			next();
		})
		.catch((err) => next(err));
};

const authorizationRole = (req, res, next) => {
	if (req.user_role !== "admin") {
		throw {
			name: "Unauthorized",
			message: "Not Authorized",
		};
	}
	next();
};

const authorizationProduct = (req, res, next) => {
	const { id } = req.params;
	Product.findByPk(id)
		.then((data) => {
			if (!data) {
				throw { name: "ProductNotFound", message: "Product Not Found" };
			}
			req.product = data;
			next();
		})
		.catch((err) => {
			next(err);
		});
};

const authorizationCart = (req, res, next) => {
	const { id } = req.params;
	Cart.findByPk(id)
		.then((cart) => {
			if (!cart || cart.UserId !== req.user_id) {
				throw {
					name: "CartDoesNotExist",
					message: "Cart Does Not Exist",
				};
			}
			req.cart = cart;
			next();
		})
		.catch((err) => next(err));
};

module.exports = {
	authentication,
	authorizationRole,
	authorizationProduct,
	authorizationCart,
};
