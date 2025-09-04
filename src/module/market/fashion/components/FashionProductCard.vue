<template>
  <div class="fashion-product-card market-card">
    <div class="product-image-container" @click="openQuickView">
      <img :src="product.image" :alt="product.name" class="product-image">
      
      <!-- Badges -->
      <div class="product-badges">
        <div v-if="product.onSale" class="badge sale-badge">Sale</div>
        <div v-if="product.isNew" class="badge new-badge">New</div>
        <div v-if="product.isExclusive" class="badge exclusive-badge">Exclusive</div>
      </div>
      
      <!-- Quick Actions Overlay -->
      <div class="product-overlay">
        <div class="quick-actions">
          <button class="quick-action-btn" @click.stop="toggleWishlist">
            <i class="fas fa-heart" :class="{ active: isInWishlist(product.id) }"></i>
          </button>
          <button class="quick-action-btn" @click.stop="openQuickView">
            <i class="fas fa-eye"></i>
          </button>
          <button class="quick-action-btn" @click.stop="shareProduct">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
        <button class="quick-view-btn market-btn market-btn-accent">
          Quick View
        </button>
      </div>
      
      <!-- Size Options for Hover -->
      <div class="size-options" v-if="product.sizes">
        <span 
          v-for="size in product.sizes.slice(0, 4)" 
          :key="size"
          class="size-option"
        >
          {{ size }}
        </span>
      </div>
    </div>
    
    <div class="product-info">
      <!-- Brand & Rating -->
      <div class="product-meta">
        <span class="product-brand">{{ product.brand }}</span>
        <div class="product-rating" v-if="product.rating">
          <div class="stars">
            <i 
              v-for="star in 5" 
              :key="star"
              class="fas fa-star"
              :class="{ active: star <= product.rating }"
            ></i>
          </div>
          <span class="rating-count">({{ product.reviewCount || 0 }})</span>
        </div>
      </div>
      
      <!-- Product Name -->
      <h3 class="product-name" @click="goToProduct">{{ product.name }}</h3>
      
      <!-- Product Details -->
      <div class="product-details">
        <div class="product-colors" v-if="product.colors">
          <span class="colors-label">Colors:</span>
          <div class="color-swatches">
            <span 
              v-for="color in product.colors.slice(0, 4)" 
              :key="color"
              class="color-swatch"
              :style="{ backgroundColor: getColorCode(color) }"
              :title="color"
            ></span>
            <span v-if="product.colors.length > 4" class="more-colors">
              +{{ product.colors.length - 4 }}
            </span>
          </div>
        </div>
        
        <div class="product-sizes" v-if="product.sizes">
          <span class="sizes-label">Sizes:</span>
          <span class="sizes-text">{{ product.sizes.slice(0, 3).join(', ') }}{{ product.sizes.length > 3 ? '...' : '' }}</span>
        </div>
      </div>
      
      <!-- Pricing -->
      <div class="product-pricing">
        <span class="current-price">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.originalPrice" class="original-price">
          ${{ product.originalPrice.toFixed(2) }}
        </span>
        <span v-if="discountPercentage" class="discount-percentage">
          {{ discountPercentage }}% OFF
        </span>
      </div>
      
      <!-- Size Selection -->
      <div class="size-selection" v-if="product.sizes && showSizeSelection">
        <label class="size-label">Size:</label>
        <div class="size-buttons">
          <button 
            v-for="size in product.sizes" 
            :key="size"
            class="size-btn"
            :class="{ selected: selectedSize === size }"
            @click="selectedSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>
      
      <!-- Add to Cart -->
      <div class="product-actions">
        <button 
          @click="handleAddToCart" 
          class="add-to-cart-btn market-btn market-btn-primary"
          :disabled="isAddingToCart || (product.sizes && !selectedSize)"
        >
          <i class="fas fa-shopping-bag"></i>
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'FashionProductCard',
  props: {
    product: {
      type: Object,
      required: true
    },
    showSizeSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isAddingToCart: false,
      selectedSize: null
    };
  },
  computed: {
    ...mapGetters('user', ['isInWishlist']),
    discountPercentage() {
      if (this.product.originalPrice && this.product.price) {
        const discount = ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100;
        return Math.round(discount);
      }
      return null;
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
      this.$router.push(`/fashion/product/${this.product.id}`);
    },
    async handleAddToCart() {
      if (this.product.sizes && !this.selectedSize) {
        this.showNotification({
          type: 'warning',
          message: 'Please select a size first'
        });
        return;
      }

      this.isAddingToCart = true;

      try {
        await this.addToCart({
          ...this.product,
          selectedSize: this.selectedSize,
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
    },
    shareProduct() {
      if (navigator.share) {
        navigator.share({
          title: this.product.name,
          text: `Check out this ${this.product.name} from ${this.product.brand}`,
          url: window.location.origin + `/fashion/product/${this.product.id}`
        });
      } else {
        // Fallback to copy to clipboard
        const url = window.location.origin + `/fashion/product/${this.product.id}`;
        navigator.clipboard.writeText(url).then(() => {
          this.showNotification({
            type: 'success',
            message: 'Product link copied to clipboard!'
          });
        });
      }
    },
    getColorCode(colorName) {
      const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Gray': '#808080',
        'Navy': '#000080',
        'Brown': '#8B4513',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Pink': '#FFC0CB',
        'Purple': '#800080',
        'Yellow': '#FFFF00',
        'Orange': '#FFA500'
      };
      return colorMap[colorName] || '#CCCCCC';
    }
  }
};
</script>

<style scoped>
.fashion-product-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  border: 1px solid var(--market-border);
}

.fashion-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: var(--market-accent);
}

.product-image-container {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  cursor: pointer;
  background: var(--market-secondary);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.fashion-product-card:hover .product-image {
  transform: scale(1.05);
}

.product-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 2;
}

.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sale-badge {
  background: #e74c3c;
  color: white;
}

.new-badge {
  background: #27ae60;
  color: white;
}

.exclusive-badge {
  background: var(--market-accent);
  color: white;
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fashion-product-card:hover .product-overlay {
  opacity: 1;
}

.quick-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-self: flex-start;
}

.quick-action-btn {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--market-text);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.quick-action-btn:hover {
  background: white;
  color: var(--market-primary);
  transform: scale(1.1);
}

.quick-action-btn i.active {
  color: #e74c3c;
}

.quick-view-btn {
  align-self: center;
  padding: 12px 24px;
  font-size: 14px;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.fashion-product-card:hover .quick-view-btn {
  transform: translateY(0);
}

.size-options {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.fashion-product-card:hover .size-options {
  opacity: 1;
}

.size-option {
  background: rgba(255, 255, 255, 0.9);
  color: var(--market-text);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.product-info {
  padding: 20px;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.product-brand {
  font-size: 12px;
  color: var(--market-text-light);
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stars {
  display: flex;
  gap: 1px;
}

.stars i {
  color: #ddd;
  font-size: 10px;
}

.stars i.active {
  color: #ffd700;
}

.rating-count {
  font-size: 10px;
  color: var(--market-text-light);
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
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
  color: var(--market-primary);
}

.product-details {
  margin-bottom: 12px;
}

.product-colors,
.product-sizes {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
}

.colors-label,
.sizes-label {
  color: var(--market-text-light);
  font-weight: 500;
}

.color-swatches {
  display: flex;
  align-items: center;
  gap: 4px;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #ddd;
  cursor: pointer;
}

.more-colors {
  font-size: 10px;
  color: var(--market-text-light);
  margin-left: 4px;
}

.sizes-text {
  color: var(--market-text);
  font-size: 11px;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
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

.discount-percentage {
  background: #e74c3c;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.size-selection {
  margin-bottom: 16px;
}

.size-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: var(--market-text);
  margin-bottom: 8px;
}

.size-buttons {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.size-btn {
  background: var(--market-secondary);
  border: 1px solid var(--market-border);
  color: var(--market-text);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-btn:hover {
  border-color: var(--market-primary);
}

.size-btn.selected {
  background: var(--market-primary);
  color: white;
  border-color: var(--market-primary);
}

.add-to-cart-btn {
  width: 100%;
  gap: 8px;
  font-size: 14px;
  padding: 12px 16px;
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .product-overlay {
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }
  
  .quick-view-btn {
    transform: translateY(0);
    padding: 8px 16px;
    font-size: 12px;
  }
  
  .size-options {
    opacity: 1;
  }
  
  .product-info {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .quick-actions {
    justify-content: center;
  }
  
  .product-pricing {
    justify-content: center;
  }
  
  .size-buttons {
    justify-content: center;
  }
}
</style>
