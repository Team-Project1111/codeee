# Kala Heritage - Traditional Indian Folk Art Platform

A comprehensive digital platform dedicated to preserving, promoting, and creating engagement around traditional Indian folk artforms like Warli, Pithora, Madhubani, Gond, Kalamkari, and Patachitra.

## 🌟 Features

### Core Platform Features
- **Interactive Gallery**: Browse and explore traditional artworks with filtering by artform
- **Artist Profiles**: Detailed profiles showcasing artists' work, experience, and stories
- **User Authentication**: Secure login/registration system for artists and art enthusiasts
- **Search & Discovery**: Advanced search functionality across artists, artworks, and artforms
- **Responsive Design**: Modern, mobile-friendly interface with beautiful animations

### Content-Based Badging System
- **Verification Badges**: Artists automatically receive verified badges after uploading 3+ artworks
- **Verification Status**: Real-time tracking of verification progress
- **Verification Statistics**: Platform-wide statistics and insights
- **Interactive Badges**: Click on verification badges to view detailed status

### Artist Features
- **Profile Management**: Complete artist profiles with bio, experience, and specializations
- **Artwork Upload**: Easy artwork submission with detailed metadata
- **Social Features**: Follow other artists, receive likes and comments
- **Verification Progress**: Track progress towards verification status

### User Features
- **Artwork Discovery**: Browse and discover traditional artworks
- **Artist Following**: Follow favorite artists and stay updated
- **Favorites System**: Save and organize favorite artworks
- **Community Engagement**: Like, comment, and interact with artworks

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kala-heritage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/kala-heritage
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npm run seed
   ```

5. **Start the application**
   ```bash
   npm start
   ```

6. **Access the platform**
   Open your browser and navigate to `http://localhost:3000`

## 🏗️ Architecture

### Backend (Node.js + Express)
- **Models**: User, Artist, Artwork with comprehensive schemas
- **Routes**: RESTful API endpoints for all platform features
- **Middleware**: Authentication, rate limiting, and security
- **Database**: MongoDB with Mongoose ODM

### Frontend (Vanilla JavaScript)
- **Components**: Modular, reusable UI components
- **API Service**: Centralized API communication
- **Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first approach with modern CSS

### Key Technologies
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: JWT, bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Styling**: CSS Grid, Flexbox, CSS Variables

## 📊 Verification Badge System

### How It Works
1. **Automatic Verification**: Artists are automatically verified when they upload 3+ published artworks
2. **Real-time Updates**: Verification status updates immediately when criteria are met
3. **Visual Indicators**: Verified artists display badges on their profiles and artwork cards
4. **Progress Tracking**: Artists can track their progress towards verification

### Verification Criteria
- Upload minimum 3 published artworks
- Maintain active account status
- Follow platform guidelines

### Benefits of Verification
- **Trust Building**: Verified badge increases credibility
- **Enhanced Visibility**: Verified artists appear higher in search results
- **Community Recognition**: Special recognition within the platform
- **Access to Features**: Exclusive features for verified artists

## 🎨 Artforms Supported

### Warli Art
- **Origin**: Maharashtra
- **Style**: Geometric patterns, nature motifs
- **Characteristics**: Simple, monochromatic designs

### Pithora Art
- **Origin**: Gujarat
- **Style**: Wall paintings, ceremonial themes
- **Characteristics**: Vibrant colors, horse motifs

### Madhubani Art
- **Origin**: Bihar
- **Style**: Intricate patterns, religious themes
- **Characteristics**: Detailed, colorful designs

### Gond Art
- **Origin**: Central India
- **Style**: Dot-based patterns, tribal mythology
- **Characteristics**: Unique dot technique

### Kalamkari Art
- **Origin**: Andhra Pradesh
- **Style**: Hand-painted textiles, mythological narratives
- **Characteristics**: Natural dyes, detailed storytelling

### Patachitra Art
- **Origin**: Odisha
- **Style**: Scroll paintings, religious stories
- **Characteristics**: Traditional scroll format

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register/artist` - Register as artist
- `POST /api/auth/register/user` - Register as user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist by ID
- `GET /api/artists/:id/verification-status` - Get verification status
- `GET /api/artists/verification/stats` - Get verification statistics

### Artworks
- `GET /api/artworks` - Get all artworks
- `GET /api/artworks/:id` - Get artwork by ID
- `POST /api/artworks` - Create new artwork
- `POST /api/artworks/:id/like` - Like/unlike artwork
- `POST /api/artworks/:id/comment` - Add comment

## 🎯 Key Features Implementation

### Content-Based Badging System
```javascript
// Automatic verification check
const checkArtistVerification = async (artistId) => {
  const artworkCount = await Artwork.countDocuments({ 
    artist: artistId, 
    status: 'published' 
  });
  
  if (artworkCount >= 3) {
    await Artist.findByIdAndUpdate(artistId, { isVerified: true });
  }
};
```

### User Authentication
```javascript
// JWT-based authentication
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { 
  expiresIn: '7d' 
});
```

### Interactive UI Components
```javascript
// Verification badge component
static createVerificationStatusModal(verificationData) {
  // Dynamic modal content with progress tracking
}
```

## 🚀 Deployment

### Production Setup
1. Set up MongoDB Atlas or production MongoDB instance
2. Configure environment variables for production
3. Set up reverse proxy (nginx) for SSL termination
4. Use PM2 or similar process manager
5. Configure monitoring and logging

### Environment Variables
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Indian artists for preserving these beautiful artforms
- The open-source community for amazing tools and libraries
- Cultural heritage organizations for inspiration and guidance

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Kala Heritage** - Preserving India's Folk Art Legacy for Future Generations 🎨