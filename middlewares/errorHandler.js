const errorHandler = (err, req, res, next) => {
	let code;
	let errors = [];

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
		default:
			code = 500;
			errors.push("Internal server error");
			console.log(err);
	}
	res.status(code).json({ success: false, errors });
};

module.exports = errorHandler;
