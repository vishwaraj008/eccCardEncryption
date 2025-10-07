// src/middlewares/errorMiddleware.js
/**
 * Centralized Error Handler Middleware
 * ------------------------------------
 * - Catches all thrown or unhandled errors
 * - Hides internal details in production
 * - Always returns JSON format
 */

module.exports = (err, req, res, next) => {
  console.error('🔥 Error caught by middleware:', err.message);

  // Optional detailed stack (only for non-production)
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  // Send consistent JSON response
  res.status(statusCode).json({
    status: 'error',
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : err.message || 'Unknown error occurred',
  });
};
