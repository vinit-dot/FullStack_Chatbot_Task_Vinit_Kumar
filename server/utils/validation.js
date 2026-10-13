const validator = require('validator');
const { USER_TYPES, STATUSES } = require('../models/Enquiry');

// Removes HTML tags and control characters so stored text is always plain text.
function clean(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();
}

const PHONE_REGEX = /^\+?[0-9\s-]{10,16}$/;

// Validates a (partial or full) enquiry body. Returns { errors, values }.
// partial=true is used for PATCH, where only some fields are sent.
function validateEnquiry(body, { partial = false } = {}) {
  const errors = {};
  const values = {};
  const input = body && typeof body === 'object' && !Array.isArray(body) ? body : {};

  const has = (key) => Object.prototype.hasOwnProperty.call(input, key);
  const shouldCheck = (key) => !partial || has(key);

  if (shouldCheck('name')) {
    const v = clean(input.name);
    if (!v) errors.name = 'Name is required.';
    else if (v.length < 2 || v.length > 80) errors.name = 'Name must be 2 to 80 characters.';
    else values.name = v;
  }

  if (shouldCheck('email')) {
    const v = clean(input.email).toLowerCase();
    if (!v) errors.email = 'Email is required.';
    else if (!validator.isEmail(v) || v.length > 120) errors.email = 'Enter a valid email address.';
    else values.email = v;
  }

  if (shouldCheck('phone')) {
    const v = clean(input.phone);
    const digits = v.replace(/\D/g, '');
    if (!v) errors.phone = 'Phone number is required.';
    else if (!PHONE_REGEX.test(v) || digits.length < 10 || digits.length > 13)
      errors.phone = 'Enter a valid phone number (10 to 13 digits).';
    else values.phone = v;
  }

  if (shouldCheck('userType')) {
    const v = clean(input.userType);
    if (!v) errors.userType = 'Please choose a user type.';
    else if (!USER_TYPES.includes(v)) errors.userType = 'User type must be Student, Customer or Other.';
    else values.userType = v;
  }

  if (shouldCheck('interest')) {
    const v = clean(input.interest);
    if (!v) errors.interest = 'Please choose a service or course.';
    else if (v.length > 120) errors.interest = 'Interest is too long.';
    else values.interest = v;
  }

  if (shouldCheck('message')) {
    const v = clean(input.message);
    if (!v) errors.message = 'Message is required.';
    else if (v.length < 5 || v.length > 1000) errors.message = 'Message must be 5 to 1000 characters.';
    else values.message = v;
  }

  // Status can only be changed through update (never on create).
  if (partial && has('status')) {
    const v = clean(input.status);
    if (!STATUSES.includes(v)) errors.status = `Status must be one of: ${STATUSES.join(', ')}.`;
    else values.status = v;
  }

  return { errors, values };
}

module.exports = { validateEnquiry, clean };
