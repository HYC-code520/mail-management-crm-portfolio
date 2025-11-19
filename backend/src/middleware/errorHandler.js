const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error occurred:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Supabase-specific errors
  if (err.code) {
    return res.status(400).json({
      error: 'Database error',
      message: err.message || 'An error occurred with the database operation'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation error',
      message: err.message,
      details: err.details || undefined
    });
  }

  // Default error response
  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal server error' : 'Bad request',
    message: process.env.NODE_ENV === 'production' && statusCode >= 500 
      ? 'Something went wrong' 
      : message
  });
};

module.exports = errorHandler;

