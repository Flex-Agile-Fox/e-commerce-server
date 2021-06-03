const errorHandlers = (err, req, res, next) => {
	let statusCode;
	let message = [];

	switch (err.name) {
		case 'SequelizeUniqueConstraintError':
			statusCode = 409;
			message.push('email has been used');
			break;
		case 'LOGIN_FAIL':
			statusCode = 400;
			message.push('wrong email or password');
			break;
		case 'SequelizeValidationError':
			statusCode = 400;
			message = err.errors ? err.errors.map((el) => el.message) : [];
			break;
		case 'missing_access_token':
			statusCode = 401;
			message.push('missing access token');
			break;
		case 'product_not_found':
			statusCode = 400;
			message.push('product not found');
			break;
		case 'invalid_access_token':
			statusCode = 400;
			message.push('invalid access token');
			break;
		case 'not_authorized':
			statusCode = 400;
			message.push('only admin that authorized');
		default:
			statusCode = 500;
			message.push('internal server error');
	}
	res.status(statusCode).json({ message });
};

module.exports = errorHandlers;
