const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*', // For development; tighten this in production
  })
);

// MongoDB connection
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/alumni_connect';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // Seed demo alumni if database is empty
    const { seedAlumniIfEmpty } = require('./src/seed/seedAlumni');
    await seedAlumniIfEmpty();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// API routes
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const messageRoutes = require('./src/routes/messages');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Serve frontend static files (index.html, styles.css, script.js, etc.)
const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

// Fallback to index.html for non-API routes (simple SPA-style routing)
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(publicDir, 'index.html'));
});

// 404 handler for APIs
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res
      .status(404)
      .json({ success: false, message: 'API route not found' });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Alumni Connect backend + frontend running on http://localhost:${PORT}`);
});

