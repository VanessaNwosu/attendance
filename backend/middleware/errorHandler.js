const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${value}. Please use another value for ${field}`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError') {
    const message = 'Database connection error';
    error = new ErrorResponse(message, 500);
  }

  // Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    const message = 'File too large';
    error = new ErrorResponse(message, 400);
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    const message = 'Unexpected file field';
    error = new ErrorResponse(message, 400);
  }

  // Payment gateway errors
  if (err.code === 'PAYMENT_FAILED') {
    const message = err.message || 'Payment processing failed';
    error = new ErrorResponse(message, 402);
  }

  // Rate limiting errors
  if (err.statusCode === 429) {
    const message = 'Too many requests, please try again later';
    error = new ErrorResponse(message, 429);
  }

  // Operational errors vs programming errors
  const isOperational = error.statusCode && error.statusCode < 500;
  
  res.status(error.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        name: err.name,
        code: err.code
      }),
      ...(error.statusCode && { statusCode: error.statusCode }),
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  });

  // Log error for monitoring (in production, send to logging service)
  if (!isOperational || process.env.NODE_ENV === 'production') {
    console.error('Unhandled Error:', {
      message: error.message,
      stack: err.stack,
      url: req.url,
      method: req.method,
      user: req.user ? req.user._id : 'anonymous',
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = errorHandler;