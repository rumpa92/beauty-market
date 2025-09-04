<template>
  <div class="add-to-cart-wrapper">
    <!-- If item is already in cart, show quantity controls -->
    <div v-if="itemInCart" class="cart-controls-container">
      <div class="cart-controls">
        <div class="quantity-section">
          <h4 class="in-cart-label">In Cart</h4>
          <div class="quantity-controls">
            <button 
              @click="decreaseQuantity" 
              class="qty-btn decrease"
              :disabled="itemInCart.quantity <= 1"
            >
              <i class="fas fa-minus"></i>
            </button>
            <span class="quantity-display">{{ itemInCart.quantity }}</span>
            <button 
              @click="increaseQuantity" 
              class="qty-btn increase"
              :disabled="itemInCart.quantity >= maxQuantity"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div>
        
        <button @click="removeFromCart" class="remove-btn">
          <i class="fas fa-trash"></i>
          Remove
        </button>
      </div>

      <!-- Go to Cart Button -->
      <button @click="goToCart" class="go-to-cart-btn">
        <i class="fas fa-shopping-cart"></i>
        Go to Cart
      </button>
    </div>

    <!-- If item is not in cart, show add to cart section -->
    <div v-else class="add-to-cart-section">
      <!-- Quantity Selector -->
      <div class="quantity-selector">
        <label class="quantity-label">Quantity</label>
        <div class="quantity-controls">
          <button 
            @click="quantity > 1 && quantity--" 
            class="qty-btn decrease"
            :disabled="quantity <= 1"
          >
            <i class="fas fa-minus"></i>
          </button>
          <input 
            v-model.number="quantity" 
            type="number" 
            class="quantity-input"
            :min="1" 
            :max="maxQuantity"
            @input="validateQuantity"
            @blur="handleQuantityBlur"
          />
          <button 
            @click="quantity < maxQuantity && quantity++" 
            class="qty-btn increase"
            :disabled="quantity >= maxQuantity"
          >
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div v-if="maxQuantity" class="quantity-limit">
          Max {{ maxQuantity }} per order
        </div>
      </div>
      
      <!-- Add to Cart Button -->
      <button 
        @click="addToCart" 
        class="add-to-cart-btn"
        :class="{ 
          loading: isAddingToCart,
          success: showSuccess,
          disabled: !canAddToCart
        }"
        :disabled="!canAddToCart || isAddingToCart"
      >
        <!-- Loading State -->
        <div v-if="isAddingToCart" class="btn-content loading">
          <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
          </div>
          <span>Adding...</span>
        </div>
        
        <!-- Success State -->
        <div v-else-if="showSuccess" class="btn-content success">
          <div class="success-icon">
            <i class="fas fa-check"></i>
          </div>
          <span>Added to Cart!</span>
        </div>
        
        <!-- Default State -->
        <div v-else class="btn-content default">
          <div class="cart-icon">
            <i class="fas fa-shopping-bag"></i>
            <div class="cart-badge" v-if="cartItemCount > 0">
              {{ cartItemCount }}
            </div>
          </div>
          <span>Add to Cart</span>
          <div v-if="selectedVariant && selectedVariant.price" class="price-display">
            ₹{{ formatPrice(selectedVariant.price * quantity) }}
          </div>
        </div>
      </button>
    </div>

    <!-- Stock Information -->
    <div class="stock-info">
      <div v-if="stockStatus === 'out-of-stock'" class="stock-message out-of-stock">
        <i class="fas fa-times-circle"></i>
        <span>Out of Stock</span>
      </div>
      <div v-else-if="stockStatus === 'low-stock'" class="stock-message low-stock">
        <i class="fas fa-exclamation-triangle"></i>
        <span>Only {{ availableStock }} left in stock</span>
      </div>
      <div v-else-if="stockStatus === 'in-stock'" class="stock-message in-stock">
        <i class="fas fa-check-circle"></i>
        <span>In Stock</span>
      </div>
    </div>

    <!-- Delivery Information -->
    <div class="delivery-info">
      <div class="delivery-item">
        <i class="fas fa-truck"></i>
        <span>Free delivery on orders over ₹499</span>
      </div>
      <div class="delivery-item">
        <i class="fas fa-undo"></i>
        <span>7 days easy returns</span>
      </div>
      <div class="delivery-item">
        <i class="fas fa-shield-alt"></i>
        <span>100% authentic products</span>
      </div>
    </div>

    <!-- Floating Add to Cart (Sticky) -->
    <div v-if="showStickyButton && !itemInCart" class="sticky-add-to-cart" :class="{ visible: showSticky }">
      <div class="sticky-content">
        <div class="sticky-product-info">
          <img :src="productImage" :alt="productName" class="sticky-product-image" />
          <div class="sticky-product-details">
            <div class="sticky-product-name">{{ productName }}</div>
            <div class="sticky-product-price">₹{{ formatPrice(totalPrice) }}</div>
          </div>
        </div>
        
        <button 
          @click="addToCart" 
          class="sticky-add-btn"
          :disabled="!canAddToCart || isAddingToCart"
        >
          <i v-if="isAddingToCart" class="fas fa-spinner fa-spin"></i>
          <i v-else class="fas fa-shopping-bag"></i>
          <span>{{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}</span>
        </button>
      </div>
    </div>

    <!-- Success Animation Overlay -->
    <div v-if="showSuccessOverlay" class="success-overlay">
      <div class="success-animation">
        <div class="success-checkmark">
          <i class="fas fa-check"></i>
        </div>
        <div class="success-text">Added to Cart!</div>
        <div class="success-product">{{ productName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'AddToCartButton',
  props: {
    product: {
      type: Object,
      required: true
    },
    selectedVariant: {
      type: Object,
      default: null
    },
    maxQuantity: {
      type: Number,
      default: 99
    },
    showStickyButton: {
      type: Boolean,
      default: true
    },
    availableStock: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      quantity: 1,
      isAddingToCart: false,
      showSuccess: false,
      showSuccessOverlay: false,
      showSticky: false,
      intersectionObserver: null
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems', 'cartItemCount']),
    
    itemInCart() {
      return this.cartItems.find(item => 
        item.id === this.product.id && 
        this.variantsMatch(item, this.selectedVariant)
      );
    },
    
    canAddToCart() {
      return this.stockStatus !== 'out-of-stock' && 
             this.quantity > 0 && 
             this.quantity <= this.maxQuantity;
    },
    
    stockStatus() {
      if (this.availableStock === 0) return 'out-of-stock';
      if (this.availableStock && this.availableStock <= 5) return 'low-stock';
      return 'in-stock';
    },
    
    productName() {
      return this.product.name || '';
    },
    
    productImage() {
      return this.product.image || 
             (this.product.images && this.product.images[0]) || 
             '';
    },
    
    totalPrice() {
      const basePrice = this.selectedVariant?.price || this.product.price || 0;
      return basePrice * this.quantity;
    }
  },
  methods: {
    ...mapActions('cart', ['addToCart', 'updateQuantity', 'removeFromCart', 'openCart']),
    
    async addToCart() {
      if (!this.canAddToCart || this.isAddingToCart) return;
      
      this.isAddingToCart = true;
      
      try {
        const cartItem = {
          ...this.product,
          quantity: this.quantity,
          selectedVariant: this.selectedVariant,
          addedAt: new Date().toISOString()
        };
        
        await this.addToCart(cartItem);
        
        // Show success states
        this.showSuccessStates();
        
        // Emit success event
        this.$emit('added-to-cart', {
          product: this.product,
          quantity: this.quantity,
          variant: this.selectedVariant
        });
        
      } catch (error) {
        console.error('Error adding to cart:', error);
        this.$emit('add-to-cart-error', error);
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    async increaseQuantity() {
      if (!this.itemInCart) return;
      
      await this.updateQuantity({
        productId: this.product.id,
        quantity: this.itemInCart.quantity + 1,
        variant: this.selectedVariant
      });
    },
    
    async decreaseQuantity() {
      if (!this.itemInCart || this.itemInCart.quantity <= 1) return;
      
      await this.updateQuantity({
        productId: this.product.id,
        quantity: this.itemInCart.quantity - 1,
        variant: this.selectedVariant
      });
    },
    
    async removeFromCart() {
      if (!this.itemInCart) return;
      
      await this.removeFromCart({
        productId: this.product.id,
        variant: this.selectedVariant
      });
      
      this.$emit('removed-from-cart', {
        product: this.product,
        variant: this.selectedVariant
      });
    },
    
    goToCart() {
      this.openCart();
      this.$router.push('/cart');
    },
    
    showSuccessStates() {
      // Show button success state
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
      }, 2000);
      
      // Show overlay animation
      this.showSuccessOverlay = true;
      setTimeout(() => {
        this.showSuccessOverlay = false;
      }, 3000);
      
      // Trigger cart confirmation after delay
      setTimeout(() => {
        this.$emit('show-cart-confirmation', {
          product: this.product,
          quantity: this.quantity
        });
      }, 1500);
    },
    
    validateQuantity() {
      if (this.quantity < 1) {
        this.quantity = 1;
      } else if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
      }
    },
    
    handleQuantityBlur() {
      if (!this.quantity || isNaN(this.quantity)) {
        this.quantity = 1;
      }
      this.validateQuantity();
    },
    
    variantsMatch(cartItem, selectedVariant) {
      if (!cartItem.selectedVariant && !selectedVariant) return true;
      if (!cartItem.selectedVariant || !selectedVariant) return false;
      
      return JSON.stringify(cartItem.selectedVariant) === JSON.stringify(selectedVariant);
    },
    
    formatPrice(price) {
      return new Intl.NumberFormat('en-IN').format(price);
    },
    
    setupStickyButton() {
      if (!this.showStickyButton) return;
      
      // Create intersection observer for sticky button
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            this.showSticky = !entry.isIntersecting;
          });
        },
        { threshold: 0.1 }
      );
      
      // Observe the main add to cart section
      const mainSection = this.$el.querySelector('.add-to-cart-section');
      if (mainSection) {
        this.intersectionObserver.observe(mainSection);
      }
    }
  },
  
  mounted() {
    this.setupStickyButton();
  },
  
  beforeDestroy() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
  },
  
  watch: {
    selectedVariant() {
      // Reset quantity when variant changes
      this.quantity = 1;
    }
  }
};
</script>

<style scoped>
.add-to-cart-wrapper {
  position: relative;
}

/* Cart Controls (when item is in cart) */
.cart-controls-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 2px solid #22c55e;
}

.quantity-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.in-cart-label {
  font-size: 14px;
  color: #22c55e;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-btn {
  width: 36px;
  height: 36px;
  border: 2px solid var(--market-border);
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--market-text);
}

.qty-btn:hover:not(:disabled) {
  border-color: var(--market-primary);
  color: var(--market-primary);
  transform: scale(1.05);
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  font-weight: 700;
  font-size: 18px;
  min-width: 30px;
  text-align: center;
  color: var(--market-text);
}

.quantity-input {
  width: 60px;
  height: 36px;
  border: 2px solid var(--market-border);
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  background: white;
  color: var(--market-text);
}

.quantity-input:focus {
  outline: none;
  border-color: var(--market-primary);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.remove-btn {
  background: #fef2f2;
  color: #dc2626;
  border: 2px solid #fecaca;
  border-radius: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
  transform: translateY(-1px);
}

.go-to-cart-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
}

.go-to-cart-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

/* Add to Cart Section */
.add-to-cart-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.quantity-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quantity-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
}

.quantity-limit {
  font-size: 12px;
  color: var(--market-text-light);
}

/* Add to Cart Button */
.add-to-cart-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 16px;
  padding: 0;
  font-weight: 600;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 64px;
  position: relative;
  overflow: hidden;
  width: 100%;
}

.add-to-cart-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(236, 72, 153, 0.4);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.add-to-cart-btn.loading {
  background: #9ca3af;
}

.add-to-cart-btn.success {
  background: #22c55e;
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px 32px;
  height: 100%;
}

.btn-content.loading .loading-spinner {
  animation: pulse 1.5s ease-in-out infinite;
}

.btn-content.success .success-icon {
  animation: bounceIn 0.6s ease-out;
}

.cart-icon {
  position: relative;
  font-size: 20px;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price-display {
  font-size: 16px;
  font-weight: 700;
  margin-left: auto;
}

/* Stock Information */
.stock-info {
  margin-top: 16px;
}

.stock-message {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 8px;
}

.stock-message.in-stock {
  color: #059669;
  background: #ecfdf5;
}

.stock-message.low-stock {
  color: #d97706;
  background: #fffbeb;
}

.stock-message.out-of-stock {
  color: #dc2626;
  background: #fef2f2;
}

/* Delivery Info */
.delivery-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
  background: var(--market-secondary);
  border-radius: 12px;
}

.delivery-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--market-text);
  font-size: 14px;
}

.delivery-item i {
  color: #22c55e;
  width: 16px;
}

/* Sticky Add to Cart */
.sticky-add-to-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid var(--market-border);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  backdrop-filter: blur(10px);
}

.sticky-add-to-cart.visible {
  transform: translateY(0);
}

.sticky-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.sticky-product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sticky-product-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.sticky-product-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sticky-product-name {
  font-weight: 600;
  color: var(--market-text);
  font-size: 14px;
}

.sticky-product-price {
  font-weight: 700;
  color: var(--market-primary);
  font-size: 16px;
}

.sticky-add-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sticky-add-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.sticky-add-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Success Overlay */
.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

.success-animation {
  background: white;
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  animation: slideUp 0.5s ease;
  max-width: 400px;
  margin: 0 20px;
}

.success-checkmark {
  width: 80px;
  height: 80px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 40px;
  color: white;
  animation: checkmarkBounce 0.6s ease;
}

.success-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
  margin-bottom: 8px;
}

.success-product {
  font-size: 16px;
  color: var(--market-text-light);
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes checkmarkBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .cart-controls {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }
  
  .add-to-cart-section {
    gap: 16px;
  }
  
  .quantity-selector {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .btn-content {
    padding: 16px 24px;
  }
  
  .sticky-content {
    padding: 12px 16px;
  }
  
  .sticky-product-image {
    width: 40px;
    height: 40px;
  }
  
  .sticky-product-name {
    font-size: 12px;
  }
  
  .sticky-product-price {
    font-size: 14px;
  }
  
  .sticky-add-btn {
    padding: 10px 20px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .delivery-info {
    padding: 12px;
  }
  
  .delivery-item {
    font-size: 13px;
  }
  
  .success-animation {
    padding: 30px 20px;
    margin: 0 16px;
  }
  
  .success-checkmark {
    width: 60px;
    height: 60px;
    font-size: 30px;
  }
  
  .success-text {
    font-size: 20px;
  }
  
  .success-product {
    font-size: 14px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .add-to-cart-btn,
  .sticky-add-to-cart,
  .success-overlay,
  .success-animation,
  .success-checkmark {
    animation: none;
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .add-to-cart-btn {
    border: 2px solid currentColor;
  }
  
  .stock-message {
    border: 1px solid currentColor;
  }
}
</style>
