const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const enquiryRoutes = require('./routes/enquiryRoutes');
const { apiLimiter } = require('./middleware/rateLimiters');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, cb) {
      // allow tools like Postman/curl (no Origin header) and the configured frontend
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-admin-key'],
  })
);

app.use(express.json({ limit: '10kb' })); // small body limit = basic abuse protection

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }));
app.use('/api', apiLimiter);
app.use('/api/enquiries', enquiryRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
