<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <i class="fas fa-gem"></i>
        <span>Beauty Market</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="desktop-nav">
        <div class="nav-dropdown">
          <div class="dropdown-menu">
            <!-- Location Options Section -->
            <div class="dropdown-section">
              <div class="section-header">
                <i class="fas fa-map-marker-alt"></i>
                <span>Location Services</span>
              </div>
              <button @click="openLocationSearch" class="dropdown-item location-item">
                <i class="fas fa-location-arrow"></i>
                Find Nearby Stores
              </button>
              <button @click="detectCurrentLocation" class="dropdown-item location-item">
                <i class="fas fa-crosshairs"></i>
                Use My Location
              </button>
              <router-link to="/store-locator" class="dropdown-item location-item">
                <i class="fas fa-store"></i>
                Store Locator
              </router-link>
            </div>

            <!-- Divider -->
            <div class="dropdown-divider"></div>

            <!-- Categories Section -->
            <div class="dropdown-section">
              <div class="section-header">
                <i class="fas fa-th-large"></i>
                <span>Categories</span>
              </div>
              <router-link
                v-for="category in categories"
                :key="category.id"
                :to="`/products/${category.id}`"
                class="dropdown-item"
              >
                <i :class="category.icon"></i>
                {{ category.name }}
              </router-link>
            </div>
          </div>
        </div>
      </nav>

      <!-- Brand/Logo Text -->
      <div class="header-brand">
        <!-- Removed Beauty & Personal Care text -->
      </div>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Location Display/Search Button -->
        <button class="action-btn location-btn" @click="openLocationSearch" :title="currentLocation ? 'Change location' : 'Find beauty near you'">
          <i class="fas fa-map-marker-alt"></i>
          <span class="location-text">
            {{ currentLocation ? getShortLocation(currentLocation.address) : 'Location' }}
          </span>
        </button>


        <button class="action-btn cart-btn" @click="toggleCart">
          <i class="fas fa-shopping-bag"></i>
          <span class="badge" v-if="cartItemCount">{{ cartItemCount }}</span>
          <span class="sr-only">Shopping Cart</span>
        </button>

        <!-- Authentication Actions -->
        <div v-if="!isAuthenticated" class="auth-actions">
          <button @click="openSignIn" class="auth-btn signin-btn">
            <i class="fas fa-sign-in-alt"></i>
            <span class="auth-text">Sign In</span>
          </button>
          <button @click="openSignUp" class="auth-btn signup-btn">
            <i class="fas fa-user-plus"></i>
            <span class="auth-text">Sign Up</span>
          </button>
        </div>

        <!-- User Profile (when authenticated) -->
        <div v-else class="user-profile-dropdown">
          <button @click="toggleUserMenu" class="user-profile-btn" :class="{ active: isUserMenuOpen }">
            <div class="user-avatar">
              <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Profile">
              <i v-else class="fas fa-user"></i>
              <div class="online-indicator"></div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ userProfile.name || 'User' }}</span>
              <span class="user-status">Online</span>
            </div>
            <i class="fas fa-chevron-down dropdown-arrow" :class="{ rotated: isUserMenuOpen }"></i>
          </button>

          <div class="user-dropdown-menu" :class="{ active: isUserMenuOpen }">
            <div class="dropdown-header">
              <div class="user-avatar-large">
                <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Profile">
                <i v-else class="fas fa-user"></i>
              </div>
              <div class="user-details">
                <h4>{{ userProfile.name || 'User' }}</h4>
                <p>{{ userProfile.email || 'user@example.com' }}</p>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <router-link to="/profile" class="dropdown-item" @click="closeUserMenu">
              <div class="item-icon">
                <i class="fas fa-user"></i>
              </div>
              <div class="item-content">
                <span class="item-title">My Profile</span>
                <span class="item-description">Manage your account</span>
              </div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </router-link>

            <router-link to="/orders" class="dropdown-item" @click="closeUserMenu">
              <div class="item-icon">
                <i class="fas fa-box"></i>
              </div>
              <div class="item-content">
                <span class="item-title">My Orders</span>
                <span class="item-description">Track your purchases</span>
              </div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </router-link>

            <router-link to="/wishlist" class="dropdown-item" @click="closeUserMenu">
              <div class="item-icon">
                <i class="fas fa-heart"></i>
              </div>
              <div class="item-content">
                <span class="item-title">Wishlist</span>
                <span class="item-description">Your saved items</span>
              </div>
              <div class="item-badge" v-if="wishlistCount > 0">{{ wishlistCount }}</div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </router-link>

            <button @click="handleSignInClick" class="dropdown-item">
              <div class="item-icon">
                <i class="fas fa-sign-in-alt"></i>
              </div>
              <div class="item-content">
                <span class="item-title">Sign In</span>
                <span class="item-description">Access your account</span>
              </div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </button>

            <button @click="handleSignUpClick" class="dropdown-item">
              <div class="item-icon">
                <i class="fas fa-user-plus"></i>
              </div>
              <div class="item-content">
                <span class="item-title">Sign Up</span>
                <span class="item-description">Create new account</span>
              </div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </button>

            <router-link to="/profile?tab=settings" class="dropdown-item" @click="closeUserMenu">
              <div class="item-icon">
                <i class="fas fa-cog"></i>
              </div>
              <div class="item-content">
                <span class="item-title">Settings</span>
                <span class="item-description">Preferences & privacy</span>
              </div>
              <i class="fas fa-chevron-right item-arrow"></i>
            </router-link>

          </div>
        </div>

        <!-- Mobile Menu Toggle -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas" :class="isMobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <nav class="mobile-nav" :class="{ active: isMobileMenuOpen }">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu">
        <i class="fas fa-home"></i>
        Home
      </router-link>
      <button @click="openLocationSearch" class="mobile-nav-link location-mobile">
        <i class="fas fa-map-marker-alt"></i>
        Find Beauty Near You
      </button>
      <div class="mobile-categories">
        <span class="mobile-nav-label">Categories</span>
        <router-link 
          v-for="category in categories" 
          :key="category.id"
          :to="`/products/${category.id}`"
          class="mobile-nav-link category-link"
          @click="closeMobileMenu"
        >
          <i :class="category.icon"></i>
          {{ category.name }}
        </router-link>
      </div>
      <div v-if="isAuthenticated" class="mobile-user-section">
        <div class="mobile-user-header">
          <div class="user-avatar">
            <img v-if="userProfile.avatar" :src="userProfile.avatar" alt="Profile">
            <i v-else class="fas fa-user"></i>
          </div>
          <div class="mobile-user-info">
            <span class="mobile-user-name">{{ userProfile.name || 'User' }}</span>
            <span class="mobile-user-email">{{ userProfile.email || 'user@example.com' }}</span>
          </div>
        </div>
        <router-link to="/profile" class="mobile-nav-link" @click="closeMobileMenu">
          <i class="fas fa-user"></i>
          My Profile
        </router-link>
        <router-link to="/orders" class="mobile-nav-link" @click="closeMobileMenu">
        <i class="fas fa-box"></i>
        My Orders
      </router-link>
      <router-link to="/wishlist" class="mobile-nav-link" @click="closeMobileMenu">
        <i class="fas fa-heart"></i>
        Wishlist
        <span v-if="wishlistCount > 0" class="mobile-badge">{{ wishlistCount }}</span>
      </router-link>
      <router-link to="/profile?tab=settings" class="mobile-nav-link" @click="closeMobileMenu">
        <i class="fas fa-cog"></i>
        Settings
      </router-link>
      </div>
      <div v-else class="mobile-auth-section">
        <button @click="openSignIn" class="mobile-nav-link">
          <i class="fas fa-sign-in-alt"></i>
          Sign In
        </button>
        <button @click="openSignUp" class="mobile-nav-link">
          <i class="fas fa-user-plus"></i>
          Sign Up
        </button>
      </div>
    </nav>

    <!-- Authentication Modal -->
    <AuthModal
      :isVisible="showAuthModal"
      :initialMode="authMode"
      @close="closeAuthModal"
      @auth-success="handleAuthSuccess"
      @auth-error="handleAuthError"
      @password-reset-sent="handlePasswordReset"
    />

    <!-- Location Search Modal -->
    <LocationSearch
      :isVisible="showLocationSearch"
      @close="closeLocationSearch"
      @location-detected="handleLocationDetected"
      @location-selected="handleLocationSelected"
      @location-confirmed="handleLocationConfirmed"
      @error="handleLocationError"
    />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AuthModal from '../auth/AuthModal.vue';
import LocationSearch from '../location/LocationSearch.vue';

export default {
  name: 'AppHeader',
  components: {
    AuthModal,
    LocationSearch
  },
  data() {
    return {
      showAuthModal: false,
      authMode: 'signin', // 'signin' or 'signup'
      isUserMenuOpen: false,
      showLocationSearch: false,
      currentLocation: null
    };
  },
  computed: {
    ...mapGetters('products', ['categories']),
    ...mapGetters('cart', ['cartItemCount']),
    ...mapGetters('user', ['wishlistItems', 'userProfile', 'isAuthenticated']),
    ...mapGetters('ui', ['isMobileMenuOpen']),
    wishlistCount() {
      return this.wishlistItems.length;
    }
  },
  methods: {
    ...mapActions('ui', ['toggleMobileMenu', 'closeMobileMenu', 'toggleSearch', 'openSearch', 'showNotification']),
    ...mapActions('cart', ['toggleCart']),
    ...mapActions('user', ['logout']),

    openSignIn() {
      this.authMode = 'signin';
      this.showAuthModal = true;
    },

    openSignUp() {
      this.authMode = 'signup';
      this.showAuthModal = true;
    },

    closeAuthModal() {
      this.showAuthModal = false;
    },

    toggleUserMenu() {
      this.isUserMenuOpen = !this.isUserMenuOpen;
    },

    closeUserMenu() {
      this.isUserMenuOpen = false;
    },

    handleSignInClick() {
      this.closeUserMenu();
      this.openSignIn();
    },

    handleSignUpClick() {
      this.closeUserMenu();
      this.openSignUp();
    },

    handleAuthSuccess(data) {
      this.showNotification({
        type: 'success',
        message: data.message
      });
      this.closeUserMenu();
    },

    handleAuthError(data) {
      this.showNotification({
        type: 'error',
        message: data.message
      });
    },

    handlePasswordReset(data) {
      this.showNotification({
        type: 'info',
        message: data.message
      });
    },

    async logoutUser() {
      try {
        await this.logout();
        this.closeUserMenu();
        this.showNotification({
          type: 'success',
          message: 'You have been signed out successfully'
        });
        this.$router.push('/');
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Error signing out. Please try again.'
        });
      }
    },

    // Location Detection Method
    detectCurrentLocation() {
      if (navigator.geolocation) {
        this.showNotification({
          type: 'info',
          message: 'Detecting your location...'
        });

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Simulate reverse geocoding
            const mockLocation = {
              lat: latitude,
              lng: longitude,
              address: 'Current Location',
              city: 'Your City'
            };
            this.handleLocationDetected(mockLocation);
          },
          (error) => {
            this.handleLocationError({
              message: 'Unable to detect location. Please enable location services.'
            });
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000
          }
        );
      } else {
        this.handleLocationError({
          message: 'Geolocation is not supported by this browser.'
        });
      }
    },

    // Location Search Methods
    openLocationSearch() {
      this.showLocationSearch = true;
    },

    closeLocationSearch() {
      this.showLocationSearch = false;
    },

    handleLocationDetected(location) {
      this.currentLocation = location;
      this.showNotification({
        type: 'success',
        message: `Location detected: ${location.address}`
      });
    },

    handleLocationSelected(location) {
      this.currentLocation = location;
    },

    handleLocationConfirmed(location) {
      this.currentLocation = location;
      this.showNotification({
        type: 'success',
        message: `Location set to: ${location.address}`
      });

      // Store location in localStorage or Vuex for persistence
      localStorage.setItem('beauty_market_location', JSON.stringify(location));

      // You could also dispatch to a store action
      // this.$store.dispatch('user/setLocation', location);
    },

    handleLocationError(error) {
      this.showNotification({
        type: 'error',
        message: error.message || 'Unable to detect location'
      });
    },

    getShortLocation(address) {
      if (!address) return 'Location';

      // Extract city name from address
      const parts = address.split(',');
      if (parts.length >= 2) {
        return parts[0].trim(); // Return first part (usually city)
      }

      // If it's a short address, limit to 15 characters
      return address.length > 15 ? address.substring(0, 15) + '...' : address;
    },

    initializeLocation() {
      // Load saved location from localStorage
      const savedLocation = localStorage.getItem('beauty_market_location');
      if (savedLocation) {
        try {
          this.currentLocation = JSON.parse(savedLocation);
        } catch (error) {
          console.error('Error parsing saved location:', error);
          localStorage.removeItem('beauty_market_location');
        }
      }
    }
  },

  mounted() {
    // Initialize saved location
    this.initializeLocation();

    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.isUserMenuOpen = false;
      }
    });
  }
};
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-200);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  height: 80px;
  gap: 17px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-600);
  text-decoration: none;
  flex-shrink: 0;
}

.logo i {
  font-size: 28px;
}

.header-brand {
  flex: 1;
  text-align: center;
}

.brand-subtitle {
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 19px;
}

.nav-link {
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-link:hover {
  color: var(--primary-600);
}

.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 12px 0;
  min-width: 280px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid var(--gray-200);
}

.nav-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--gray-700);
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background: var(--gray-50);
  color: var(--primary-600);
}

/* Dropdown Sections */
.dropdown-section {
  padding: 4px 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: var(--gray-25);
  margin-bottom: 4px;
}

.section-header i {
  font-size: 11px;
  color: var(--primary-500);
}

/* Location Items */
.location-item {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.2s ease;
}

.location-item:hover {
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50));
  color: var(--primary-700);
  padding-left: 24px;
}

.location-item i {
  width: 16px;
  text-align: center;
  color: var(--primary-500);
}

.location-item:hover i {
  color: var(--primary-700);
  transform: scale(1.1);
}

.dropdown-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 8px 16px;
}

.search-container {
  flex: 1;
  max-width: 500px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 50px 12px 20px;
  border: 2px solid var(--gray-200);
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--primary-500);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-btn:hover {
  background: var(--primary-600);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  padding: 12px;
  border-radius: 8px;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
}

.action-btn:hover {
  background: var(--gray-100);
  color: var(--primary-600);
}

.location-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600)) !important;
  color: white !important;
  border-radius: 12px;
  gap: 11px;
  padding: 10px 14px !important;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(236, 72, 153, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.location-btn:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700)) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
}

.location-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.location-btn:hover::before {
  left: 100%;
}

.location-text {
  font-size: 14px;
  font-weight: 500;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
}

.mobile-menu-btn {
  display: none;
}

.mobile-nav {
  display: none;
  background: white;
  border-top: 1px solid var(--gray-200);
  padding: 20px;
}

.mobile-nav.active {
  display: block;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  color: var(--gray-700);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--gray-100);
  position: relative;
}

.mobile-nav-link:hover {
  color: var(--primary-600);
}

.mobile-nav-label {
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 1px;
  margin: 16px 0 8px 0;
  display: block;
}

.category-link {
  padding-left: 20px;
  font-size: 15px;
}

.mobile-categories {
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.mobile-user-section {
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.mobile-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-100);
  margin-bottom: 8px;
}

.mobile-user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mobile-user-name {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 16px;
}

.mobile-user-email {
  font-size: 14px;
  color: var(--gray-600);
}

.logout-mobile {
  color: var(--error-600) !important;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-weight: 500;
}

.logout-mobile:hover {
  color: var(--error-700) !important;
  background: var(--error-50) !important;
}

.mobile-auth-section {
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: 8px;
  padding-bottom: 8px;
}

.mobile-auth-section .mobile-nav-link {
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-weight: 500;
}

.location-mobile {
  background: linear-gradient(135deg, var(--primary-50), var(--purple-50)) !important;
  color: var(--primary-700) !important;
  border: 1px solid var(--primary-200) !important;
  border-radius: 8px;
  margin: 8px 0;
  font-weight: 600 !important;
}

.location-mobile:hover {
  background: linear-gradient(135deg, var(--primary-100), var(--purple-100)) !important;
  color: var(--primary-800) !important;
}

.mobile-badge {
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-left: auto;
}

@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .search-container {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .header-container {
    gap: 6px;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 70px;
    padding: 0 16px;
  }
  
  .logo span {
    display: none;
  }
  
  .action-btn .sr-only {
    position: static;
    width: auto;
    height: auto;
    clip: auto;
    white-space: normal;
  }
  
  .mobile-only {
    display: block;
  }
}

/* Authentication Styles */
.auth-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.signin-btn {
  background: var(--gray-100);
  color: var(--gray-700);
}

.signin-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.signup-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.signup-btn:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
}

.auth-text {
  font-weight: 500;
}


/* User Profile Dropdown */
.user-profile-dropdown {
  position: relative;
}

.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--gray-700);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 180px;
}

.user-profile-btn:hover,
.user-profile-btn.active {
  background: var(--primary-50);
  border-color: var(--primary-200);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.15);
  transform: translateY(-1px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 16px;
  position: relative;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background: var(--success-500);
  border: 2px solid white;
  border-radius: 50%;
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 4px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.user-status {
  font-size: 12px;
  color: var(--success-600);
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 12px;
  color: var(--gray-400);
  transition: all 0.3s ease;
  margin-left: 4px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
  color: var(--primary-500);
}

.user-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  padding: 0;
  min-width: 320px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px) scale(0.95);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
  margin-top: 12px;
  backdrop-filter: blur(10px);
}

.user-dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0) scale(1);
}

.dropdown-header {
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  font-size: 20px;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 2px;
}

.user-details p {
  font-size: 13px;
  color: var(--gray-600);
  margin: 0;
}

.user-dropdown-menu .dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: var(--gray-700);
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  position: relative;
}

.user-dropdown-menu .dropdown-item:hover {
  background: var(--gray-50);
  color: var(--primary-600);
  padding-left: 20px;
}

.item-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.dropdown-item:hover .item-icon {
  background: var(--primary-100);
  color: var(--primary-600);
  transform: scale(1.1);
}

.item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--gray-800);
  margin-bottom: 2px;
}

.item-description {
  font-size: 12px;
  color: var(--gray-500);
}

.item-arrow {
  font-size: 12px;
  color: var(--gray-400);
  transition: all 0.2s ease;
}

.dropdown-item:hover .item-arrow {
  color: var(--primary-500);
  transform: translateX(4px);
}

.item-badge {
  background: var(--primary-500);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.logout-item {
  color: var(--error-600) !important;
}

.logout-item:hover {
  background: var(--error-50) !important;
  color: var(--error-700) !important;
}

.logout-item .item-icon {
  background: var(--error-100);
  color: var(--error-600);
}

.logout-item:hover .item-icon {
  background: var(--error-200);
  color: var(--error-700);
}

.dropdown-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 4px 16px;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }

  .auth-actions {
    display: none;
  }

  .header-brand {
    display: none;
  }
}

@media (max-width: 768px) {
  .auth-text {
    display: none;
  }

  .location-text {
    display: none;
  }

  .location-btn {
    padding: 12px !important;
    border-radius: 50%;
    width: 44px;
    height: 44px;
  }

  .user-profile-btn {
    min-width: auto;
    padding: 8px 12px;
  }

  .user-info {
    display: none;
  }


  .user-dropdown-menu {
    min-width: 280px;
    right: -20px;
  }

  .dropdown-header {
    padding: 16px;
  }

  .user-details h4 {
    font-size: 16px;
  }

  .item-content {
    flex: 1;
  }

  .item-description {
    display: none;
  }
}
</style>
