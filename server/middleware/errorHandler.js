// Custom error with an HTTP status code that is safe to show to users.
class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
    this.expose = true;
  }
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found.' });
}

// Centralized error handler: technical details go to the server log only.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message, ...(err.details ? { errors: err.details } : {}) });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Request body is not valid JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'Request body is too large.' });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'Origin not allowed.' });
  }
  console.error('[server error]', err);
  res.status(500).json({ success: false, message: 'Something went wrong on our side. Please try again later.' });
}

module.exports = { ApiError, notFound, errorHandler };
