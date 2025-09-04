<template>
  <div class="product-card">
    <div class="product-image-container" @click="goToProduct">
      <img :src="product.image" :alt="product.name" class="product-image">
      <div v-if="product.onSale" class="sale-badge">Sale</div>
      <div class="product-overlay">
        <button class="quick-view-btn" @click.stop="openQuickView">
          <i class="fas fa-eye"></i>
          Quick View
        </button>
      </div>
      <button
        class="wishlist-btn"
        :class="{ active: isInWishlist(product.id) }"
        @click.stop="toggleWishlist"
      >
        <i class="fas fa-heart"></i>
      </button>
    </div>
    
    <div class="product-info">
      <div v-if="showReason" class="recommendation-reason">
        <i class="fas fa-magic"></i>
        {{ getRecommendationReason }}
      </div>
      <div class="product-brand">{{ product.brand }}</div>
      <h3 class="product-name" @click="goToProduct">{{ product.name }}</h3>
      
      <div class="product-rating">
        <div class="stars">
          <i 
            v-for="star in 5" 
            :key="star"
            class="fas fa-star"
            :class="{ active: star <= product.rating }"
          ></i>
        </div>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>
      
      <div class="product-pricing">
        <span class="current-price">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ${{ product.originalPrice.toFixed(2) }}
        </span>
      </div>
      
      <button
        @click="isInCart ? goToCart() : handleAddToCart()"
        :class="['add-to-cart-btn', { 'in-cart': isInCart }]"
        :disabled="isAddingToCart"
      >
        <i :class="isInCart ? 'fas fa-arrow-right' : 'fas fa-shopping-bag'"></i>
        {{
          isAddingToCart ? 'Adding...' :
          isInCart ? 'Go to Cart' :
          'Add to Cart'
        }}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    showReason: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAddingToCart: false
    };
  },
  computed: {
    ...mapGetters('user', ['isInWishlist', 'userProfile']),
    ...mapGetters('cart', ['cartItems']),
    isInCart() {
      return this.cartItems.some(item => item.id === this.product.id);
    },
    getRecommendationReason() {
      if (!this.showReason) return '';

      // Check if product matches user's skin type
      if (this.userProfile.skinType && this.product.suitableFor?.includes(this.userProfile.skinType)) {
        return `Perfect for ${this.userProfile.skinType} skin`;
      }

      // Check if it's a preferred brand
      if (this.userProfile.preferences?.brands?.includes(this.product.brand)) {
        return `You love ${this.product.brand} products`;
      }

      // Check if it's a preferred category
      if (this.userProfile.preferences?.categories?.includes(this.product.category)) {
        return 'Matches your preferences';
      }

      // Default recommendation reason
      return 'Recommended for you';
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    ...mapActions('user', ['toggleWishlist']),
    ...mapActions('ui', ['openProductQuickView', 'showNotification']),
    openQuickView() {
      this.openProductQuickView(this.product);
    },
    goToProduct() {
      this.$router.push(`/product/${this.product.id}`);
    },
    goToCart() {
      this.$router.push('/cart');
    },
    async handleAddToCart() {
      this.isAddingToCart = true;

      try {
        await this.addToCart({
          ...this.product,
          quantity: 1
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to add product to cart'
        });
      } finally {
        this.isAddingToCart = false;
      }
    },
    async toggleWishlist() {
      try {
        const result = await this.toggleWishlist(this.product);
        this.showNotification({
          type: 'success',
          message: result.message
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update wishlist'
        });
      }
    }
  }
};
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.product-image-container {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  cursor: pointer;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.05);
}

.sale-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--error-500);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 2;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.quick-view-btn {
  background: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  transform: translateY(10px);
}

.product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.quick-view-btn:hover {
  background: var(--primary-50);
  color: var(--primary-600);
}

.wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
  z-index: 2;
}

.wishlist-btn:hover {
  background: white;
  color: var(--primary-600);
}

.wishlist-btn.active {
  background: var(--primary-500);
  color: white;
}

.product-info {
  padding: 20px;
}

.recommendation-reason {
  background: linear-gradient(135deg, var(--primary-100), var(--purple-100));
  color: var(--primary-700);
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-brand {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 12px;
  line-height: 1.3;
  cursor: pointer;
  transition: color 0.2s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-name:hover {
  color: var(--primary-600);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  color: var(--gray-300);
  font-size: 12px;
}

.stars i.active {
  color: var(--warning-500);
}

.rating-count {
  font-size: 12px;
  color: var(--gray-500);
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.current-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-600);
}

.original-price {
  font-size: 14px;
  color: var(--gray-400);
  text-decoration: line-through;
}

.add-to-cart-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.add-to-cart-btn.in-cart {
  background: linear-gradient(135deg, var(--success-500), var(--success-600));
  border: 2px solid var(--success-500);
}

.add-to-cart-btn.in-cart:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--success-600), var(--success-700));
  border-color: var(--success-600);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .product-overlay {
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .quick-view-btn {
    transform: translateY(0);
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
