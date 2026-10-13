const mongoose = require('mongoose');

// Connects to MongoDB using the URI stored in .env (never hard-code credentials).
async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is missing in server/.env');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('MongoDB connected');
}

module.exports = connectDB;
