const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Artist = require('../models/Artist');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register as Artist
router.post('/register/artist', async (req, res) => {
  try {
    const { name, email, password, artform, bio, location, experience } = req.body;

    // Check if artist already exists
    const existingArtist = await Artist.findOne({ email });
    if (existingArtist) {
      return res.status(400).json({ error: 'Artist already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create artist
    const artist = new Artist({
      name,
      email,
      password: hashedPassword,
      artform,
      bio,
      location,
      experience
    });

    await artist.save();

    // Generate JWT token
    const token = jwt.sign({ id: artist._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Artist registered successfully',
      token,
      user: {
        id: artist._id,
        name: artist.name,
        email: artist.email,
        artform: artist.artform,
        type: 'artist'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Register as User
router.post('/register/user', async (req, res) => {
  try {
    const { name, email, password, interests, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      interests,
      location
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        interests: user.interests,
        type: 'user'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if it's an artist or user
    let user = await Artist.findOne({ email });
    let userType = 'artist';
    
    if (!user) {
      user = await User.findOne({ email });
      userType = 'user';
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        artform: user.artform,
        interests: user.interests,
        type: userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userType = req.userType;

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        artform: user.artform,
        interests: user.interests,
        location: user.location,
        type: userType
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;