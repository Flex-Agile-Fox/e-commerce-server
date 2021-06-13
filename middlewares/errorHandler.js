const errorHandler = (err, req, res, next) => {
	let code;
	let errors = [];
	// console.log(err);
	switch (err.name) {
		case "SequelizeValidationError":
			code = 400;
			err.errors.forEach((el) => {
				errors.push(el.message);
			});
			break;
		case "SequelizeUniqueConstraintError":
			code = 400;
			errors.push("User Exists");
			break;
		case "InvalidEmailAndPassword":
			code = 400;
			errors.push(err.message);
			break;
		case "MissingToken":
			code = 400;
			errors.push(err.message);
			break;
		case "InvalidToken":
			code = 400;
			errors.push(err.message);
			break;
		case "LoginFail":
			code = 400;
			errors.push(err.message);
			break;
		case "Unauthorized":
			code = 401;
			errors.push(err.message);
			break;
		case "ProductNotFound":
			code = 404;
			errors.push(err.message);
			break;
		case "QtyInsufficient":
			code = 400;
			errors.push(err.message);
			break;
		case "CartDoesNotExist":
			code = 400;
			errors.push(err.message);
			break;
		default:
			code = 500;
			errors.push("Internal server error");
			console.log(err);
	}
	res.status(code).json({ success: false, errors });
};

module.exports = errorHandler;
