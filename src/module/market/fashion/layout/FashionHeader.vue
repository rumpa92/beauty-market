<template>
  <header class="fashion-header">
    <div class="market-container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/fashion" class="fashion-logo">
          <i class="fas fa-tshirt"></i>
          <span class="logo-text">Fashion Market</span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <router-link to="/fashion" class="nav-link">Home</router-link>
          <div class="nav-dropdown">
            <span class="nav-link">
              Categories 
              <i class="fas fa-chevron-down"></i>
            </span>
            <div class="dropdown-menu">
              <router-link 
                v-for="category in categories" 
                :key="category.id"
                :to="`/fashion/products/${category.id}`"
                class="dropdown-item"
              >
                <i :class="category.icon"></i>
                {{ category.name }}
              </router-link>
            </div>
          </div>
          <router-link to="/fashion/products" class="nav-link">All Products</router-link>
          <button @click="openVoiceSearch" class="nav-link voice-btn">
            <i class="fas fa-microphone"></i>
            Voice Search
          </button>
        </nav>

        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <i class="fas fa-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search fashion, brands, styles..."
              class="search-input"
              v-model="searchQuery"
              @keyup.enter="performSearch"
              @focus="openSearch"
            >
            <button 
              v-if="isVoiceSupported" 
              @click="startVoiceSearch"
              class="voice-search-btn"
              :class="{ active: isListening }"
            >
              <i class="fas fa-microphone"></i>
            </button>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="header-actions">
          <button class="action-btn location-btn" @click="openLocationSelector">
            <i class="fas fa-map-marker-alt"></i>
            <span class="location-text">{{ userLocation || 'Location' }}</span>
          </button>
          
          <button class="action-btn search-mobile" @click="toggleSearch">
            <i class="fas fa-search"></i>
          </button>
          
          <router-link to="/fashion/wishlist" class="action-btn">
            <i class="fas fa-heart"></i>
            <span class="badge" v-if="wishlistCount">{{ wishlistCount }}</span>
          </router-link>

          <button class="action-btn cart-btn" @click="toggleCart">
            <i class="fas fa-shopping-bag"></i>
            <span class="badge" v-if="cartItemCount">{{ cartItemCount }}</span>
          </button>

          <div class="user-menu">
            <button class="action-btn user-btn" @click="toggleUserMenu">
              <i class="fas fa-user"></i>
              <span class="user-name" v-if="user.name">{{ user.name }}</span>
            </button>
            <div class="user-dropdown" :class="{ active: showUserMenu }">
              <router-link to="/fashion/profile" class="user-dropdown-item">
                <i class="fas fa-user"></i>
                My Profile
              </router-link>
              <router-link to="/fashion/orders" class="user-dropdown-item">
                <i class="fas fa-box"></i>
                My Orders
              </router-link>
              <button @click="logout" class="user-dropdown-item">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
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
        <div class="mobile-nav-content">
          <router-link to="/fashion" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-home"></i>
            Home
          </router-link>
          
          <div class="mobile-categories">
            <span class="mobile-nav-label">Categories</span>
            <router-link 
              v-for="category in categories" 
              :key="category.id"
              :to="`/fashion/products/${category.id}`"
              class="mobile-nav-link category-link"
              @click="closeMobileMenu"
            >
              <i :class="category.icon"></i>
              {{ category.name }}
            </router-link>
          </div>
          
          <router-link to="/fashion/products" class="mobile-nav-link" @click="closeMobileMenu">
            <i class="fas fa-th-large"></i>
            All Products
          </router-link>
          
          <button @click="openVoiceSearch" class="mobile-nav-link">
            <i class="fas fa-microphone"></i>
            Voice Search
          </button>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { fashionMarketConfig } from '../config.js';

export default {
  name: 'FashionHeader',
  data() {
    return {
      searchQuery: '',
      showUserMenu: false,
      isListening: false,
      isVoiceSupported: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItemCount']),
    ...mapGetters('user', ['wishlistItems', 'userProfile']),
    ...mapGetters('ui', ['isMobileMenuOpen']),
    categories() {
      return fashionMarketConfig.categories;
    },
    wishlistCount() {
      return this.wishlistItems.length;
    },
    user() {
      return this.userProfile;
    },
    userLocation() {
      return this.user.location || 'Select Location';
    }
  },
  methods: {
    ...mapActions('ui', [
      'toggleMobileMenu', 
      'closeMobileMenu', 
      'toggleSearch', 
      'openSearch', 
      'toggleCart',
      'showNotification'
    ]),
    ...mapActions('products', ['searchProducts']),
    performSearch() {
      if (this.searchQuery.trim()) {
        this.searchProducts(this.searchQuery);
        this.$router.push('/fashion/products');
        this.closeMobileMenu();
      }
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu;
    },
    openLocationSelector() {
      this.$router.push('/fashion/location');
    },
    openVoiceSearch() {
      this.$router.push('/fashion/search');
    },
    startVoiceSearch() {
      if (!this.isVoiceSupported) {
        this.showNotification({
          type: 'error',
          message: 'Voice search is not supported in your browser'
        });
        return;
      }

      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.searchQuery = transcript;
        this.performSearch();
      };

      recognition.onerror = () => {
        this.showNotification({
          type: 'error',
          message: 'Voice search failed. Please try again.'
        });
      };

      recognition.onend = () => {
        this.isListening = false;
      };

      recognition.start();
    },
    logout() {
      this.$store.dispatch('user/logout');
      this.$router.push('/fashion/auth');
      this.showUserMenu = false;
    }
  },
  mounted() {
    // Close user menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showUserMenu = false;
      }
    });
  }
};
</script>

<style scoped>
.fashion-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--market-border);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  height: 80px;
  gap: 32px;
}

.fashion-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-primary);
  text-decoration: none;
  flex-shrink: 0;
}

.fashion-logo i {
  font-size: 28px;
}

.logo-text {
  background: var(--market-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: var(--market-text);
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-link:hover {
  color: var(--market-primary);
}

.voice-btn {
  background: var(--market-accent-gradient);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--market-surface);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  min-width: 220px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid var(--market-border);
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
  color: var(--market-text);
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 400;
}

.dropdown-item:hover {
  background: var(--market-secondary);
  color: var(--market-primary);
}

.search-container {
  flex: 1;
  max-width: 500px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--market-text-light);
  font-size: 16px;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 50px;
  border: 2px solid var(--market-border);
  border-radius: 25px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: var(--market-surface);
}

.search-input:focus {
  outline: none;
  border-color: var(--market-primary);
  box-shadow: 0 0 0 3px rgba(26, 26, 26, 0.1);
}

.voice-search-btn {
  position: absolute;
  right: 8px;
  background: var(--market-accent);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.voice-search-btn:hover {
  background: var(--market-primary);
}

.voice-search-btn.active {
  background: #e74c3c;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
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
  color: var(--market-text);
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 44px;
  min-height: 44px;
  justify-content: center;
}

.action-btn:hover {
  background: var(--market-secondary);
  color: var(--market-primary);
}

.location-btn {
  padding: 8px 16px;
  background: var(--market-secondary);
  border-radius: 20px;
}

.location-text {
  font-size: 14px;
  font-weight: 500;
}

.search-mobile {
  display: none;
}

.badge {
  position: absolute;
  top: 6px;
  right: 6px;
  background: var(--market-primary);
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

.user-menu {
  position: relative;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--market-surface);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 12px 0;
  min-width: 180px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 100;
  border: 1px solid var(--market-border);
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: var(--market-text);
  text-decoration: none;
  transition: all 0.2s ease;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  font-size: 14px;
}

.user-dropdown-item:hover {
  background: var(--market-secondary);
  color: var(--market-primary);
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: var(--market-text);
  font-size: 20px;
}

.mobile-nav {
  display: none;
  background: var(--market-surface);
  border-top: 1px solid var(--market-border);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.mobile-nav.active {
  display: block;
  max-height: 600px;
}

.mobile-nav-content {
  padding: 20px;
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  color: var(--market-text);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--market-border);
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
}

.mobile-nav-link:hover {
  color: var(--market-primary);
}

.mobile-nav-label {
  font-weight: 600;
  color: var(--market-text-light);
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
  border-bottom: 1px solid var(--market-border);
  margin-bottom: 8px;
  padding-bottom: 8px;
}

@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  
  .search-container {
    display: none;
  }
  
  .search-mobile {
    display: flex;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .header-content {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .header-content {
    height: 70px;
    padding: 0 16px;
  }
  
  .logo-text {
    display: none;
  }
  
  .location-text,
  .user-name {
    display: none;
  }
  
  .header-actions {
    gap: 8px;
  }
  
  .action-btn {
    padding: 8px;
  }
}
</style>
