# 🎨 Kala Heritage - Digital Platform for Traditional Indian Folk Art

**Preserving, Promoting, and Celebrating India's Rich Folk Art Heritage**

Kala Heritage is a comprehensive digital platform designed to bridge the gap between traditional Indian folk artists and modern audiences. Our mission is to preserve cultural heritage while empowering artists with digital tools to showcase their work and sustain their livelihoods.

## 🌟 Features

### For Art Enthusiasts
- **Discover Traditional Artforms**: Explore Warli, Pithora, Madhubani, Gond, Kalamkari, and Patachitra
- **Artist Profiles**: Learn about master artists, their stories, and techniques
- **Interactive Gallery**: Browse, filter, and discover beautiful artworks
- **Personalized Experience**: Get recommendations based on your interests
- **Community Engagement**: Like, comment, and follow your favorite artists
- **Cultural Education**: Learn about the history and significance of each artform

### For Artists
- **Professional Profiles**: Showcase your work and artistic journey
- **Artwork Management**: Upload and manage your portfolio
- **Direct Sales**: Sell your artworks directly to collectors
- **Analytics**: Track views, likes, and engagement
- **Community Building**: Connect with art enthusiasts and other artists
- **Verification System**: Get verified status for authenticity

### Platform Features
- **Responsive Design**: Beautiful UI optimized for all devices
- **Real-time Interactions**: Instant likes, comments, and notifications
- **Advanced Search**: Find artists and artworks with intelligent filtering
- **Performance Optimized**: Fast loading with modern web technologies
- **Secure Authentication**: JWT-based authentication system
- **Modern UX**: Smooth animations and interactive elements

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Interactive functionality
- **Font Awesome** - Icons
- **Google Fonts** - Typography

### Security & Performance
- **Helmet.js** - Security headers
- **Rate Limiting** - API protection
- **Compression** - Response compression
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Data sanitization

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   mongod
   ```

5. **Seed the database with sample data**
   ```bash
   node seedData.js
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Demo Credentials

### Sample Artist Accounts
- **Madhubani Artist**: `meera.devi@example.com` / `password123`
- **Warli Artist**: `ravi.bhil@example.com` / `password123`
- **Pithora Artist**: `kiran.patel@example.com` / `password123`

### Sample User Accounts
- **Art Enthusiast**: `arjun.sharma@example.com` / `password123`
- **Collector**: `priya.menon@example.com` / `password123`

## 🎯 Key Innovations

### Cultural Preservation
- **Digital Documentation**: Preserving traditional techniques and stories
- **Artist Storytelling**: Platform for artists to share their heritage
- **Educational Content**: Learning resources about each artform

### Modern Technology Meets Tradition
- **Responsive Design**: Accessible on all devices
- **Interactive Features**: Engaging user experience
- **Performance Optimized**: Fast loading and smooth animations
- **Search & Discovery**: Advanced filtering and recommendation system

### Community Building
- **Artist-Audience Connection**: Direct interaction between creators and admirers
- **Social Features**: Following, liking, commenting system
- **Personalization**: Tailored content based on user preferences

## 🏗 Project Structure

```
kala-heritage/
├── server.js                 # Main server file
├── package.json             # Dependencies and scripts
├── .env                     # Environment variables
├── seedData.js              # Database seeding script
├── models/                  # MongoDB models
│   ├── Artist.js
│   ├── Artwork.js
│   └── User.js
├── routes/                  # API routes
│   ├── auth.js
│   ├── artists.js
│   ├── artworks.js
│   └── users.js
├── middleware/              # Custom middleware
│   └── auth.js
├── public/                  # Frontend assets
│   ├── index.html
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── animations.css
│   ├── js/
│   │   ├── main.js
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── components.js
│   │   └── utils.js
│   └── images/
└── uploads/                 # User uploaded files
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User/Artist login
- `POST /api/auth/register/user` - User registration
- `POST /api/auth/register/artist` - Artist registration
- `GET /api/auth/profile` - Get current user profile

### Artists
- `GET /api/artists` - Get all artists (with filtering)
- `GET /api/artists/featured` - Get featured artists
- `GET /api/artists/:id` - Get artist by ID
- `POST /api/artists/:id/follow` - Follow/unfollow artist
- `PUT /api/artists/profile` - Update artist profile

### Artworks
- `GET /api/artworks` - Get all artworks (with filtering)
- `GET /api/artworks/featured/highlights` - Get featured artworks
- `GET /api/artworks/:id` - Get artwork by ID
- `POST /api/artworks` - Create new artwork (artists only)
- `POST /api/artworks/:id/like` - Like/unlike artwork
- `POST /api/artworks/:id/comment` - Add comment to artwork

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/favorites` - Get user's favorite artworks
- `GET /api/users/following` - Get user's followed artists
- `GET /api/users/recommendations` - Get personalized recommendations

## 🎨 Design Philosophy

### Color Palette
Our design draws inspiration from traditional Indian art colors:
- **Primary Orange** (#FF6B35) - Energy and creativity
- **Saffron** (#FF9933) - Sacred and auspicious
- **Deep Blue** (#264653) - Stability and trust
- **Gold** (#F4A261) - Prosperity and heritage
- **Earth Tones** - Natural and authentic feel

### Typography
- **Playfair Display** - Elegant serif for headings
- **Inter** - Clean sans-serif for body text
- **Noto Sans Devanagari** - Support for Hindi text

### User Experience
- **Intuitive Navigation** - Easy to explore and discover
- **Visual Storytelling** - Art takes center stage
- **Responsive Design** - Seamless across all devices
- **Accessibility** - Inclusive design principles
- **Performance** - Optimized for fast loading

## 🌍 Real-World Impact

### Problem Solved
- **Limited Visibility**: Traditional artists struggle to reach wider audiences
- **Cultural Preservation**: Risk of losing traditional techniques and stories
- **Economic Sustainability**: Artists need modern platforms to sustain livelihoods
- **Knowledge Gap**: Younger generations losing connection to heritage

### Solution Provided
- **Global Reach**: Connect artists with worldwide audiences
- **Digital Preservation**: Document and preserve traditional techniques
- **Economic Empowerment**: Direct sales and commission opportunities
- **Educational Platform**: Learn about and appreciate folk art heritage

## 📈 Future Enhancements

### Phase 2 Features
- **Virtual Workshops**: Online learning sessions with master artists
- **AR/VR Integration**: Immersive art exploration
- **Mobile App**: Native mobile applications
- **Marketplace**: Enhanced e-commerce features
- **Artist Collaboration**: Tools for artistic partnerships

### Phase 3 Features
- **International Expansion**: Support for global folk art traditions
- **AI Recommendations**: Advanced personalization
- **Live Streaming**: Real-time art creation sessions
- **NFT Integration**: Digital ownership and collectibles

## 🤝 Contributing

We welcome contributions from developers, designers, and art enthusiasts!

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📞 Support

For support, feedback, or collaboration opportunities:
- **Email**: support@kalaheritage.com
- **Website**: www.kalaheritage.com
- **Social Media**: @KalaHeritage

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional folk artists who preserve our cultural heritage
- The vibrant communities that keep these art forms alive
- Open source contributors and the developer community
- Cultural institutions supporting traditional arts

---

**Built with ❤️ for preserving India's rich cultural heritage**

*Kala Heritage - Where Tradition Meets Technology*