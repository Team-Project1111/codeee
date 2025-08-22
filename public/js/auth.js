// Authentication Management for Kala Heritage Platform

class AuthManager {
  constructor() {
    this.currentUser = null;
    this.isLoggedIn = false;
    this.init();
  }

  async init() {
    // Check if user is already logged in
    const token = Utils.Storage.get('authToken');
    if (token) {
      API.setToken(token);
      try {
        const response = await API.getProfile();
        this.setUser(response.user);
      } catch (error) {
        // Token invalid, clear it
        this.logout();
      }
    }
    this.updateUI();
  }

  setUser(user) {
    this.currentUser = user;
    this.isLoggedIn = true;
    Utils.Storage.set('currentUser', user);
  }

  async login(email, password) {
    try {
      Utils.loading.show();
      const response = await API.login(email, password);
      
      API.setToken(response.token);
      this.setUser(response.user);
      this.updateUI();
      
      Utils.modal.hide('auth-modal');
      Utils.toast.show(`Welcome back, ${response.user.name}!`, 'success');
      
      return response;
    } catch (error) {
      Utils.toast.show(error.message, 'error');
      throw error;
    } finally {
      Utils.loading.hide();
    }
  }

  async register(userData, userType) {
    try {
      Utils.loading.show();
      let response;
      
      if (userType === 'artist') {
        response = await API.registerArtist(userData);
      } else {
        response = await API.registerUser(userData);
      }
      
      API.setToken(response.token);
      this.setUser(response.user);
      this.updateUI();
      
      Utils.modal.hide('auth-modal');
      Utils.toast.show(`Welcome to Kala Heritage, ${response.user.name}!`, 'success');
      
      return response;
    } catch (error) {
      Utils.toast.show(error.message, 'error');
      throw error;
    } finally {
      Utils.loading.hide();
    }
  }

  logout() {
    this.currentUser = null;
    this.isLoggedIn = false;
    API.setToken(null);
    Utils.Storage.remove('currentUser');
    Utils.Storage.remove('authToken');
    this.updateUI();
    Utils.toast.show('Logged out successfully', 'info');
  }

  updateUI() {
    const authBtn = document.getElementById('auth-btn');
    
    if (this.isLoggedIn) {
      authBtn.innerHTML = `
        <div class="user-dropdown">
          <div class="user-avatar">
            ${Utils.generateAvatar(this.currentUser.name)}
          </div>
          <span>${this.currentUser.name}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
      `;
      authBtn.classList.add('logged-in');
      this.setupUserDropdown();
    } else {
      authBtn.innerHTML = `
        <i class="fas fa-user"></i>
        <span>Login</span>
      `;
      authBtn.classList.remove('logged-in');
    }
  }

  setupUserDropdown() {
    const authBtn = document.getElementById('auth-btn');
    
    // Remove existing dropdown
    const existingDropdown = document.querySelector('.user-dropdown-menu');
    if (existingDropdown) {
      existingDropdown.remove();
    }

    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown-menu';
    dropdown.innerHTML = `
      <div class="dropdown-header">
        <div class="user-info">
          <div class="user-avatar-large">
            ${Utils.generateAvatar(this.currentUser.name)}
          </div>
          <div>
            <div class="user-name">${this.currentUser.name}</div>
            <div class="user-type">${this.currentUser.type}</div>
          </div>
        </div>
      </div>
      <div class="dropdown-items">
        ${this.currentUser.type === 'user' ? `
          <a href="#" class="dropdown-item" data-action="favorites">
            <i class="fas fa-heart"></i>
            My Favorites
          </a>
          <a href="#" class="dropdown-item" data-action="following">
            <i class="fas fa-users"></i>
            Following Artists
          </a>
        ` : `
          <a href="#" class="dropdown-item" data-action="my-artworks">
            <i class="fas fa-palette"></i>
            My Artworks
          </a>
          <a href="#" class="dropdown-item" data-action="add-artwork">
            <i class="fas fa-plus"></i>
            Add Artwork
          </a>
        `}
        <a href="#" class="dropdown-item" data-action="profile">
          <i class="fas fa-user-cog"></i>
          Profile Settings
        </a>
        <div class="dropdown-divider"></div>
        <a href="#" class="dropdown-item" data-action="logout">
          <i class="fas fa-sign-out-alt"></i>
          Logout
        </a>
      </div>
    `;

    authBtn.appendChild(dropdown);

    // Handle dropdown actions
    dropdown.addEventListener('click', (e) => {
      e.preventDefault();
      const action = e.target.closest('.dropdown-item')?.dataset.action;
      
      switch (action) {
        case 'favorites':
          this.showFavorites();
          break;
        case 'following':
          this.showFollowing();
          break;
        case 'my-artworks':
          this.showMyArtworks();
          break;
        case 'add-artwork':
          this.showAddArtwork();
          break;
        case 'profile':
          this.showProfile();
          break;
        case 'logout':
          this.logout();
          break;
      }
      
      dropdown.classList.remove('show');
    });

    // Toggle dropdown
    authBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdown.classList.remove('show');
    });
  }

  async showFavorites() {
    try {
      Utils.loading.show();
      const favorites = await API.getFavoriteArtworks();
      // TODO: Show favorites in modal or dedicated page
      Utils.toast.show('Favorites feature coming soon!', 'info');
    } catch (error) {
      Utils.toast.show('Error loading favorites', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  async showFollowing() {
    try {
      Utils.loading.show();
      const following = await API.getFollowingArtists();
      // TODO: Show following artists in modal or dedicated page
      Utils.toast.show('Following artists feature coming soon!', 'info');
    } catch (error) {
      Utils.toast.show('Error loading following artists', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  async showMyArtworks() {
    try {
      Utils.loading.show();
      const artworks = await API.getArtworks({ artist: this.currentUser.id });
      // TODO: Show artist's artworks in modal or dedicated page
      Utils.toast.show('My artworks feature coming soon!', 'info');
    } catch (error) {
      Utils.toast.show('Error loading artworks', 'error');
    } finally {
      Utils.loading.hide();
    }
  }

  showAddArtwork() {
    // TODO: Show add artwork form
    Utils.toast.show('Add artwork feature coming soon!', 'info');
  }

  showProfile() {
    // TODO: Show profile settings
    Utils.toast.show('Profile settings feature coming soon!', 'info');
  }
}

// Initialize authentication
document.addEventListener('DOMContentLoaded', () => {
  window.Auth = new AuthManager();

  // Setup authentication modal
  const authModal = document.getElementById('auth-modal');
  const authBtn = document.getElementById('auth-btn');
  const modalClose = document.getElementById('modal-close');
  
  Utils.modal.register('auth-modal', authModal);

  // Show auth modal
  authBtn.addEventListener('click', () => {
    if (!Auth.isLoggedIn) {
      Utils.modal.show('auth-modal');
    }
  });

  // Close modal
  modalClose.addEventListener('click', () => {
    Utils.modal.hide('auth-modal');
  });

  // Setup auth tabs
  const authTabs = document.querySelectorAll('.auth-tab');
  const authForms = document.querySelectorAll('.auth-form');

  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      // Update active tab
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active form
      authForms.forEach(form => {
        form.classList.remove('active');
        if (form.id === `${targetTab}-form`) {
          form.classList.add('active');
        }
      });
    });
  });

  // Setup user type selector
  const userTypeRadios = document.querySelectorAll('input[name="userType"]');
  const artistFields = document.querySelector('.artist-fields');
  const userFields = document.querySelector('.user-fields');

  userTypeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.value === 'artist') {
        artistFields.style.display = 'block';
        userFields.style.display = 'none';
      } else {
        artistFields.style.display = 'none';
        userFields.style.display = 'block';
      }
    });
  });

  // Setup login form
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(loginForm);
    const email = formData.get('email');
    const password = formData.get('password');

    if (!Utils.isValidEmail(email)) {
      Utils.toast.show('Please enter a valid email address', 'error');
      return;
    }

    try {
      await Auth.login(email, password);
      loginForm.reset();
    } catch (error) {
      // Error already handled in Auth.login
    }
  });

  // Setup register form
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm);
    const userType = formData.get('userType');
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password');

    // Validation
    if (!name) {
      Utils.toast.show('Please enter your name', 'error');
      return;
    }

    if (!Utils.isValidEmail(email)) {
      Utils.toast.show('Please enter a valid email address', 'error');
      return;
    }

    const passwordValidation = Utils.validatePassword(password);
    if (!passwordValidation.isValid) {
      Utils.toast.show('Password must be at least 6 characters long', 'error');
      return;
    }

    // Prepare user data
    let userData = { name, email, password };

    if (userType === 'artist') {
      const artform = formData.get('artform');
      const experience = formData.get('experience');
      const bio = formData.get('bio');

      if (!artform) {
        Utils.toast.show('Please select your primary artform', 'error');
        return;
      }

      userData.artform = artform;
      userData.experience = experience ? parseInt(experience) : 0;
      userData.bio = bio;
    } else {
      // Get selected interests
      const interests = Array.from(formData.getAll('interests'));
      userData.interests = interests;
    }

    try {
      await Auth.register(userData, userType);
      registerForm.reset();
      
      // Reset form state
      artistFields.style.display = 'none';
      userFields.style.display = 'block';
      userTypeRadios[0].checked = true;
    } catch (error) {
      // Error already handled in Auth.register
    }
  });
});

// Add styles for user dropdown
const dropdownStyles = `
  .user-dropdown {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-lg);
    transition: var(--transition-fast);
    position: relative;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary-orange);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: bold;
    font-size: 0.8rem;
  }

  .user-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: var(--white);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    min-width: 250px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: var(--transition-normal);
    z-index: 1000;
    margin-top: var(--spacing-sm);
  }

  .user-dropdown-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .dropdown-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--light-gray);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .user-avatar-large {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: var(--primary-orange);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    font-weight: bold;
  }

  .user-name {
    font-weight: 600;
    color: var(--secondary-blue);
  }

  .user-type {
    font-size: 0.9rem;
    color: var(--gray);
    text-transform: capitalize;
  }

  .dropdown-items {
    padding: var(--spacing-sm) 0;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--dark-gray);
    text-decoration: none;
    transition: var(--transition-fast);
  }

  .dropdown-item:hover {
    background: var(--light-gray);
    color: var(--primary-orange);
  }

  .dropdown-item i {
    width: 16px;
    text-align: center;
  }

  .dropdown-divider {
    height: 1px;
    background: var(--light-gray);
    margin: var(--spacing-sm) 0;
  }
`;

// Add dropdown styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = dropdownStyles;
document.head.appendChild(styleSheet);