<template>
  <div id="app" :class="{ 'dark-theme': isDarkTheme }">
    <TopSearchBar
      v-if="isHomePage"
      @location-detected="handleLocationDetected"
      @location-selected="handleLocationSelected"
      @search="handleSearch"
      @product-selected="handleProductSelected"
      @brand-selected="handleBrandSelected"
      @category-selected="handleCategorySelected"
      @routine-selected="handleRoutineSelected"
      @error="handleError"
    />
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
    
    <!-- Global Components -->
    <CartSidebar />
    <SearchModal />
    <NotificationContainer />
    <ProductQuickView />
    <AddToCartConfirmationWrapper />
    <AIChatWidget />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import AppHeader from './components/layout/AppHeader.vue';
import AppFooter from './components/layout/AppFooter.vue';
import CartSidebar from './components/cart/CartSidebar.vue';
import SearchModal from './components/search/SearchModal.vue';
import NotificationContainer from './components/ui/NotificationContainer.vue';
import ProductQuickView from './components/product/ProductQuickView.vue';
import TopSearchBar from './components/search/TopSearchBar.vue';
import AddToCartConfirmationWrapper from './components/cart/AddToCartConfirmationWrapper.vue';
import AIChatWidget from './components/chat/AIChatWidget.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
    CartSidebar,
    SearchModal,
    NotificationContainer,
    ProductQuickView,
    TopSearchBar,
    AddToCartConfirmationWrapper,
    AIChatWidget
  },
  computed: {
    ...mapGetters('ui', ['theme']),
    isDarkTheme() {
      return this.theme === 'dark';
    },
    isHomePage() {
      return this.$route.path === '/' || this.$route.name === 'Home';
    }
  },
  methods: {
    ...mapActions('ui', ['showNotification']),

    handleLocationDetected(location) {
      this.showNotification({
        type: 'success',
        message: `Location detected: ${location.address}`
      });
    },

    handleLocationSelected(location) {
      this.showNotification({
        type: 'info',
        message: `Location set to: ${location.address}`
      });
    },

    handleSearch(data) {
      // Navigate to search results page
      this.$router.push({
        path: '/products',
        query: {
          q: data.query,
          location: data.location?.address
        }
      });
    },

    handleProductSelected(product) {
      // Navigate to product detail page
      this.$router.push(`/product/${product.id}`);
    },

    handleBrandSelected(brand) {
      // Navigate to products filtered by brand
      this.$router.push({
        path: '/products',
        query: { brand: brand.name }
      });
    },

    handleCategorySelected(category) {
      // Navigate to category page
      this.$router.push(`/products/${category.name.toLowerCase()}`);
    },

    handleRoutineSelected(routine) {
      // Navigate to routine page or show routine modal
      this.showNotification({
        type: 'info',
        message: `Opening ${routine.name}...`
      });
      // Could navigate to /routines/${routine.id} or open a modal
    },

    handleError(message) {
      this.showNotification({
        type: 'error',
        message: message
      });
    }
  },
  mounted() {
    // Initialize authentication
    this.$store.dispatch('user/initializeAuth');

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('beauty-market-theme');
    if (savedTheme) {
      this.$store.dispatch('ui/setTheme', savedTheme);
    }

    // Show newsletter modal after delay
    this.$store.dispatch('ui/showNewsletterModal');
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Primary Colors */
  --primary-50: #fdf2f8;
  --primary-100: #fce7f3;
  --primary-200: #fbcfe8;
  --primary-300: #f9a8d4;
  --primary-400: #f472b6;
  --primary-500: #ec4899;
  --primary-600: #db2777;
  --primary-700: #be185d;
  --primary-800: #9d174d;
  --primary-900: #831843;

  /* Purple Colors */
  --purple-50: #faf5ff;
  --purple-100: #f3e8ff;
  --purple-200: #e9d5ff;
  --purple-300: #d8b4fe;
  --purple-400: #c084fc;
  --purple-500: #a855f7;
  --purple-600: #9333ea;
  --purple-700: #7c3aed;
  --purple-800: #6b21a8;
  --purple-900: #581c87;

  /* Pink Colors */
  --pink-50: #fdf2f8;
  --pink-100: #fce7f3;
  --pink-200: #fbcfe8;
  --pink-300: #f9a8d4;
  --pink-400: #f472b6;
  --pink-500: #ec4899;
  --pink-600: #db2777;
  --pink-700: #be185d;
  
  /* Neutral Colors */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-200: #e5e7eb;
  --gray-300: #d1d5db;
  --gray-400: #9ca3af;
  --gray-500: #6b7280;
  --gray-600: #4b5563;
  --gray-700: #374151;
  --gray-800: #1f2937;
  --gray-900: #111827;
  
  /* Success/Error Colors */
  --success-50: #f0fdf4;
  --success-100: #dcfce7;
  --success-500: #10b981;
  --success-600: #059669;
  --error-50: #fef2f2;
  --error-100: #fee2e2;
  --error-500: #ef4444;
  --error-600: #dc2626;
  --warning-500: #f59e0b;
  --warning-600: #d97706;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  font-family: var(--font-family);
  line-height: 1.6;
  color: var(--gray-800);
  background-color: var(--gray-50);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Account for fixed header height */
}

/* Dark theme styles */
.dark-theme {
  --gray-50: #1f2937;
  --gray-100: #374151;
  --gray-200: #4b5563;
  --gray-300: #6b7280;
  --gray-800: #f9fafb;
  --gray-900: #ffffff;
}

.dark-theme body {
  background-color: var(--gray-50);
  color: var(--gray-800);
}

/* Utility Classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.container-wide {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-4 > * + * { margin-top: 1rem; }

.hidden { display: none; }
.block { display: block; }

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.btn-outline {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
}

.btn-outline:hover {
  background: var(--primary-500);
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
  min-height: 36px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 18px;
  min-height: 52px;
}

/* Form Styles */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

/* Card Styles */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow);
  padding: 24px;
  transition: box-shadow 0.2s ease;
}

.card:hover {
  box-shadow: var(--shadow-md);
}

/* Animation Classes */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
  
  .main-content {
    padding-top: 70px; /* Mobile header height */
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 15px;
  }
}

/* Loading States */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

.skeleton {
  background: linear-gradient(90deg, var(--gray-200) 25%, var(--gray-100) 50%, var(--gray-200) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus styles for keyboard navigation */
.btn:focus-visible,
.form-input:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
