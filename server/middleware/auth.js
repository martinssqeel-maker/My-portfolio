import jwt from 'jsonwebtoken';
import { db } from '../db/database.js';

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication token required.',
      });
    }

    const secret = process.env.JWT_SECRET || 'martins-portfolio-jwt-secret-key-replace-in-production-2026';
    const decoded = jwt.verify(token, secret);

    // Verify user exists in database and is active
    const user = await db.get(
      'SELECT "id", "email", "role", "createdAt", "lastLoginAt" FROM users WHERE "id" = ?',
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User account not found or has been removed.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please log in again.',
      });
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid authentication token.',
    });
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Access denied: Administrator privileges required.',
      });
    }
  });
}
