const express = require('express');
const c = require('../controllers/enquiryController');
const adminAuth = require('../middleware/adminAuth');
const validateObjectId = require('../middleware/validateObjectId');
const { createLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

// Public: anyone can submit an enquiry from the chatbot / contact form.
router.post('/', createLimiter, c.createEnquiry);

// Admin-only: reading, updating and deleting enquiries needs the admin key.
router.get('/', adminAuth, c.getEnquiries);
router.get('/:id', adminAuth, validateObjectId, c.getEnquiry);
router.put('/:id', adminAuth, validateObjectId, c.putEnquiry);
router.patch('/:id', adminAuth, validateObjectId, c.patchEnquiry);
router.delete('/:id', adminAuth, validateObjectId, c.deleteEnquiry);

module.exports = router;
