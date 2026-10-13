const mongoose = require('mongoose');

const USER_TYPES = ['Student', 'Customer', 'Other'];
const STATUSES = ['New', 'Contacted', 'In Progress', 'Closed'];

// Schema = structure of one enquiry document stored in MongoDB.
const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    userType: { type: String, required: true, enum: USER_TYPES },
    interest: { type: String, required: true, trim: true, maxlength: 120 },
    message: { type: String, required: true, trim: true, minlength: 5, maxlength: 1000 },
    status: { type: String, enum: STATUSES, default: 'New' },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ name: 1, email: 1 });

module.exports = mongoose.model('Enquiry', enquirySchema);
module.exports.USER_TYPES = USER_TYPES;
module.exports.STATUSES = STATUSES;
