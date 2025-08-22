const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an artist or user
    let user = await Artist.findById(decoded.id);
    if (!user) {
      user = await User.findById(decoded.id);
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    req.userType = user.artform ? 'artist' : 'user'; // Artists have artform field
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user = await Artist.findById(decoded.id);
      if (!user) {
        user = await User.findById(decoded.id);
      }
      if (user) {
        req.user = user;
        req.userType = user.artform ? 'artist' : 'user';
      }
    } catch (error) {
      // Token invalid, but continue without authentication
    }
  }
  next();
};

module.exports = { authenticateToken, optionalAuth };