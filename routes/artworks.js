const express = require('express');
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all artworks with filtering and pagination
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { 
      artform, 
      artist, 
      page = 1, 
      limit = 12, 
      search, 
      sortBy = 'newest',
      priceMin,
      priceMax,
      forSale
    } = req.query;
    
    const query = { status: 'published' };

    if (artform && artform !== 'all') {
      query.artform = artform;
    }

    if (artist) {
      query.artist = artist;
    }

    if (search) {
      query.$text = { $search: search };
    }

    if (forSale === 'true') {
      query.isForSale = true;
      if (priceMin) query.price = { $gte: Number(priceMin) };
      if (priceMax) query.price = { ...query.price, $lte: Number(priceMax) };
    }

    let sortOption = {};
    switch (sortBy) {
      case 'popular':
        sortOption = { views: -1, 'likes.length': -1 };
        break;
      case 'price-low':
        sortOption = { price: 1 };
        break;
      case 'price-high':
        sortOption = { price: -1 };
        break;
      default:
        sortOption = { featured: -1, createdAt: -1 };
    }

    const artworks = await Artwork.find(query)
      .populate('artist', 'name profileImage artform location isVerified')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Artwork.countDocuments(query);

    res.json({
      artworks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get featured artworks
router.get('/featured/highlights', async (req, res) => {
  try {
    const artworks = await Artwork.find({ featured: true, status: 'published' })
      .populate('artist', 'name profileImage artform isVerified')
      .sort({ views: -1, createdAt: -1 })
      .limit(8);

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artwork by ID
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name profileImage artform location experience isVerified')
      .populate('likes.user', 'name profileImage')
      .populate('comments.user', 'name profileImage');

    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    // Increment view count
    artwork.views += 1;
    await artwork.save();

    // Check if current user has liked this artwork
    let hasLiked = false;
    if (req.user) {
      hasLiked = artwork.likes.some(like => like.user._id.toString() === req.user._id.toString());
    }

    res.json({ ...artwork.toObject(), hasLiked });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new artwork (artists only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    if (req.userType !== 'artist') {
      return res.status(403).json({ error: 'Only artists can create artworks' });
    }

    const artworkData = {
      ...req.body,
      artist: req.user._id
    };

    const artwork = new Artwork(artworkData);
    await artwork.save();

    // Add artwork to artist's artworks array
    req.user.artworks.push(artwork._id);
    
    // Auto-verify if artist now has 3+ artworks
    if (req.user.artworks.length >= 3) {
      req.user.isVerified = true;
    }
    
    await req.user.save();

    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate('artist', 'name profileImage artform');

    res.status(201).json({
      message: 'Artwork created successfully',
      artwork: populatedArtwork
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like/Unlike artwork
router.post('/:id/like', authenticateToken, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    const userId = req.user._id;
    const existingLike = artwork.likes.find(like => like.user.toString() === userId.toString());

    if (existingLike) {
      // Unlike
      artwork.likes.pull({ user: userId });
      if (req.userType === 'user') {
        req.user.favoriteArtworks.pull(artwork._id);
        await req.user.save();
      }
      await artwork.save();
      res.json({ message: 'Artwork unliked', hasLiked: false, likesCount: artwork.likes.length });
    } else {
      // Like
      artwork.likes.push({ user: userId });
      if (req.userType === 'user') {
        req.user.favoriteArtworks.push(artwork._id);
        await req.user.save();
      }
      await artwork.save();
      res.json({ message: 'Artwork liked', hasLiked: true, likesCount: artwork.likes.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add comment to artwork
router.post('/:id/comment', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    const artwork = await Artwork.findById(req.params.id);
    
    if (!artwork) {
      return res.status(404).json({ error: 'Artwork not found' });
    }

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date()
    };

    artwork.comments.push(comment);
    await artwork.save();

    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate('comments.user', 'name profileImage');

    const newComment = populatedArtwork.comments[populatedArtwork.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get artworks by artform
router.get('/artform/:artform', async (req, res) => {
  try {
    const { artform } = req.params;
    const { limit = 8 } = req.query;

    const artworks = await Artwork.find({ 
      artform: artform,
      status: 'published'
    })
    .populate('artist', 'name profileImage isVerified')
    .sort({ featured: -1, views: -1 })
    .limit(Number(limit));

    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;