const ApiResponse = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return ApiResponse.error(res, message, statusCode, err.errors);
};

module.exports = errorHandler;