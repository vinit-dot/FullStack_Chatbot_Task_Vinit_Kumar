const crypto = require('crypto');
const { ApiError } = require('./errorHandler');

// Protects admin-only routes. The dashboard sends the key in the "x-admin-key" header.
// timingSafeEqual avoids leaking information through response timing.
function adminAuth(req, res, next) {
  const expected = process.env.ADMIN_API_KEY;
  if (!expected) return next(new Error('ADMIN_API_KEY is not configured'));

  const provided = req.get('x-admin-key');
  if (!provided) return next(new ApiError(401, 'Admin key is required.'));

  const a = crypto.createHash('sha256').update(provided).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  if (!crypto.timingSafeEqual(a, b)) return next(new ApiError(401, 'Invalid admin key.'));
  next();
}

module.exports = adminAuth;
