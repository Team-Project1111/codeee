const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    maxlength: 1000
  },
  artform: {
    type: String,
    required: true,
    enum: ['Warli', 'Pithora', 'Madhubani', 'Gond', 'Kalamkari', 'Patachitra', 'Other']
  },
  location: {
    city: String,
    state: String,
    country: { type: String, default: 'India' }
  },
  profileImage: {
    type: String,
    default: '/images/default-profile.jpg'
  },
  experience: {
    type: Number, // years of experience
    min: 0
  },
  specializations: [String],
  socialMedia: {
    instagram: String,
    facebook: String,
    website: String
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  artworks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artwork'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  joinedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search functionality
artistSchema.index({ name: 'text', bio: 'text', artform: 'text' });

module.exports = mongoose.model('Artist', artistSchema);