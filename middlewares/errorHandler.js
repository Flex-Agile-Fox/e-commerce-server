const errorHandler = (err, req, res, next) => {
  let errorCode;
  let errorMessages = [];

  switch (err.name) {
    case 'MISSING_ACCESS_TOKEN':
      errorCode = 401;
      errorMessages.push('Missing access token');
      break;
    case 'INVALID_ACCESS_TOKEN':
      errorCode = 401;
      errorMessages.push('Invalid access token');
      break;
    case 'USER_NOT_FOUND':
      errorCode = 404;
      errorMessages.push('User not found');
      break;
    case 'USER_NOT_AUTHORIZED':
      errorCode = 401;
      errorMessages.push('Only admin can add, update and delete product');
      break;
    case 'EMAIL_PASSWORD_EMPTY':
      errorCode = 404;
      errorMessages.push('Email or Password cannot be empty');
      break;
    case 'PRODUCT_NOT_FOUND':
      errorCode = 404;
      errorMessages.push('Product not found');
      break;
    case 'TRANSACTION_NOT_FOUND':
      errorCode = 404;
      errorMessages.push('Transaction not found');
      break;
    case 'STOCK_NOT_ENOUGH':
      errorCode = 401;
      errorMessages.push('Stock not enough');
      break;
    case 'LOGIN_FAILED':
      errorCode = 401;
      errorMessages.push('Wrong email or password');
      break;
    case 'SequelizeValidationError':
      errorCode = 400;
      errorMessages = err.errors ? err.errors.map((el) => el.message) : [];
      break;
    case 'SequelizeUniqueConstraintError':
      errorCode = 409;
      errorMessages = err.errors ? err.errors.map((el) => el.message) : [];
      break;
    default:
      errorCode = 500;
      errorMessages.push('Internal server error');
  }

  res.status(errorCode).json({ errorMessages });
};

module.exports = errorHandler;