const rateLimit = require('express-rate-limit');

const json = (message) => ({ success: false, message });

// General limit for all /api routes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many requests. Please try again later.'),
});

// Stricter limit for public enquiry submissions (spam protection).
const createLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many enquiries submitted. Please try again later.'),
});

module.exports = { apiLimiter, createLimiter };
