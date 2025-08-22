const express = require('express');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can access user profiles' });
    }

    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favoriteArtworks', 'title images artist')
      .populate('followingArtists', 'name profileImage artform');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can update user profiles' });
    }

    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.email; // Don't allow email updates

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite artworks
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can access favorites' });
    }

    const user = await User.findById(req.user._id)
      .populate({
        path: 'favoriteArtworks',
        populate: {
          path: 'artist',
          select: 'name profileImage artform isVerified'
        }
      });

    res.json(user.favoriteArtworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's following artists
router.get('/following', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can access following list' });
    }

    const user = await User.findById(req.user._id)
      .populate('followingArtists', 'name profileImage artform location isVerified rating');

    res.json(user.followingArtists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get personalized recommendations
router.get('/recommendations', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can get recommendations' });
    }

    const user = req.user;
    const interests = user.interests;

    // Get artworks based on user interests
    const Artwork = require('../models/Artwork');
    const recommendations = await Artwork.find({
      artform: { $in: interests },
      status: 'published',
      _id: { $nin: user.favoriteArtworks } // Exclude already liked artworks
    })
    .populate('artist', 'name profileImage artform isVerified')
    .sort({ views: -1, 'likes.length': -1 })
    .limit(12);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;