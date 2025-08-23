// API Service for Kala Heritage Platform

class ApiService {
  constructor() {
    this.baseURL = '/api';
    this.token = Utils.Storage.get('authToken');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      Utils.Storage.set('authToken', token);
    } else {
      Utils.Storage.remove('authToken');
    }
  }

  // Get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async registerUser(userData) {
    return this.request('/auth/register/user', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async registerArtist(artistData) {
    return this.request('/auth/register/artist', {
      method: 'POST',
      body: JSON.stringify(artistData)
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  // Artist methods
  async getArtists(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/artists?${queryString}`);
  }

  async getFeaturedArtists() {
    return this.request('/artists/featured');
  }

  async getArtist(id) {
    return this.request(`/artists/${id}`);
  }

  async followArtist(artistId) {
    return this.request(`/artists/${artistId}/follow`, {
      method: 'POST'
    });
  }

  async getArtistStats(artistId) {
    return this.request(`/artists/${artistId}/stats`);
  }

  // Verification badge methods
  async getArtistVerificationStatus(artistId) {
    return this.request(`/artists/${artistId}/verification-status`);
  }

  async getVerificationStats() {
    return this.request('/artists/verification/stats');
  }

  async updateArtistProfile(profileData) {
    return this.request('/artists/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Artwork methods
  async getArtworks(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/artworks?${queryString}`);
  }

  async getFeaturedArtworks() {
    return this.request('/artworks/featured/highlights');
  }

  async getArtwork(id) {
    return this.request(`/artworks/${id}`);
  }

  async getArtworksByArtform(artform, limit = 8) {
    return this.request(`/artworks/artform/${artform}?limit=${limit}`);
  }

  async createArtwork(artworkData) {
    return this.request('/artworks', {
      method: 'POST',
      body: JSON.stringify(artworkData)
    });
  }

  async likeArtwork(artworkId) {
    return this.request(`/artworks/${artworkId}/like`, {
      method: 'POST'
    });
  }

  async commentOnArtwork(artworkId, text) {
    return this.request(`/artworks/${artworkId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
  }

  // User methods
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getFavoriteArtworks() {
    return this.request('/users/favorites');
  }

  async getFollowingArtists() {
    return this.request('/users/following');
  }

  async getRecommendations() {
    return this.request('/users/recommendations');
  }

  // Search methods
  async search(query, type = 'all') {
    const params = { search: query };
    
    switch (type) {
      case 'artists':
        return this.getArtists(params);
      case 'artworks':
        return this.getArtworks(params);
      default:
        // Search both artists and artworks
        const [artists, artworks] = await Promise.all([
          this.getArtists(params),
          this.getArtworks(params)
        ]);
        return { artists: artists.artists, artworks: artworks.artworks };
    }
  }
}

// Create global API instance
window.API = new ApiService();

// Sample data for demo purposes (when backend is not available)
window.SampleData = {
  artforms: [
    {
      name: 'Warli',
      description: 'Ancient tribal art from Maharashtra featuring geometric patterns and nature motifs',
      icon: 'fas fa-tree',
      artistCount: 45,
      artworkCount: 120,
      color: '#FF6B35'
    },
    {
      name: 'Pithora',
      description: 'Vibrant wall paintings from Gujarat depicting horses and ceremonial themes',
      icon: 'fas fa-horse',
      artistCount: 28,
      artworkCount: 85,
      color: '#2A9D8F'
    },
    {
      name: 'Madhubani',
      description: 'Bihar\'s intricate art featuring Hindu deities, nature, and social themes',
      icon: 'fas fa-leaf',
      artistCount: 52,
      artworkCount: 150,
      color: '#F4A261'
    },
    {
      name: 'Gond',
      description: 'Dot-based art from Central India showcasing tribal mythology and folklore',
      icon: 'fas fa-circle',
      artistCount: 35,
      artworkCount: 95,
      color: '#7B2CBF'
    },
    {
      name: 'Kalamkari',
      description: 'Hand-painted textiles from Andhra Pradesh with mythological narratives',
      icon: 'fas fa-feather',
      artistCount: 22,
      artworkCount: 68,
      color: '#E07A5F'
    },
    {
      name: 'Patachitra',
      description: 'Traditional scroll paintings from Odisha depicting religious stories',
      icon: 'fas fa-scroll',
      artistCount: 18,
      artworkCount: 42,
      color: '#06A77D'
    }
  ],

  sampleArtists: [
    {
      _id: '1',
      name: 'Meera Devi',
      artform: 'Madhubani',
      location: { city: 'Madhubani', state: 'Bihar' },
      profileImage: null,
      bio: 'Master artist preserving the traditional Madhubani art for over 30 years',
      experience: 30,
      rating: 4.8,
      followers: [],
      artworks: ['1', '2', '3', '4', '5'],
      isVerified: true
    },
    {
      _id: '2',
      name: 'Ravi Bhil',
      artform: 'Warli',
      location: { city: 'Dahanu', state: 'Maharashtra' },
      profileImage: null,
      bio: 'Traditional Warli artist from the Warli tribe, creating authentic tribal art',
      experience: 25,
      rating: 4.9,
      followers: [],
      artworks: ['6', '7', '8'],
      isVerified: true
    },
    {
      _id: '3',
      name: 'Kiran Patel',
      artform: 'Pithora',
      location: { city: 'Vadodara', state: 'Gujarat' },
      profileImage: null,
      bio: 'Renowned Pithora artist known for vibrant ceremonial wall paintings',
      experience: 20,
      rating: 4.7,
      followers: [],
      artworks: ['9', '10', '11'],
      isVerified: true
    },
    {
      _id: '4',
      name: 'Priya Gond',
      artform: 'Gond',
      location: { city: 'Bhopal', state: 'Madhya Pradesh' },
      profileImage: null,
      bio: 'Young Gond artist bringing modern interpretations to traditional dot art',
      experience: 8,
      rating: 4.5,
      followers: [],
      artworks: ['12', '13'],
      isVerified: false
    },
    {
      _id: '5',
      name: 'Anita Kalamkari',
      artform: 'Kalamkari',
      location: { city: 'Machilipatnam', state: 'Andhra Pradesh' },
      profileImage: null,
      bio: 'Traditional Kalamkari artist specializing in mythological narratives',
      experience: 15,
      rating: 4.6,
      followers: [],
      artworks: ['14', '15', '16'],
      isVerified: true
    },
    {
      _id: '6',
      name: 'Rajesh Patachitra',
      artform: 'Patachitra',
      location: { city: 'Puri', state: 'Odisha' },
      profileImage: null,
      bio: 'Scroll painting artist preserving ancient religious stories',
      experience: 12,
      rating: 4.4,
      followers: [],
      artworks: ['17'],
      isVerified: false
    }
  ],

  verificationStats: {
    totalArtists: 6,
    verifiedArtists: 4,
    artistsWith3PlusArtworks: 5,
    verificationRate: 66.7
  },

  sampleArtworks: [
    {
      _id: '1',
      title: 'Village Life',
      description: 'Traditional Warli painting depicting daily village activities',
      artform: 'Warli',
      artist: {
        _id: '2',
        name: 'Ravi Bhil',
        profileImage: null,
        artform: 'Warli',
        isVerified: true
      },
      images: [{ url: null, caption: 'Village Life Warli Painting' }],
      likes: [],
      views: 245,
      comments: [],
      featured: true,
      price: 5000,
      isForSale: true
    },
    {
      _id: '2',
      title: 'Goddess Lakshmi',
      description: 'Beautiful Madhubani painting of Goddess Lakshmi with traditional motifs',
      artform: 'Madhubani',
      artist: {
        _id: '1',
        name: 'Meera Devi',
        profileImage: null,
        artform: 'Madhubani',
        isVerified: true
      },
      images: [{ url: null, caption: 'Goddess Lakshmi Madhubani Art' }],
      likes: [],
      views: 320,
      comments: [],
      featured: true,
      price: 8000,
      isForSale: true
    },
    {
      _id: '3',
      title: 'Sacred Horses',
      description: 'Vibrant Pithora painting featuring sacred horses in ceremonial setting',
      artform: 'Pithora',
      artist: {
        _id: '3',
        name: 'Kiran Patel',
        profileImage: null,
        artform: 'Pithora',
        isVerified: true
      },
      images: [{ url: null, caption: 'Sacred Horses Pithora Art' }],
      likes: [],
      views: 180,
      comments: [],
      featured: true,
      price: 6500,
      isForSale: true
    },
    {
      _id: '4',
      title: 'Tree of Life',
      description: 'Traditional Madhubani tree of life with birds and animals',
      artform: 'Madhubani',
      artist: {
        _id: '1',
        name: 'Meera Devi',
        profileImage: null,
        artform: 'Madhubani',
        isVerified: true
      },
      images: [{ url: null, caption: 'Tree of Life Madhubani Art' }],
      likes: [],
      views: 156,
      comments: [],
      featured: false,
      price: 6000,
      isForSale: true
    },
    {
      _id: '5',
      title: 'Wedding Ceremony',
      description: 'Traditional Madhubani wedding scene with intricate details',
      artform: 'Madhubani',
      artist: {
        _id: '1',
        name: 'Meera Devi',
        profileImage: null,
        artform: 'Madhubani',
        isVerified: true
      },
      images: [{ url: null, caption: 'Wedding Ceremony Madhubani Art' }],
      likes: [],
      views: 198,
      comments: [],
      featured: false,
      price: 7500,
      isForSale: true
    }
  ]
};