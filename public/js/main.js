// Main Application Logic for Kala Heritage Platform

class KalaHeritageApp {
  constructor() {
    this.isInitialized = false;
    this.init();
  }

  async init() {
    if (this.isInitialized) return;
    
    try {
      // Wait for DOM to be fully loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
        return;
      }

      Utils.loading.show();
      
      // Initialize core components
      this.setupNavigation();
      this.setupHeroSection();
      this.loadInitialData();
      this.setupScrollEffects();
      this.setupMobileMenu();
      
      this.isInitialized = true;
      
      // Add entrance animations
      setTimeout(() => {
        document.body.classList.add('loaded');
        this.animateElements();
      }, 500);

    } catch (error) {
      console.error('App initialization failed:', error);
      Utils.toast.show('Failed to initialize application', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  setupNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          Utils.scrollToElement(targetElement);
          
          // Update active nav link
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    });

    // Navbar scroll effect
    const handleScroll = Utils.throttle(() => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Update active nav link based on scroll position
      this.updateActiveNavLink();
    }, 100);

    window.addEventListener('scroll', handleScroll);
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupHeroSection() {
    const exploreBtn = document.getElementById('explore-btn');
    const joinBtn = document.getElementById('join-btn');
    const verificationStatsBtn = document.getElementById('verification-stats-btn');

    exploreBtn.addEventListener('click', () => {
      const artformsSection = document.getElementById('artforms');
      Utils.scrollToElement(artformsSection);
    });

    joinBtn.addEventListener('click', () => {
      Utils.modal.show('auth-modal');
    });

    verificationStatsBtn.addEventListener('click', () => {
      this.showVerificationStats();
    });

    // Animate hero stats
    this.animateCounters();
  }

  async loadInitialData() {
    try {
      // Load artforms
      this.loadArtforms();
      
      // Load featured artists
      await this.loadFeaturedArtists();
      
      // Load featured artworks
      await this.loadFeaturedArtworks();
      
      // Setup view all buttons
      this.setupViewAllButtons();
      
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  loadArtforms() {
    const artformsGrid = document.getElementById('artforms-grid');
    
    const html = SampleData.artforms.map((artform, index) => {
      const card = ComponentFactory.createArtformCard(artform);
      return `<div class="scroll-reveal stagger-${(index % 3) + 1}">${card}</div>`;
    }).join('');

    artformsGrid.innerHTML = html;

    // Setup artform click handlers
    const artformCards = document.querySelectorAll('.artform-card');
    artformCards.forEach(card => {
      card.addEventListener('click', () => {
        const artform = card.dataset.artform;
        this.showArtformGallery(artform);
      });
    });
  }

  async loadFeaturedArtists() {
    const featuredArtistsGrid = document.getElementById('featured-artists');
    
    try {
      // Use sample data for demo
      const artists = SampleData.sampleArtists;
      
      const html = artists.map((artist, index) => {
        const card = ComponentFactory.createArtistCard(artist);
        return `<div class="scroll-reveal stagger-${(index % 3) + 1}">${card}</div>`;
      }).join('');

      featuredArtistsGrid.innerHTML = html;

      // Setup artist click handlers
      this.setupArtistClickHandlers();
      
    } catch (error) {
      console.error('Error loading featured artists:', error);
      featuredArtistsGrid.innerHTML = '<p style="text-align: center; color: var(--gray);">Error loading featured artists</p>';
    }
  }

  async loadFeaturedArtworks() {
    const galleryGrid = document.getElementById('gallery-grid');
    
    try {
      // Use sample data for demo
      const artworks = SampleData.sampleArtworks;
      
      const html = artworks.map((artwork, index) => {
        const card = ComponentFactory.createArtworkCard(artwork);
        return `<div class="scroll-reveal stagger-${(index % 3) + 1}">${card}</div>`;
      }).join('');

      galleryGrid.innerHTML = html;

      // Setup artwork click handlers
      this.setupArtworkClickHandlers();
      
    } catch (error) {
      console.error('Error loading featured artworks:', error);
      galleryGrid.innerHTML = '<p style="text-align: center; color: var(--gray);">Error loading featured artworks</p>';
    }
  }

  setupArtistClickHandlers() {
    const artistCards = document.querySelectorAll('.artist-card');
    artistCards.forEach(card => {
      card.addEventListener('click', () => {
        const artistId = card.dataset.artistId;
        this.showArtistProfile(artistId);
      });
    });

    // Add verification badge click handlers
    const verificationBadges = document.querySelectorAll('.verified-badge');
    verificationBadges.forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const artistCard = badge.closest('.artist-card');
        const artistId = artistCard.dataset.artistId;
        this.showVerificationStatus(artistId);
      });
    });

    // Add verification progress click handlers
    const verificationProgress = document.querySelectorAll('.verification-progress');
    verificationProgress.forEach(progress => {
      progress.addEventListener('click', (e) => {
        e.stopPropagation();
        const artistCard = progress.closest('.artist-card');
        const artistId = artistCard.dataset.artistId;
        this.showVerificationStatus(artistId);
      });
    });
  }

  async showVerificationStatus(artistId) {
    try {
      Utils.loading.show();
      
      // Try to get real data from API, fallback to sample data
      let verificationData;
      try {
        verificationData = await API.getArtistVerificationStatus(artistId);
      } catch (error) {
        console.log('Using sample verification data');
        // Find artist in sample data
        const artist = SampleData.sampleArtists.find(a => a._id === artistId);
        if (artist) {
          verificationData = {
            isVerified: artist.isVerified,
            artworkCount: artist.artworks.length,
            meetsCriteria: artist.artworks.length >= 3,
            criteria: {
              requiredArtworks: 3,
              currentArtworks: artist.artworks.length
            }
          };
        } else {
          throw new Error('Artist not found');
        }
      }
      
      const modalContent = ComponentFactory.createVerificationStatusModal(verificationData);
      
      Utils.modal.show('verification-modal', {
        title: 'Verification Status',
        content: modalContent,
        size: 'medium'
      });
    } catch (error) {
      console.error('Error loading verification status:', error);
      Utils.toast.show('Failed to load verification status', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  async showArtistProfile(artistId) {
    try {
      Utils.loading.show();
      const artist = await API.getArtist(artistId);
      
      const modalContent = ComponentFactory.createArtistProfileModal(artist);
      
      Utils.modal.show('artist-profile-modal', {
        title: `${artist.name}'s Profile`,
        content: modalContent,
        size: 'large'
      });
    } catch (error) {
      console.error('Error loading artist profile:', error);
      Utils.toast.show('Failed to load artist profile', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  async showVerificationStats() {
    try {
      Utils.loading.show();
      
      // Try to get real data from API, fallback to sample data
      let stats;
      try {
        stats = await API.getVerificationStats();
      } catch (error) {
        console.log('Using sample verification stats');
        stats = SampleData.verificationStats;
      }
      
      const modalContent = ComponentFactory.createVerificationStatsModal(stats);
      
      Utils.modal.show('verification-stats-modal', {
        title: 'Verification Statistics',
        content: modalContent,
        size: 'medium'
      });
    } catch (error) {
      console.error('Error loading verification stats:', error);
      Utils.toast.show('Failed to load verification statistics', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  setupArtworkClickHandlers() {
    const artworkCards = document.querySelectorAll('.artwork-card');
    artworkCards.forEach(card => {
      card.addEventListener('click', () => {
        const artworkId = card.dataset.artworkId;
        Search.showArtworkDetail(artworkId);
      });
    });
  }

  setupViewAllButtons() {
    const viewAllArtistsBtn = document.getElementById('view-all-artists');
    const viewAllArtworksBtn = document.getElementById('view-all-artworks');

    viewAllArtistsBtn.addEventListener('click', () => {
      Utils.toast.show('Artists directory coming soon!', 'info');
    });

    viewAllArtworksBtn.addEventListener('click', () => {
      Utils.toast.show('Full gallery coming soon!', 'info');
    });
  }

  showArtformGallery(artform) {
    // Filter gallery by artform
    const filterBtn = document.querySelector(`[data-filter="${artform}"]`);
    if (filterBtn) {
      filterBtn.click();
      
      // Scroll to gallery section
      const gallerySection = document.getElementById('gallery');
      Utils.scrollToElement(gallerySection);
    }
  }

  setupScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroPattern = document.querySelector('.hero-pattern');

    const handleParallax = Utils.throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (heroPattern && scrolled < hero.offsetHeight) {
        heroPattern.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
      }
    }, 16);

    window.addEventListener('scroll', handleParallax);

    // Intersection Observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
      sectionObserver.observe(section);
    });
  }

  setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      mobileMenuBtn.classList.toggle('active');
      
      // Animate hamburger icon
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('mobile-active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
      });
    });
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
      const target = parseInt(counter.textContent.replace(/\D/g, ''));
      const increment = target / 100;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = counter.textContent.includes('+') ? `${target}+` : target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, 20);
    };

    // Trigger animation when stats come into view
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          animateCounter(counter);
          statsObserver.unobserve(counter);
        }
      });
    });

    counters.forEach(counter => {
      statsObserver.observe(counter);
    });
  }

  animateElements() {
    // Add entrance animations to various elements
    const elementsToAnimate = [
      { selector: '.hero-title', animation: 'animate-slide-up', delay: 0 },
      { selector: '.hero-description', animation: 'animate-fade-in', delay: 200 },
      { selector: '.hero-actions', animation: 'animate-slide-up', delay: 400 },
      { selector: '.hero-stats', animation: 'animate-slide-right', delay: 600 }
    ];

    elementsToAnimate.forEach(({ selector, animation, delay }) => {
      const element = document.querySelector(selector);
      if (element) {
        setTimeout(() => {
          element.classList.add(animation);
        }, delay);
      }
    });
  }

  // Method to refresh data (useful for real-time updates)
  async refreshData() {
    try {
      Utils.loading.show();
      await this.loadInitialData();
      Utils.toast.show('Data refreshed successfully', 'success');
    } catch (error) {
      Utils.toast.show('Error refreshing data', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  // Method to handle user interactions
  setupUserInteractions() {
    // Add to favorites functionality
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.like-btn') && Auth.isLoggedIn) {
        const btn = e.target.closest('.like-btn');
        const artworkId = btn.dataset.artworkId;
        
        try {
          const isLiked = btn.classList.contains('liked');
          const likeCount = parseInt(btn.querySelector('.like-count')?.textContent || '0');
          
          // Optimistic UI update
          if (isLiked) {
            btn.classList.remove('liked');
            if (btn.querySelector('.like-count')) {
              btn.querySelector('.like-count').textContent = likeCount - 1;
            }
          } else {
            btn.classList.add('liked');
            if (btn.querySelector('.like-count')) {
              btn.querySelector('.like-count').textContent = likeCount + 1;
            }
          }

          // In a real app, this would make an API call
          // await API.likeArtwork(artworkId);
          
        } catch (error) {
          // Revert UI on error
          if (btn.classList.contains('liked')) {
            btn.classList.remove('liked');
          } else {
            btn.classList.add('liked');
          }
          Utils.toast.show('Error updating favorites', 'error');
        }
      }
    });

    // Follow artist functionality
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.follow-btn') && Auth.isLoggedIn) {
        const btn = e.target.closest('.follow-btn');
        const artistId = btn.dataset.artistId;
        
        try {
          const isFollowing = btn.textContent.includes('Unfollow');
          
          // Optimistic UI update
          if (isFollowing) {
            btn.innerHTML = '<i class="fas fa-user-plus"></i> Follow Artist';
            Utils.toast.show('Artist unfollowed', 'info');
          } else {
            btn.innerHTML = '<i class="fas fa-user-check"></i> Unfollow Artist';
            Utils.toast.show('Artist followed', 'success');
          }

          // In a real app, this would make an API call
          // await API.followArtist(artistId);
          
        } catch (error) {
          // Revert UI on error
          Utils.toast.show('Error updating follow status', 'error');
        }
      }
    });
  }

  // Demo data population
  populateDemoData() {
    // Update hero stats with dynamic data
    const artistCount = document.getElementById('artist-count');
    const artworkCount = document.getElementById('artwork-count');
    
    if (artistCount) artistCount.textContent = `${SampleData.sampleArtists.length * 10}+`;
    if (artworkCount) artworkCount.textContent = `${SampleData.sampleArtworks.length * 15}+`;
  }

  // Add interactive features
  addInteractiveFeatures() {
    // Add hover effects to cards
    document.querySelectorAll('.interactive-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ripple = document.createElement('span');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s ease-out;
          pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Performance optimizations
  optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Preload critical resources
    this.preloadCriticalResources();
  }

  preloadCriticalResources() {
    // Preload fonts
    const fontUrls = [
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700',
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700'
    ];

    fontUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = url;
      document.head.appendChild(link);
    });
  }

  // Error handling
  setupErrorHandling() {
    window.addEventListener('error', (e) => {
      console.error('Global error:', e.error);
      Utils.toast.show('An unexpected error occurred', 'error');
    });

    window.addEventListener('unhandledrejection', (e) => {
      console.error('Unhandled promise rejection:', e.reason);
      Utils.toast.show('An unexpected error occurred', 'error');
    });
  }

  // Analytics and tracking (placeholder)
  trackUserInteraction(action, data = {}) {
    // In a real app, this would send data to analytics service
    console.log('User interaction:', action, data);
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  window.App = new KalaHeritageApp();
  
  // Add ripple effect styles
  const rippleStyles = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .mobile-active {
      display: flex !important;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--white);
      box-shadow: var(--shadow-lg);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      padding: var(--spacing-lg);
      gap: var(--spacing-md);
    }
    
    @media (max-width: 768px) {
      .nav-menu {
        display: none;
      }
      
      .nav-menu.mobile-active {
        display: flex;
      }
    }
  `;
  
  const styleSheet = document.createElement('style');
  styleSheet.textContent = rippleStyles;
  document.head.appendChild(styleSheet);

  // Setup user interactions
  App.setupUserInteractions();
  App.addInteractiveFeatures();
  App.populateDemoData();
  App.optimizePerformance();
  App.setupErrorHandling();
});

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}