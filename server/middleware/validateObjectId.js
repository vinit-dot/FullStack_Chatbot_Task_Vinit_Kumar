const mongoose = require('mongoose');
const { ApiError } = require('./errorHandler');

// Rejects malformed MongoDB IDs with 400 before touching the database.
module.exports = function validateObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new ApiError(400, 'Invalid enquiry ID.'));
  }
  next();
};
