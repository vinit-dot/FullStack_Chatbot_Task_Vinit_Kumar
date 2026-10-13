require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  if (!process.env.ADMIN_API_KEY || process.env.ADMIN_API_KEY.length < 12) {
    console.error('Set a strong ADMIN_API_KEY (min 12 chars) in server/.env');
    process.exit(1);
  }
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Could not start server:', err.message);
    process.exit(1);
  }
})();
