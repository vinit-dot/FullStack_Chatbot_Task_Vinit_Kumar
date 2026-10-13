// Adds a few SAMPLE enquiries so the dashboard has data for screenshots/demo.
// Run from the server folder:  npm run seed
require('dotenv').config();
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Enquiry = require('../models/Enquiry');

const samples = [
  { name: 'Aarav Sharma', email: 'aarav.sample@example.com', phone: '+91 98765 11111', userType: 'Student', interest: 'Course: Drone Pilot Fundamentals', message: 'I want to know the batch dates and fees.', status: 'New' },
  { name: 'Meera Nair', email: 'meera.sample@example.com', phone: '+91 98765 22222', userType: 'Customer', interest: 'Service: Aerial photography and video', message: 'Need aerial video for a wedding in December.', status: 'Contacted' },
  { name: 'Rohit Verma', email: 'rohit.sample@example.com', phone: '+91 98765 33333', userType: 'Customer', interest: 'Service: Drone mapping and surveying', message: 'Please share a quote for a 10 acre site survey.', status: 'In Progress' },
  { name: 'Sana Khan', email: 'sana.sample@example.com', phone: '+91 98765 44444', userType: 'Other', interest: 'Not sure yet', message: 'I run a school club and want a drone demo session.', status: 'Closed' },
];

(async () => {
  try {
    await connectDB();
    await Enquiry.insertMany(samples);
    console.log(`Inserted ${samples.length} sample enquiries.`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
