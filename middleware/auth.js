const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');
const User = require('../models/User');

// Rate limiting for failed auth attempts
const failedAttempts = new Map();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Check for failed attempts (rate limiting)
    const clientIP = req.ip || req.connection.remoteAddress;
    const attempts = failedAttempts.get(clientIP);
    if (attempts && attempts.count >= MAX_FAILED_ATTEMPTS && 
        Date.now() - attempts.lastAttempt < LOCKOUT_TIME) {
      return res.status(429).json({ 
        error: 'Too many failed attempts. Please try again later.',
        code: 'RATE_LIMITED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate token structure
    if (!decoded.id || !decoded.type) {
      throw new Error('Invalid token structure');
    }

    let user;
    if (decoded.type === 'artist') {
      user = await Artist.findById(decoded.id).select('-password');
      req.userType = 'artist';
    } else if (decoded.type === 'user') {
      user = await User.findById(decoded.id).select('-password');
      req.userType = 'user';
    } else {
      // Fallback: try to find in both collections
      user = await Artist.findById(decoded.id).select('-password');
      if (!user) {
        user = await User.findById(decoded.id).select('-password');
        req.userType = 'user';
      } else {
        req.userType = 'artist';
      }
    }

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;

    // Clear failed attempts on successful auth
    failedAttempts.delete(clientIP);
    
    next();
  } catch (error) {
    // Track failed attempts
    const clientIP = req.ip || req.connection.remoteAddress;
    const attempts = failedAttempts.get(clientIP) || { count: 0, lastAttempt: 0 };
    attempts.count++;
    attempts.lastAttempt = Date.now();
    failedAttempts.set(clientIP, attempts);

    console.error('Authentication error:', error.message);
    return res.status(403).json({ 
      error: 'Invalid or expired token',
      code: 'TOKEN_INVALID'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.id) {
        let user;
        if (decoded.type === 'artist') {
          user = await Artist.findById(decoded.id).select('-password');
          req.userType = 'artist';
        } else if (decoded.type === 'user') {
          user = await User.findById(decoded.id).select('-password');
          req.userType = 'user';
        } else {
          // Fallback: try to find in both collections
          user = await Artist.findById(decoded.id).select('-password');
          if (!user) {
            user = await User.findById(decoded.id).select('-password');
            req.userType = 'user';
          } else {
            req.userType = 'artist';
          }
        }
        
        if (user) {
          req.user = user;
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication if token is invalid
    console.log('Optional auth failed:', error.message);
    next();
  }
};

module.exports = { authenticateToken, optionalAuth };