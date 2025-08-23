// UI Components for Kala Heritage Platform

// Component factory for creating reusable UI elements
class ComponentFactory {
  
  // Create artform card
  static createArtformCard(artform) {
    return `
      <div class="artform-card interactive-card hover-lift" data-artform="${artform.name}">
        <div class="artform-image" style="background: linear-gradient(135deg, ${artform.color}20, ${artform.color}40)">
          <i class="${artform.icon}" style="color: ${artform.color}"></i>
        </div>
        <div class="artform-content">
          <h3 class="artform-title">${artform.name}</h3>
          <p class="artform-description">${artform.description}</p>
          <div class="artform-stats">
            <div class="artform-stat">
              <div class="artform-stat-number">${artform.artistCount}</div>
              <div class="artform-stat-label">Artists</div>
            </div>
            <div class="artform-stat">
              <div class="artform-stat-number">${artform.artworkCount}</div>
              <div class="artform-stat-label">Artworks</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create artist card
  static createArtistCard(artist) {
    const avatar = artist.profileImage 
      ? `<img src="${artist.profileImage}" alt="${artist.name}">` 
      : `<div style="font-size: 3rem; color: white;">${Utils.generateAvatar(artist.name)}</div>`;
    
    const location = artist.location 
      ? `${artist.location.city}, ${artist.location.state}` 
      : 'Location not specified';

    const verificationBadge = artist.isVerified 
      ? '<div class="verified-badge" title="Verified Artist - Has uploaded 3+ artworks"><i class="fas fa-check-circle"></i> Verified</div>' 
      : '';

    return `
      <div class="artist-card interactive-card hover-lift" data-artist-id="${artist._id}">
        ${verificationBadge}
        <div class="artist-image">
          ${avatar}
        </div>
        <div class="artist-content">
          <h3 class="artist-name">
            ${artist.name}
            ${artist.isVerified ? '<i class="fas fa-check-circle verified-icon" title="Verified Artist"></i>' : ''}
          </h3>
          <div class="artist-artform">${artist.artform}</div>
          <div class="artist-location">
            <i class="fas fa-map-marker-alt"></i>
            ${location}
          </div>
          <div class="artist-stats">
            <div class="artist-rating">
              <i class="fas fa-star"></i>
              <span>${artist.rating || 0}</span>
            </div>
            <div class="artist-followers">
              ${artist.followers?.length || 0} followers
            </div>
            <div class="artist-artworks">
              <i class="fas fa-palette"></i>
              ${artist.artworks?.length || 0} artworks
            </div>
          </div>
          ${!artist.isVerified ? '<div class="verification-progress">Upload 3+ artworks to get verified</div>' : ''}
        </div>
      </div>
    `;
  }

  // Create artwork card
  static createArtworkCard(artwork) {
    const image = artwork.images?.[0]?.url 
      ? `<img src="${artwork.images[0].url}" alt="${artwork.title}">` 
      : `<i class="fas fa-image"></i>`;

    return `
      <div class="artwork-card interactive-card hover-lift" data-artwork-id="${artwork._id}">
        <div class="artwork-image">
          ${image}
          <div class="artwork-overlay">
            <i class="fas fa-eye"></i>
          </div>
        </div>
        <div class="artwork-content">
          <h3 class="artwork-title">${artwork.title}</h3>
          <div class="artwork-artist">by ${artwork.artist.name}</div>
          <div class="artwork-stats">
            <div class="artwork-likes">
              <i class="fas fa-heart"></i>
              <span>${artwork.likes?.length || 0}</span>
            </div>
            <div class="artwork-views">
              <i class="fas fa-eye"></i>
              <span>${artwork.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create artwork detail modal content
  static createArtworkDetail(artwork) {
    const image = artwork.images?.[0]?.url 
      ? `<img src="${artwork.images[0].url}" alt="${artwork.title}">` 
      : `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 4rem; color: var(--gray);"><i class="fas fa-image"></i></div>`;

    const artistAvatar = artwork.artist.profileImage 
      ? `<img src="${artwork.artist.profileImage}" alt="${artwork.artist.name}">` 
      : `<div class="artist-avatar">${Utils.generateAvatar(artwork.artist.name)}</div>`;

    return `
      <div class="artwork-detail">
        <div class="artwork-detail-image">
          ${image}
        </div>
        <div class="artwork-detail-info">
          <h2>${artwork.title}</h2>
          
          <div class="artwork-artist-info">
            ${artistAvatar}
            <div class="artist-info">
              <h4>${artwork.artist.name}</h4>
              <p>${artwork.artist.artform} Artist ${artwork.artist.isVerified ? '<i class="fas fa-check-circle" style="color: var(--secondary-green);"></i>' : ''}</p>
            </div>
          </div>

          <div class="artwork-actions">
            <button class="action-btn like-btn" data-artwork-id="${artwork._id}">
              <i class="fas fa-heart"></i>
              <span class="like-count">${artwork.likes?.length || 0}</span>
            </button>
            <button class="action-btn share-btn" data-artwork-id="${artwork._id}">
              <i class="fas fa-share"></i>
              Share
            </button>
            ${artwork.isForSale ? `
              <button class="action-btn price-btn">
                <i class="fas fa-tag"></i>
                ₹${artwork.price?.toLocaleString() || 'Price on request'}
              </button>
            ` : ''}
          </div>

          <div class="artwork-details-grid">
            <div class="detail-item">
              <div class="detail-label">Artform</div>
              <div class="detail-value">${artwork.artform}</div>
            </div>
            <div class="detail-item">
              <div class="detail-label">Views</div>
              <div class="detail-value">${artwork.views || 0}</div>
            </div>
            ${artwork.dimensions ? `
              <div class="detail-item">
                <div class="detail-label">Dimensions</div>
                <div class="detail-value">${artwork.dimensions.width} × ${artwork.dimensions.height} ${artwork.dimensions.unit}</div>
              </div>
            ` : ''}
            ${artwork.yearCreated ? `
              <div class="detail-item">
                <div class="detail-label">Year Created</div>
                <div class="detail-value">${artwork.yearCreated}</div>
              </div>
            ` : ''}
          </div>

          <div class="artwork-description">
            <p>${artwork.description}</p>
          </div>

          <div class="comments-section">
            <div class="comments-header">
              <h4>Comments (${artwork.comments?.length || 0})</h4>
            </div>
            
            ${Auth.isLoggedIn ? `
              <div class="comment-form">
                <textarea class="comment-input" placeholder="Share your thoughts about this artwork..."></textarea>
                <button class="comment-submit" data-artwork-id="${artwork._id}">
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            ` : `
              <p style="text-align: center; color: var(--gray); padding: var(--spacing-lg);">
                <a href="#" onclick="Utils.modal.show('auth-modal')" style="color: var(--primary-orange);">Login</a> to comment on this artwork
              </p>
            `}

            <div class="comments-list">
              ${artwork.comments?.map(comment => this.createComment(comment)).join('') || ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Create artist profile modal content
  static createArtistProfile(artist, stats) {
    const avatar = artist.profileImage 
      ? `<img src="${artist.profileImage}" alt="${artist.name}">` 
      : `<div style="font-size: 4rem; color: white;">${Utils.generateAvatar(artist.name)}</div>`;

    const location = artist.location 
      ? `${artist.location.city}, ${artist.location.state}` 
      : 'Location not specified';

    return `
      <div class="artist-profile">
        <div class="artist-profile-header">
          <div class="artist-profile-image">
            ${avatar}
          </div>
          <h2 class="artist-profile-name">${artist.name}</h2>
          <div class="artist-profile-artform">${artist.artform} Artist</div>
          ${artist.isVerified ? '<div style="color: var(--secondary-green); margin: var(--spacing-sm) 0;"><i class="fas fa-check-circle"></i> Verified Artist</div>' : ''}
          
          <div class="artist-profile-bio">
            <p>${artist.bio || 'No bio available'}</p>
          </div>

          ${Auth.isLoggedIn && Auth.currentUser.type === 'user' ? `
            <button class="btn btn-primary follow-btn" data-artist-id="${artist._id}">
              <i class="fas fa-user-plus"></i>
              ${artist.isFollowing ? 'Unfollow' : 'Follow'} Artist
            </button>
          ` : ''}
        </div>

        <div class="artist-profile-stats">
          <div class="profile-stat">
            <div class="profile-stat-number">${stats?.totalArtworks || 0}</div>
            <div class="profile-stat-label">Artworks</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-number">${stats?.followers || 0}</div>
            <div class="profile-stat-label">Followers</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-number">${stats?.totalViews || 0}</div>
            <div class="profile-stat-label">Views</div>
          </div>
          <div class="profile-stat">
            <div class="profile-stat-number">${stats?.totalLikes || 0}</div>
            <div class="profile-stat-label">Likes</div>
          </div>
        </div>

        <div class="artist-artworks-section">
          <h3>Recent Artworks</h3>
          <div class="artist-artworks-grid" id="artist-artworks-grid">
            <!-- Artworks will be loaded here -->
          </div>
        </div>
      </div>
    `;
  }

  // Create comment
  static createComment(comment) {
    const avatar = comment.user.profileImage 
      ? `<img src="${comment.user.profileImage}" alt="${comment.user.name}">` 
      : `<div class="comment-avatar">${Utils.generateAvatar(comment.user.name)}</div>`;

    return `
      <div class="comment-item">
        ${avatar}
        <div class="comment-content">
          <div class="comment-author">${comment.user.name}</div>
          <div class="comment-text">${comment.text}</div>
          <div class="comment-date">${Utils.formatRelativeTime(comment.createdAt)}</div>
        </div>
      </div>
    `;
  }

  // Create search result item
  static createSearchResult(item, type) {
    return `
      <div class="search-result-item" data-id="${item._id}" data-type="${type}">
        <div class="search-result-title">${item.name || item.title}</div>
        <div class="search-result-type">${type}</div>
      </div>
    `;
  }

  // Create verification status modal content
  static createVerificationStatusModal(verificationData) {
    const { isVerified, artworkCount, meetsCriteria, criteria } = verificationData;
    
    const progressPercentage = Math.min((artworkCount / criteria.requiredArtworks) * 100, 100);
    const progressColor = meetsCriteria ? 'var(--success)' : 'var(--primary)';
    
    return `
      <div class="verification-status-modal">
        <div class="verification-header">
          <h3>Verification Status</h3>
          ${isVerified ? 
            '<div class="verification-success"><i class="fas fa-check-circle"></i> Verified Artist</div>' : 
            '<div class="verification-pending"><i class="fas fa-clock"></i> Pending Verification</div>'
          }
        </div>
        
        <div class="verification-progress-section">
          <div class="progress-info">
            <span>Artworks Uploaded: ${artworkCount}/${criteria.requiredArtworks}</span>
            <span class="progress-percentage">${progressPercentage.toFixed(0)}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${progressPercentage}%; background-color: ${progressColor}"></div>
          </div>
        </div>
        
        <div class="verification-criteria">
          <h4>Verification Criteria</h4>
          <ul>
            <li class="${artworkCount >= criteria.requiredArtworks ? 'completed' : ''}">
              <i class="fas ${artworkCount >= criteria.requiredArtworks ? 'fa-check' : 'fa-circle'}"></i>
              Upload at least ${criteria.requiredArtworks} published artworks
            </li>
          </ul>
        </div>
        
        ${!isVerified ? `
          <div class="verification-tip">
            <i class="fas fa-lightbulb"></i>
            <p>Keep uploading quality artworks to earn your verification badge and build trust with the community!</p>
          </div>
        ` : `
          <div class="verification-benefits">
            <h4>Verification Benefits</h4>
            <ul>
              <li><i class="fas fa-star"></i> Verified badge displayed on your profile</li>
              <li><i class="fas fa-eye"></i> Increased visibility in search results</li>
              <li><i class="fas fa-users"></i> Higher trust from art enthusiasts</li>
              <li><i class="fas fa-trophy"></i> Access to exclusive features</li>
            </ul>
          </div>
        `}
      </div>
    `;
  }

  // Create verification statistics modal content
  static createVerificationStatsModal(stats) {
    const { totalArtists, verifiedArtists, artistsWith3PlusArtworks, verificationRate } = stats;
    
    return `
      <div class="verification-stats-modal">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${totalArtists}</div>
              <div class="stat-label">Total Artists</div>
            </div>
          </div>
          
          <div class="stat-card verified">
            <div class="stat-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${verifiedArtists}</div>
              <div class="stat-label">Verified Artists</div>
            </div>
          </div>
          
          <div class="stat-card pending">
            <div class="stat-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${artistsWith3PlusArtworks}</div>
              <div class="stat-label">Eligible for Verification</div>
            </div>
          </div>
          
          <div class="stat-card rate">
            <div class="stat-icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="stat-content">
              <div class="stat-number">${verificationRate}%</div>
              <div class="stat-label">Verification Rate</div>
            </div>
          </div>
        </div>
        
        <div class="stats-chart">
          <h4>Verification Progress</h4>
          <div class="chart-container">
            <div class="chart-bar">
              <div class="chart-fill verified-fill" style="width: ${(verifiedArtists / totalArtists) * 100}%"></div>
              <div class="chart-fill pending-fill" style="width: ${((artistsWith3PlusArtworks - verifiedArtists) / totalArtists) * 100}%"></div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color verified"></span>
                <span>Verified (${verifiedArtists})</span>
              </div>
              <div class="legend-item">
                <span class="legend-color pending"></span>
                <span>Pending (${artistsWith3PlusArtworks - verifiedArtists})</span>
              </div>
              <div class="legend-item">
                <span class="legend-color unverified"></span>
                <span>Unverified (${totalArtists - artistsWith3PlusArtworks})</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="stats-insights">
          <h4>Platform Insights</h4>
          <div class="insights-grid">
            <div class="insight-item">
              <i class="fas fa-trending-up"></i>
              <div>
                <h5>Growing Community</h5>
                <p>${totalArtists} artists are actively sharing their traditional art</p>
              </div>
            </div>
            <div class="insight-item">
              <i class="fas fa-shield-alt"></i>
              <div>
                <h5>Quality Assurance</h5>
                <p>${verificationRate}% of artists have earned verification through quality contributions</p>
              </div>
            </div>
            <div class="insight-item">
              <i class="fas fa-heart"></i>
              <div>
                <h5>Community Trust</h5>
                <p>Verified artists receive ${Math.round(verificationRate * 1.5)}% more engagement</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Search functionality
class SearchManager {
  constructor() {
    this.searchOverlay = document.getElementById('search-overlay');
    this.searchInput = document.getElementById('search-input');
    this.searchResults = document.getElementById('search-results');
    this.searchBtn = document.getElementById('search-btn');
    this.searchClose = document.getElementById('search-close');
    
    this.setupEventListeners();
    this.debouncedSearch = Utils.debounce(this.performSearch.bind(this), 300);
  }

  setupEventListeners() {
    // Show search overlay
    this.searchBtn.addEventListener('click', () => {
      this.show();
    });

    // Hide search overlay
    this.searchClose.addEventListener('click', () => {
      this.hide();
    });

    // Search input
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      if (query.length > 2) {
        this.debouncedSearch(query);
      } else {
        this.clearResults();
      }
    });

    // Handle search result clicks
    this.searchResults.addEventListener('click', (e) => {
      const resultItem = e.target.closest('.search-result-item');
      if (resultItem) {
        const id = resultItem.dataset.id;
        const type = resultItem.dataset.type;
        
        this.hide();
        
        if (type === 'artist') {
          this.showArtistDetail(id);
        } else if (type === 'artwork') {
          this.showArtworkDetail(id);
        }
      }
    });

    // Close search with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.searchOverlay.classList.contains('active')) {
        this.hide();
      }
    });
  }

  show() {
    this.searchOverlay.classList.add('active');
    this.searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  hide() {
    this.searchOverlay.classList.remove('active');
    this.searchInput.value = '';
    this.clearResults();
    document.body.style.overflow = '';
  }

  async performSearch(query) {
    try {
      // For demo, use sample data
      const results = this.searchSampleData(query);
      this.displayResults(results);
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults.innerHTML = '<p style="text-align: center; color: var(--gray); padding: var(--spacing-lg);">Search failed. Please try again.</p>';
    }
  }

  searchSampleData(query) {
    const queryLower = query.toLowerCase();
    
    const artistResults = SampleData.sampleArtists.filter(artist => 
      artist.name.toLowerCase().includes(queryLower) ||
      artist.artform.toLowerCase().includes(queryLower) ||
      artist.bio.toLowerCase().includes(queryLower)
    );

    const artworkResults = SampleData.sampleArtworks.filter(artwork => 
      artwork.title.toLowerCase().includes(queryLower) ||
      artwork.description.toLowerCase().includes(queryLower) ||
      artwork.artform.toLowerCase().includes(queryLower)
    );

    return { artists: artistResults, artworks: artworkResults };
  }

  displayResults(results) {
    let html = '';

    if (results.artists.length === 0 && results.artworks.length === 0) {
      html = '<p style="text-align: center; color: var(--gray); padding: var(--spacing-lg);">No results found. Try different keywords.</p>';
    } else {
      if (results.artists.length > 0) {
        html += '<h4 style="padding: var(--spacing-md) var(--spacing-lg); color: var(--secondary-blue); margin: 0;">Artists</h4>';
        results.artists.forEach(artist => {
          html += ComponentFactory.createSearchResult(artist, 'artist');
        });
      }

      if (results.artworks.length > 0) {
        html += '<h4 style="padding: var(--spacing-md) var(--spacing-lg); color: var(--secondary-blue); margin: 0;">Artworks</h4>';
        results.artworks.forEach(artwork => {
          html += ComponentFactory.createSearchResult(artwork, 'artwork');
        });
      }
    }

    this.searchResults.innerHTML = html;
  }

  clearResults() {
    this.searchResults.innerHTML = '';
  }

  async showArtistDetail(artistId) {
    const artist = SampleData.sampleArtists.find(a => a._id === artistId);
    if (artist) {
      const stats = {
        totalArtworks: 12,
        followers: 45,
        totalViews: 1250,
        totalLikes: 89
      };
      
      const artistModal = document.getElementById('artist-modal');
      const artistModalBody = document.getElementById('artist-modal-body');
      
      artistModalBody.innerHTML = ComponentFactory.createArtistProfile(artist, stats);
      Utils.modal.show('artist-modal');
    }
  }

  async showArtworkDetail(artworkId) {
    const artwork = SampleData.sampleArtworks.find(a => a._id === artworkId);
    if (artwork) {
      const artworkModal = document.getElementById('artwork-modal');
      const artworkModalBody = document.getElementById('artwork-modal-body');
      
      artworkModalBody.innerHTML = ComponentFactory.createArtworkDetail(artwork);
      Utils.modal.show('artwork-modal');
      
      // Setup artwork interactions
      this.setupArtworkInteractions(artwork);
    }
  }

  setupArtworkInteractions(artwork) {
    // Like button
    const likeBtn = document.querySelector('.like-btn');
    if (likeBtn) {
      likeBtn.addEventListener('click', async () => {
        if (!Auth.isLoggedIn) {
          Utils.modal.show('auth-modal');
          return;
        }

        try {
          // Simulate like action
          const isLiked = likeBtn.classList.contains('liked');
          const likeCount = parseInt(likeBtn.querySelector('.like-count').textContent);
          
          if (isLiked) {
            likeBtn.classList.remove('liked');
            likeBtn.querySelector('.like-count').textContent = likeCount - 1;
            Utils.toast.show('Removed from favorites', 'info');
          } else {
            likeBtn.classList.add('liked');
            likeBtn.querySelector('.like-count').textContent = likeCount + 1;
            Utils.toast.show('Added to favorites', 'success');
          }
        } catch (error) {
          Utils.toast.show('Error updating favorites', 'error');
        }
      });
    }

    // Comment submission
    const commentSubmit = document.querySelector('.comment-submit');
    if (commentSubmit) {
      commentSubmit.addEventListener('click', async () => {
        const commentInput = document.querySelector('.comment-input');
        const text = commentInput.value.trim();
        
        if (!text) {
          Utils.toast.show('Please enter a comment', 'warning');
          return;
        }

        try {
          // Simulate comment submission
          const newComment = {
            user: { name: Auth.currentUser.name, profileImage: null },
            text: text,
            createdAt: new Date()
          };

          const commentsList = document.querySelector('.comments-list');
          commentsList.insertAdjacentHTML('afterbegin', ComponentFactory.createComment(newComment));
          
          commentInput.value = '';
          Utils.toast.show('Comment added successfully', 'success');
        } catch (error) {
          Utils.toast.show('Error adding comment', 'error');
        }
      });
    }

    // Share button
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        Utils.copyToClipboard(url);
        Utils.toast.show('Link copied to clipboard!', 'success');
      });
    }
  }
}

// Gallery filter functionality
class GalleryManager {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.galleryGrid = document.getElementById('gallery-grid');
    this.currentFilter = 'all';
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        this.setActiveFilter(btn);
        this.filterArtworks(filter);
      });
    });
  }

  setActiveFilter(activeBtn) {
    this.filterBtns.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  async filterArtworks(filter) {
    this.currentFilter = filter;
    
    try {
      Utils.loading.show();
      
      // For demo, filter sample data
      let artworks = SampleData.sampleArtworks;
      if (filter !== 'all') {
        artworks = artworks.filter(artwork => artwork.artform === filter);
      }
      
      this.displayArtworks(artworks);
    } catch (error) {
      Utils.toast.show('Error filtering artworks', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  displayArtworks(artworks) {
    if (artworks.length === 0) {
      this.galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--spacing-3xl); color: var(--gray);">
          <i class="fas fa-search" style="font-size: 3rem; margin-bottom: var(--spacing-lg); opacity: 0.5;"></i>
          <p>No artworks found for this category.</p>
        </div>
      `;
      return;
    }

    const html = artworks.map((artwork, index) => {
      const card = ComponentFactory.createArtworkCard(artwork);
      return `<div class="scroll-reveal stagger-${(index % 6) + 1}">${card}</div>`;
    }).join('');

    this.galleryGrid.innerHTML = html;
    
    // Reinitialize scroll reveal for new elements
    setTimeout(() => {
      new Utils.ScrollReveal();
    }, 100);

    // Setup artwork click handlers
    this.setupArtworkClickHandlers();
  }

  setupArtworkClickHandlers() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    artworkCards.forEach(card => {
      card.addEventListener('click', () => {
        const artworkId = card.dataset.artworkId;
        const search = new SearchManager();
        search.showArtworkDetail(artworkId);
      });
    });
  }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Register modals
  Utils.modal.register('artwork-modal', document.getElementById('artwork-modal'));
  Utils.modal.register('artist-modal', document.getElementById('artist-modal'));

  // Setup modal close buttons
  document.getElementById('artwork-modal-close').addEventListener('click', () => {
    Utils.modal.hide('artwork-modal');
  });

  document.getElementById('artist-modal-close').addEventListener('click', () => {
    Utils.modal.hide('artist-modal');
  });

  // Initialize search and gallery
  window.Search = new SearchManager();
  window.Gallery = new GalleryManager();

  // Make ComponentFactory globally available
  window.ComponentFactory = ComponentFactory;
});