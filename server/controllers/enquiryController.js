const Enquiry = require('../models/Enquiry');
const { USER_TYPES, STATUSES } = require('../models/Enquiry');
const { ApiError } = require('../middleware/errorHandler');
const { validateEnquiry } = require('../utils/validation');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/enquiries?search=&userType=&status=&page=&limit=
exports.getEnquiries = async (req, res, next) => {
  try {
    const { search, userType, status } = req.query;
    const filter = {};

    if (typeof search === 'string' && search.trim()) {
      const rx = new RegExp(escapeRegex(search.trim().slice(0, 60)), 'i');
      filter.$or = [{ name: rx }, { email: rx }];
    }
    if (typeof userType === 'string' && userType) {
      if (!USER_TYPES.includes(userType)) throw new ApiError(400, 'Invalid userType filter.');
      filter.userType = userType;
    }
    if (typeof status === 'string' && status) {
      if (!STATUSES.includes(status)) throw new ApiError(400, 'Invalid status filter.');
      filter.status = status;
    }

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);

    const [data, total] = await Promise.all([
      Enquiry.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      Enquiry.countDocuments(filter),
    ]);

    res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 } });
  } catch (err) {
    next(err);
  }
};

// GET /api/enquiries/:id
exports.getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).lean();
    if (!enquiry) throw new ApiError(404, 'Enquiry not found.');
    res.json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};

// POST /api/enquiries  (public - used by chatbot and contact form)
exports.createEnquiry = async (req, res, next) => {
  try {
    const { errors, values } = validateEnquiry(req.body);
    if (Object.keys(errors).length) throw new ApiError(400, 'Please fix the highlighted fields.', errors);
    const enquiry = await Enquiry.create(values); // status defaults to "New"
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully.', data: enquiry });
  } catch (err) {
    next(err);
  }
};

// PUT (full) and PATCH (partial) /api/enquiries/:id
const buildUpdate = (partial) => async (req, res, next) => {
  try {
    const { errors, values } = validateEnquiry(req.body, { partial });
    if (Object.keys(errors).length) throw new ApiError(400, 'Please fix the highlighted fields.', errors);
    if (!Object.keys(values).length) throw new ApiError(400, 'No valid fields to update.');

    // PUT may also send a status; validate it here since full validation ignores it.
    if (!partial && req.body && req.body.status !== undefined) {
      if (!STATUSES.includes(req.body.status)) throw new ApiError(400, 'Invalid status.');
      values.status = req.body.status;
    }

    const updated = await Enquiry.findByIdAndUpdate(req.params.id, { $set: values }, { new: true, runValidators: true });
    if (!updated) throw new ApiError(404, 'Enquiry not found.');
    res.json({ success: true, message: 'Enquiry updated.', data: updated });
  } catch (err) {
    next(err);
  }
};
exports.putEnquiry = buildUpdate(false);
exports.patchEnquiry = buildUpdate(true);

// DELETE /api/enquiries/:id
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const deleted = await Enquiry.findByIdAndDelete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Enquiry not found.');
    res.json({ success: true, message: 'Enquiry deleted.' });
  } catch (err) {
    next(err);
  }
};
