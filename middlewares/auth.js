const jwt = require("jsonwebtoken");
const { User, Product } = require("../models");

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

const authorization = (req, res, next) => {
	if (req.user_role !== "admin") {
		throw {
			name: "Unauthorized",
			message: "Not Authorized",
		};
	}
	const { id } = req.params;
	Product.findByPk(id)
		.then((data) => {
			req.product = data;
			next();
		})
		.catch((err) => next(err));
};

module.exports = { authentication, authorization };
