<template>
  <div class="page-header">
    <div class="market-container">
      <div class="page-header-content">
        <button @click="goBack" class="back-button">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="page-title-section">
          <h1 class="page-title">{{ title }}</h1>
          <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
        </div>
        <div class="header-actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    backTo: {
      type: String,
      default: null
    }
  },
  methods: {
    goBack() {
      // If specific backTo route is provided, use it
      if (this.backTo) {
        this.$router.push(this.backTo);
        return;
      }

      // Get current route name to determine smart fallback
      const currentRoute = this.$route.name;
      const currentPath = this.$route.path;

      // Smart routing based on current page context
      if (currentPath.includes('/product/')) {
        // Product detail page - go to products
        this.$router.push('/products');
      } else if (currentPath.includes('/order/') || currentPath.includes('/orders/')) {
        // Order detail page - go to orders
        this.$router.push('/orders');
      } else if (currentRoute === 'Profile' || currentPath === '/profile') {
        // Profile page - go to home
        this.$router.push('/');
      } else if (currentRoute === 'Cart' || currentPath === '/cart') {
        // Cart page - go to products
        this.$router.push('/products');
      } else if (currentRoute === 'Wishlist' || currentPath === '/wishlist') {
        // Wishlist page - go to products
        this.$router.push('/products');
      } else if (currentRoute === 'Checkout' || currentPath === '/checkout') {
        // Checkout page - go to cart
        this.$router.push('/cart');
      } else {
        // For all other pages, try browser back first
        if (window.history.length > 2) {
          this.$router.go(-1);
        } else {
          // Fallback to home if no history
          this.$router.push('/');
        }
      }
    }
  }
};
</script>

<style scoped>
.page-header {
  background: white;
  border-bottom: 1px solid var(--gray-200);
  position: sticky;
  top: 80px; /* Account for main header */
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  min-height: 60px;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: var(--gray-100);
  border: none;
  border-radius: 12px;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.back-button:hover {
  background: var(--primary-100);
  color: var(--primary-600);
  transform: translateX(-2px);
}

.page-title-section {
  flex: 1;
  min-width: 0; /* Allow text truncation */
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-subtitle {
  font-size: 14px;
  color: var(--gray-600);
  margin: 4px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .page-header {
    top: 70px; /* Mobile header height */
  }
  
  .page-header-content {
    padding: 12px 0;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .back-button {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 18px;
  }
  
  .page-subtitle {
    font-size: 12px;
  }
}
</style>
