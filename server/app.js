import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & Parsing Middleware
app.use(cors({
  origin: true, // Allow configured origins and Vercel preview domains
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Request logging in non-production environments
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

// Health check endpoint (handles both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'martins-portfolio-api',
  });
});

// Mount Routes (supporting both /api/ prefix and root in case rewrites strip /api)
app.use('/api/admin', adminRoutes);
app.use('/admin', adminRoutes);

app.use('/api', publicRoutes);
app.use('/', publicRoutes);

// In production standalone mode, serve static files from dist if present
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res) => {
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({
        success: false,
        error: `Endpoint ${req.method} ${req.originalUrl} not found.`,
      });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // 404 handler for unknown API routes
  app.use('/api', (req, res) => {
    res.status(404).json({
      success: false,
      error: `Endpoint ${req.method} ${req.originalUrl} not found.`,
    });
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

export default app;
