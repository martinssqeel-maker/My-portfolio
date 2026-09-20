import rateLimit from 'express-rate-limit';

// Rate limiter for contact message submissions to prevent spam
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 15, // Limit submissions per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many messages sent from this IP. Please wait a few minutes before trying again.',
  },
});

// Rate limiter for admin login attempts to prevent brute force attacks
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 15, // Limit login attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many login attempts. For security reasons, please wait 15 minutes before retrying.',
  },
});
