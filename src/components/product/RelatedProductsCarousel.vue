<template>
  <div class="related-products-carousel">
    <div class="section-header">
      <h3 class="section-title">{{ sectionTitle }}</h3>
      <p class="section-subtitle">{{ sectionSubtitle }}</p>
    </div>

    <div class="carousel-container" ref="carouselContainer">
      <!-- Navigation Arrows -->
      <button 
        @click="scrollCarousel('left')" 
        class="carousel-nav nav-left"
        :disabled="!canScrollLeft"
        v-if="showArrows"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      
      <button 
        @click="scrollCarousel('right')" 
        class="carousel-nav nav-right"
        :disabled="!canScrollRight"
        v-if="showArrows"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- Products Scroll Container -->
      <div 
        class="products-scroll" 
        ref="productsScroll"
        @scroll="handleScroll"
      >
        <div 
          v-for="product in products" 
          :key="product.id" 
          class="product-card"
          @click="viewProduct(product)"
        >
          <!-- Product Image -->
          <div class="product-image-container">
            <img 
              :src="product.image || product.images?.[0]" 
              :alt="product.name"
              class="product-image"
              @error="handleImageError"
            />
            
            <!-- Sale Badge -->
            <div v-if="product.onSale || product.discount" class="sale-badge">
              <span v-if="product.discount">{{ product.discount }}% OFF</span>
              <span v-else>Sale</span>
            </div>
            
            <!-- Wishlist Button -->
            <button 
              @click.stop="toggleWishlist(product)"
              class="wishlist-btn"
              :class="{ active: isInWishlist(product.id) }"
              :title="isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
            >
              <i class="fas fa-heart"></i>
            </button>
            
            <!-- Quick Actions Overlay -->
            <div class="quick-actions">
              <button 
                @click.stop="quickView(product)" 
                class="quick-action-btn"
                title="Quick View"
              >
                <i class="fas fa-eye"></i>
              </button>
              <button 
                @click.stop="addToCart(product)" 
                class="quick-action-btn"
                title="Add to Cart"
                :disabled="product.stock === 0"
              >
                <i class="fas fa-shopping-bag"></i>
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <!-- Brand -->
            <div class="product-brand">{{ product.brand }}</div>
            
            <!-- Product Name -->
            <h4 class="product-name" :title="product.name">{{ product.name }}</h4>
            
            <!-- Rating -->
            <div v-if="product.rating" class="product-rating">
              <div class="stars">
                <i 
                  v-for="i in 5" 
                  :key="i"
                  class="star"
                  :class="{ filled: i <= Math.floor(product.rating) }"
                >★</i>
              </div>
              <span class="rating-text">({{ product.reviewCount || 0 }})</span>
            </div>
            
            <!-- Price -->
            <div class="product-price">
              <span class="current-price">₹{{ formatPrice(product.price) }}</span>
              <span 
                v-if="product.originalPrice && product.originalPrice > product.price" 
                class="original-price"
              >
                ₹{{ formatPrice(product.originalPrice) }}
              </span>
            </div>
            
            <!-- Key Features -->
            <div v-if="product.features" class="product-features">
              <span 
                v-for="(feature, index) in product.features.slice(0, 2)" 
                :key="index"
                class="feature-tag"
              >
                {{ feature }}
              </span>
            </div>
            
            <!-- Stock Status -->
            <div v-if="product.stock !== undefined" class="stock-status">
              <span 
                v-if="product.stock === 0" 
                class="out-of-stock"
              >
                Out of Stock
              </span>
              <span 
                v-else-if="product.stock <= 5" 
                class="low-stock"
              >
                Only {{ product.stock }} left
              </span>
              <span 
                v-else 
                class="in-stock"
              >
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicators -->
      <div v-if="showIndicators" class="scroll-indicators">
        <div 
          v-for="(dot, index) in indicatorDots" 
          :key="index"
          class="indicator-dot"
          :class="{ active: index === activeIndicator }"
          @click="scrollToIndicator(index)"
        ></div>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="showLoadMore" class="load-more-section">
      <button @click="loadMoreProducts" class="load-more-btn" :disabled="isLoading">
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <span>{{ isLoading ? 'Loading...' : 'Load More Products' }}</span>
      </button>
    </div>

    <!-- Quick View Modal -->
    <ProductQuickViewModal
      :show="showQuickViewModal"
      :product="quickViewProduct || {}"
      @close="closeQuickView"
      @added-to-cart="handleQuickViewAddToCart"
      @wishlist-toggle="handleWishlistToggle"
      @view-full-details="handleViewFullDetails"
    />

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
import ProductQuickViewModal from './ProductQuickViewModal.vue';

export default {
  name: 'RelatedProductsCarousel',
  components: {
    ProductQuickViewModal
  },
  props: {
    products: {
      type: Array,
      required: true,
      default: () => []
    },
    sectionTitle: {
      type: String,
      default: 'You may also like'
    },
    sectionSubtitle: {
      type: String,
      default: 'Discover more products that complement your selection'
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    showIndicators: {
      type: Boolean,
      default: false
    },
    showLoadMore: {
      type: Boolean,
      default: false
    },
    cardsToShow: {
      type: Number,
      default: 4
    },
    autoScroll: {
      type: Boolean,
      default: false
    },
    autoScrollInterval: {
      type: Number,
      default: 5000
    }
  },
  data() {
    return {
      canScrollLeft: false,
      canScrollRight: true,
      activeIndicator: 0,
      showQuickViewModal: false,
      quickViewProduct: null,
      isLoading: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      wishlist: [],
      autoScrollTimer: null,
      cardWidth: 280,
      gap: 20
    };
  },
  computed: {
    indicatorDots() {
      const totalCards = this.products.length;
      const visibleCards = this.cardsToShow;
      return Math.ceil(totalCards / visibleCards);
    },
    
    toastIcon() {
      return this.toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
  },
  methods: {
    scrollCarousel(direction) {
      const container = this.$refs.productsScroll;
      const scrollAmount = (this.cardWidth + this.gap) * 2; // Scroll 2 cards at a time
      
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }
    },
    
    handleScroll() {
      const container = this.$refs.productsScroll;
      
      // Update scroll state
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);
      
      // Update active indicator
      if (this.showIndicators) {
        const scrollPercent = container.scrollLeft / (container.scrollWidth - container.clientWidth);
        this.activeIndicator = Math.round(scrollPercent * (this.indicatorDots - 1));
      }
    },
    
    scrollToIndicator(index) {
      const container = this.$refs.productsScroll;
      const scrollPercent = index / (this.indicatorDots - 1);
      const scrollPosition = scrollPercent * (container.scrollWidth - container.clientWidth);
      
      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    },
    
    viewProduct(product) {
      this.$emit('product-click', product);
      this.$router.push(`/product/${product.id}`);
    },
    
    quickView(product) {
      this.quickViewProduct = product;
      this.showQuickViewModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeQuickView() {
      this.showQuickViewModal = false;
      this.quickViewProduct = null;
      document.body.style.overflow = 'auto';
    },
    
    viewFullProduct(product) {
      this.closeQuickView();
      this.viewProduct(product);
    },
    
    async addToCart(product) {
      try {
        // Emit to parent or use Vuex store
        this.$emit('add-to-cart', product);
        
        // If using Vuex
        if (this.$store) {
          await this.$store.dispatch('cart/addToCart', {
            ...product,
            quantity: 1
          });
        }
        
        this.showToastMessage(`${product.name} added to cart!`, 'success');
      } catch (error) {
        this.showToastMessage('Failed to add product to cart', 'error');
      }
    },
    
    toggleWishlist(product) {
      const index = this.wishlist.findIndex(item => item.id === product.id);
      
      if (index > -1) {
        this.wishlist.splice(index, 1);
        this.showToastMessage('Removed from wishlist', 'success');
      } else {
        this.wishlist.push(product);
        this.showToastMessage('Added to wishlist', 'success');
      }
      
      this.$emit('wishlist-toggle', { product, isInWishlist: index === -1 });
    },
    
    isInWishlist(productId) {
      return this.wishlist.some(item => item.id === productId);
    },
    
    async loadMoreProducts() {
      this.isLoading = true;
      
      try {
        // Emit event to parent to load more products
        this.$emit('load-more');
        
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        this.showToastMessage('Failed to load more products', 'error');
      } finally {
        this.isLoading = false;
      }
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-IN').format(price);
    },
    
    handleImageError(event) {
      // Set fallback image
      event.target.src = 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop';
    },
    
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },
    
    startAutoScroll() {
      if (!this.autoScroll) return;
      
      this.autoScrollTimer = setInterval(() => {
        if (this.canScrollRight) {
          this.scrollCarousel('right');
        } else {
          // Reset to beginning
          this.$refs.productsScroll.scrollTo({ left: 0, behavior: 'smooth' });
        }
      }, this.autoScrollInterval);
    },
    
    stopAutoScroll() {
      if (this.autoScrollTimer) {
        clearInterval(this.autoScrollTimer);
        this.autoScrollTimer = null;
      }
    },
    
    updateCardWidth() {
      // Calculate card width based on container size
      const container = this.$refs.carouselContainer;
      if (container) {
        const containerWidth = container.clientWidth;
        const availableWidth = containerWidth - (this.gap * (this.cardsToShow - 1));
        this.cardWidth = Math.floor(availableWidth / this.cardsToShow);
      }
    },

    handleQuickViewAddToCart(data) {
      this.showToastMessage(`${data.product.name} added to cart!`, 'success');
      this.$emit('add-to-cart', data.product);
    },

    handleWishlistToggle(data) {
      const message = data.isInWishlist ? 'Added to wishlist' : 'Removed from wishlist';
      this.showToastMessage(message, 'success');
      this.$emit('wishlist-toggle', data);
    },

    handleViewFullDetails(product) {
      this.$emit('product-click', product);
    }
  },
  
  mounted() {
    // Initialize scroll state
    this.$nextTick(() => {
      this.handleScroll();
      this.updateCardWidth();
    });
    
    // Start auto scroll if enabled
    this.startAutoScroll();
    
    // Add resize listener
    window.addEventListener('resize', this.updateCardWidth);
    
    // Add intersection observer for lazy loading
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.$emit('carousel-visible');
          }
        });
      });
      
      if (this.$refs.carouselContainer) {
        observer.observe(this.$refs.carouselContainer);
      }
    }
  },
  
  beforeDestroy() {
    this.stopAutoScroll();
    window.removeEventListener('resize', this.updateCardWidth);
  },
  
  watch: {
    products() {
      this.$nextTick(() => {
        this.handleScroll();
      });
    }
  }
};
</script>

<style scoped>
.related-products-carousel {
  padding: 40px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 8px;
}

.section-subtitle {
  font-size: 16px;
  color: var(--market-text-light);
  margin: 0;
}

.carousel-container {
  position: relative;
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Navigation Arrows */
.carousel-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: white;
  color: var(--market-text);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.carousel-nav:hover:not(:disabled) {
  background: var(--market-primary);
  color: white;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 6px 20px rgba(236, 72, 153, 0.3);
}

.carousel-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-left {
  left: -25px;
}

.nav-right {
  right: -25px;
}

/* Products Scroll */
.products-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

/* Product Card */
.product-card {
  flex-shrink: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--market-border);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border-color: var(--market-primary);
}

.product-image-container {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
  background: var(--market-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #dc2626;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.wishlist-btn:hover,
.wishlist-btn.active {
  background: #dc2626;
  color: white;
  transform: scale(1.1);
}

.quick-actions {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .quick-actions {
  opacity: 1;
}

.quick-action-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  color: var(--market-text);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.quick-action-btn:hover:not(:disabled) {
  background: var(--market-primary);
  color: white;
  transform: scale(1.1);
}

.quick-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Product Info */
.product-info {
  padding: 20px;
}

.product-brand {
  font-size: 12px;
  color: var(--market-primary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.stars {
  display: flex;
  gap: 1px;
}

.star {
  color: #d1d5db;
  font-size: 14px;
}

.star.filled {
  color: #fbbf24;
}

.rating-text {
  font-size: 12px;
  color: var(--market-text-light);
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--market-primary);
}

.original-price {
  font-size: 14px;
  color: var(--market-text-light);
  text-decoration: line-through;
}

.product-features {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.feature-tag {
  background: var(--market-secondary);
  color: var(--market-text);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.stock-status {
  font-size: 12px;
  font-weight: 500;
}

.in-stock {
  color: #059669;
}

.low-stock {
  color: #d97706;
}

.out-of-stock {
  color: #dc2626;
}

/* Scroll Indicators */
.scroll-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--market-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator-dot.active {
  background: var(--market-primary);
  transform: scale(1.2);
}

/* Load More */
.load-more-section {
  text-align: center;
  margin-top: 32px;
}

.load-more-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 32px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Old modal styles removed - now using ProductQuickViewModal component */

/* Toast */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  font-weight: 500;
}

.toast-notification.success {
  background: #22c55e;
  color: white;
}

.toast-notification.error {
  background: #dc2626;
  color: white;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .product-card {
    width: 240px;
  }
  
  .nav-left {
    left: -20px;
  }
  
  .nav-right {
    right: -20px;
  }
}

@media (max-width: 768px) {
  .carousel-container {
    padding: 20px 16px;
  }
  
  .product-card {
    width: 200px;
  }
  
  .carousel-nav {
    display: none;
  }
  
  .quick-view-content {
    grid-template-columns: 1fr;
    padding: 16px;
  }
  
  .quick-view-image img {
    height: 200px;
  }
  
  .quick-view-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .section-title {
    font-size: 24px;
  }
  
  .product-card {
    width: 180px;
  }
  
  .product-image-container {
    height: 160px;
  }
  
  .product-info {
    padding: 16px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .current-price {
    font-size: 16px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .products-scroll {
    scroll-behavior: auto;
  }
  
  .product-card,
  .carousel-nav,
  .quick-action-btn,
  .wishlist-btn {
    transition: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .carousel-container {
    background: #1f2937;
  }
  
  .product-card {
    background: #374151;
    border-color: #4b5563;
  }
  
  .quick-view-modal {
    background: #1f2937;
  }
}
</style>
