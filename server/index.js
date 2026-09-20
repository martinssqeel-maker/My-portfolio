import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

import { initDatabase } from './db/database.js';
import { seed } from './db/seed.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database & Seed if empty
initDatabase();
seed().catch((err) => console.error('Database auto-seed notice:', err.message));

// Security & Parsing Middleware
app.use(cors({
  origin: true, // Allow dev preview domains and configured frontend
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Request logging in development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'martins-portfolio-api',
  });
});

// Mount Routes
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// In production, serve static files from dist
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Centralized safe error handler (prevents leaking internal stack traces)
app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred on the server.'
      : (err.message || 'Server error'),
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(`  Portfolio Full-Stack API Server Online`);
  console.log(`  Port: ${PORT} (0.0.0.0:${PORT})`);
  console.log(`  Health Check: http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

export default app;
