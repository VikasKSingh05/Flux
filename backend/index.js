require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/authRoutes');
const todoRoutes = require('./src/routes/todoRoutes');

const app = express();

// Configure CORS to accept a comma-separated list of origins from env
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = corsOrigin.split(',').map((s) => s.trim());

console.log('[CORS] Allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log('[CORS] Incoming origin:', origin);
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      if (allowedOrigins.some(allowed => origin.toLowerCase() === allowed.toLowerCase())) {
        return callback(null, true);
      }
      console.log('[CORS] Origin blocked:', origin);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'OK' });
});

app.use(errorHandler);

app.use((req, res, next) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

// Connect to database and initialize app
connectDB()
  .then(() => {
    console.log('[DB] Connected successfully');
  })
  .catch((err) => {
    console.error('[DB] Connection failed:', err);
    // On Vercel, continue anyway (better than crashing)
    console.warn('[DB] Continuing without database (serverless may still work for some routes)');
  });

// For Vercel Serverless Functions
module.exports = app;

// For local development (npm run dev)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
