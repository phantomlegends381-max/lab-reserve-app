function notFoundHandler(req, res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    console.error(error);
  }

  res.status(statusCode).json({
    status: statusCode,
    error: isProduction && statusCode >= 500 ? 'Internal server error' : error.message,
    timestamp: new Date().toISOString(),
  });
}

module.exports = {
  errorHandler,
  notFoundHandler,
};
