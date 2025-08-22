const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true
  },
  artform: {
    type: String,
    required: true,
    enum: ['Warli', 'Pithora', 'Madhubani', 'Gond', 'Kalamkari', 'Patachitra', 'Other']
  },
  images: [{
    url: String,
    caption: String
  }],
  price: {
    type: Number,
    min: 0
  },
  isForSale: {
    type: Boolean,
    default: false
  },
  dimensions: {
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  materials: [String],
  technique: String,
  yearCreated: Number,
  tags: [String],
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index for search and filtering
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });
artworkSchema.index({ artform: 1, featured: -1, createdAt: -1 });
artworkSchema.index({ artist: 1, createdAt: -1 });

module.exports = mongoose.model('Artwork', artworkSchema);