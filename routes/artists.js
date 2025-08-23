const express = require('express');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all artists with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { artform, location, page = 1, limit = 12, search } = req.query;
    const query = {};

    if (artform && artform !== 'all') {
      query.artform = artform;
    }

    if (location) {
      query['location.state'] = new RegExp(location, 'i');
    }

    if (search) {
      query.$text = { $search: search };
    }

    const artists = await Artist.find(query)
      .select('-password')
      .populate('artworks', 'title images')
      .sort({ featured: -1, rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Artist.countDocuments(query);

    res.json({
      artists,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured artists
router.get('/featured', async (req, res) => {
  try {
    const artists = await Artist.find({ isVerified: true })
      .select('-password')
      .populate('artworks', 'title images')
      .sort({ rating: -1, totalRatings: -1 })
      .limit(6);

    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artist by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .select('-password')
      .populate({
        path: 'artworks',
        options: { sort: { createdAt: -1 } }
      });

    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    // Check if current user is following this artist
    let isFollowing = false;
    if (req.user && req.userType === 'user') {
      isFollowing = req.user.followingArtists.includes(artist._id);
    }

    res.json({ ...artist.toObject(), isFollowing });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow/Unfollow artist
router.post('/:id/follow', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'user') {
      return res.status(403).json({ error: 'Only users can follow artists' });
    }

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const user = req.user;
    const isFollowing = user.followingArtists.includes(artist._id);

    if (isFollowing) {
      // Unfollow
      user.followingArtists.pull(artist._id);
      artist.followers.pull(user._id);
      await Promise.all([user.save(), artist.save()]);
      res.json({ message: 'Artist unfollowed', isFollowing: false });
    } else {
      // Follow
      user.followingArtists.push(artist._id);
      artist.followers.push(user._id);
      await Promise.all([user.save(), artist.save()]);
      res.json({ message: 'Artist followed', isFollowing: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update artist profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'artist') {
      return res.status(403).json({ error: 'Only artists can update artist profiles' });
    }

    const updates = req.body;
    delete updates.password; // Don't allow password updates through this route
    delete updates.email; // Don't allow email updates

    const artist = await Artist.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', artist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artist statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const artworks = await Artwork.find({ artist: artist._id });
    const totalViews = artworks.reduce((sum, artwork) => sum + artwork.views, 0);
    const totalLikes = artworks.reduce((sum, artwork) => sum + artwork.likes.length, 0);

    res.json({
      totalArtworks: artworks.length,
      totalViews,
      totalLikes,
      followers: artist.followers.length,
      rating: artist.rating,
      totalRatings: artist.totalRatings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check artist verification status
router.get('/:id/verification-status', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ error: 'Artist not found' });
    }

    const artworkCount = await Artwork.countDocuments({ 
      artist: req.params.id, 
      status: 'published' 
    });

    const verificationStatus = {
      isVerified: artist.isVerified,
      artworkCount,
      meetsCriteria: artworkCount >= 3,
      criteria: {
        requiredArtworks: 3,
        currentArtworks: artworkCount
      }
    };

    res.json(verificationStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get verification statistics
router.get('/verification/stats', async (req, res) => {
  try {
    const totalArtists = await Artist.countDocuments();
    const verifiedArtists = await Artist.countDocuments({ isVerified: true });
    const artistsWith3PlusArtworks = await Artist.aggregate([
      {
        $lookup: {
          from: 'artworks',
          localField: '_id',
          foreignField: 'artist',
          as: 'artworks'
        }
      },
      {
        $match: {
          'artworks': { $exists: true, $ne: [] },
          $expr: { $gte: [{ $size: '$artworks' }, 3] }
        }
      },
      {
        $count: 'count'
      }
    ]);

    const stats = {
      totalArtists,
      verifiedArtists,
      artistsWith3PlusArtworks: artistsWith3PlusArtworks[0]?.count || 0,
      verificationRate: totalArtists > 0 ? ((verifiedArtists / totalArtists) * 100).toFixed(1) : 0
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;