<template>
  <div class="cart-page">
    <PageHeader
      title="Shopping Cart"
      :subtitle="cartItems.length > 0 ? `${cartItemCount} items in cart` : 'Your cart is empty'"
    />
    <div class="market-container">
      <!-- Cart Header -->
      <div class="cart-header">
        <h1 class="cart-title">Your Shopping Cart</h1>
        <p class="cart-description">
          Review your selected items, update quantities, or proceed to checkout to complete your purchase.
        </p>
      </div>

      <!-- Empty Cart State -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-icon">
          <i class="fas fa-shopping-bag"></i>
        </div>
        <h2 class="empty-cart-title">Your cart is empty</h2>
        <p class="empty-cart-text">Looks like you haven't added any items to your cart yet.</p>
        <router-link to="/products" class="btn btn-primary">
          <i class="fas fa-arrow-left"></i>
          Start Shopping
        </router-link>
      </div>

      <!-- Cart Content -->
      <div v-else class="cart-content">
        <div class="cart-items-section">
          <div class="cart-items-header">
            <h3>Items in Cart ({{ cartItemCount }})</h3>
          </div>

          <!-- Cart Items List -->
          <div class="cart-items-list">
            <div 
              v-for="item in cartItems" 
              :key="item.id" 
              class="cart-item"
            >
              <!-- Product Image -->
              <div class="cart-item-image">
                <img :src="item.image" :alt="item.name" />
              </div>

              <!-- Product Details -->
              <div class="cart-item-details">
                <div class="cart-item-info">
                  <div class="cart-item-brand">{{ item.brand }}</div>
                  <h4 class="cart-item-name">{{ item.name }}</h4>
                  <div v-if="item.selectedSize" class="cart-item-variant">
                    Size: {{ item.selectedSize }}
                  </div>
                  <div v-if="item.selectedColor" class="cart-item-variant">
                    Color: {{ item.selectedColor }}
                  </div>
                </div>

                <div class="cart-item-price">
                  <span class="item-price">${{ item.price.toFixed(2) }}</span>
                  <span v-if="item.originalPrice" class="item-original-price">
                    ${{ item.originalPrice.toFixed(2) }}
                  </span>
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="cart-item-quantity">
                <label class="quantity-label">Quantity</label>
                <div class="quantity-controls">
                  <button 
                    @click="decreaseQuantity(item.id)" 
                    class="quantity-btn"
                    :disabled="item.quantity <= 1"
                  >
                    <i class="fas fa-minus"></i>
                  </button>
                  <input 
                    type="number" 
                    :value="item.quantity" 
                    @input="updateQuantityInput(item.id, $event.target.value)"
                    min="1" 
                    max="10"
                    class="quantity-input"
                  />
                  <button 
                    @click="increaseQuantity(item.id)" 
                    class="quantity-btn"
                    :disabled="item.quantity >= 10"
                  >
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <!-- Item Total -->
              <div class="cart-item-total">
                <div class="item-total-price">
                  ${{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>

              <!-- Remove Button -->
              <div class="cart-item-actions">
                <button 
                  @click="removeItem(item.id)" 
                  class="remove-btn"
                  :title="`Remove ${item.name} from cart`"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Cart Summary -->
        <div class="cart-summary">
          <div class="summary-card">
            <h3 class="summary-title">Order Summary</h3>
            
            <div class="summary-row">
              <span class="summary-label">Subtotal ({{ cartItemCount }} items)</span>
              <span class="summary-value">${{ cartSubtotal.toFixed(2) }}</span>
            </div>

            <!-- Free Shipping Progress -->
            <div v-if="amountForFreeShipping > 0" class="free-shipping-progress">
              <div class="free-shipping-text">
                <i class="fas fa-truck"></i>
                Add <strong>${{ amountForFreeShipping.toFixed(2) }}</strong> for FREE shipping!
              </div>
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${((freeShippingThreshold - amountForFreeShipping) / freeShippingThreshold) * 100}%` }"
                ></div>
              </div>
            </div>

            <div class="summary-row">
              <span class="summary-label">Shipping</span>
              <span class="summary-value">
                <span v-if="qualifiesForFreeShipping" class="free-shipping-badge">
                  <i class="fas fa-check"></i> FREE
                </span>
                <span v-else>
                  {{ shippingCost > 0 ? `$${shippingCost.toFixed(2)}` : 'FREE' }}
                </span>
              </span>
            </div>

            <div v-if="promoDiscount > 0" class="summary-row discount-row">
              <span class="summary-label">
                Discount ({{ promoCode }})
              </span>
              <span class="summary-value discount-value">
                -${{ discountAmount.toFixed(2) }}
              </span>
            </div>

            <div class="summary-row">
              <span class="summary-label">Tax (8.5%)</span>
              <span class="summary-value">${{ taxAmount.toFixed(2) }}</span>
            </div>

            <div class="summary-divider"></div>

            <div class="summary-row total-row">
              <span class="summary-label">Total</span>
              <span class="summary-value total-value">${{ grandTotal.toFixed(2) }}</span>
            </div>

            <!-- Promo Code Section -->
            <div class="promo-section">
              <div class="promo-input-group">
                <input 
                  v-model="promoCodeInput"
                  type="text" 
                  placeholder="Enter promo code"
                  class="promo-input"
                  @keyup.enter="applyPromoCode"
                />
                <button 
                  @click="applyPromoCode" 
                  class="promo-btn"
                  :disabled="!promoCodeInput.trim()"
                >
                  Apply
                </button>
              </div>
              <div v-if="promoMessage" class="promo-message" :class="promoMessageType">
                {{ promoMessage }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="cart-actions">
              <router-link to="/products" class="btn btn-secondary">
                <i class="fas fa-arrow-left"></i>
                Continue Shopping
              </router-link>
              
              <router-link to="/checkout" class="btn btn-primary">
                <i class="fas fa-lock"></i>
                Proceed to Checkout
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import PageHeader from '../components/ui/PageHeader.vue';

export default {
  name: 'Cart',
  components: {
    PageHeader
  },
  data() {
    return {
      promoCodeInput: '',
      promoMessage: '',
      promoMessageType: ''
    };
  },
  computed: {
    ...mapGetters('cart', [
      'cartItems',
      'cartItemCount',
      'cartSubtotal',
      'shippingCost',
      'discountAmount',
      'finalTotal',
      'promoCode',
      'promoDiscount',
      'freeShippingThreshold',
      'amountForFreeShipping',
      'qualifiesForFreeShipping'
    ]),
    taxAmount() {
      const taxableAmount = this.cartSubtotal - this.discountAmount;
      return taxableAmount * 0.085; // 8.5% tax rate
    },
    grandTotal() {
      return this.cartSubtotal + this.shippingCost + this.taxAmount - this.discountAmount;
    }
  },
  methods: {
    ...mapActions('cart', [
      'updateQuantity',
      'removeFromCart',
      'applyPromoCode',
      'removePromoCode'
    ]),
    ...mapActions('ui', ['showNotification']),

    async increaseQuantity(productId) {
      try {
        await this.updateQuantity({
          productId,
          quantity: this.getItemQuantity(productId) + 1
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update quantity'
        });
      }
    },

    async decreaseQuantity(productId) {
      const currentQuantity = this.getItemQuantity(productId);
      if (currentQuantity <= 1) return;

      try {
        await this.updateQuantity({
          productId,
          quantity: currentQuantity - 1
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update quantity'
        });
      }
    },

    async updateQuantityInput(productId, value) {
      const quantity = parseInt(value);
      if (isNaN(quantity) || quantity < 1 || quantity > 10) return;

      try {
        await this.updateQuantity({
          productId,
          quantity
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to update quantity'
        });
      }
    },

    async removeItem(productId) {
      try {
        await this.removeFromCart(productId);
        this.showNotification({
          type: 'success',
          message: 'Item removed from cart'
        });
      } catch (error) {
        this.showNotification({
          type: 'error',
          message: 'Failed to remove item'
        });
      }
    },

    async applyPromoCode() {
      if (!this.promoCodeInput.trim()) return;

      try {
        const result = await this.applyPromoCode(this.promoCodeInput.trim());
        this.promoMessage = result.message;
        this.promoMessageType = result.success ? 'success' : 'error';
        
        if (result.success) {
          this.promoCodeInput = '';
        }
      } catch (error) {
        this.promoMessage = 'Failed to apply promo code';
        this.promoMessageType = 'error';
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        this.promoMessage = '';
        this.promoMessageType = '';
      }, 3000);
    },

    getItemQuantity(productId) {
      const item = this.cartItems.find(item => item.id === productId);
      return item ? item.quantity : 0;
    }
  }
};
</script>

<style scoped>
.cart-page {
  padding: 40px 0;
  background: var(--gray-50);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Cart Header */
.cart-header {
  text-align: center;
  margin-bottom: 40px;
}

.cart-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.cart-description {
  font-size: 1.1rem;
  color: var(--gray-600);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Empty Cart */
.empty-cart {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.empty-cart-icon {
  width: 120px;
  height: 120px;
  background: var(--gray-100);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  font-size: 48px;
  color: var(--gray-400);
}

.empty-cart-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 12px;
}

.empty-cart-text {
  color: var(--gray-600);
  margin-bottom: 32px;
  font-size: 1.1rem;
}

/* Cart Content */
.cart-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  align-items: start;
}

/* Cart Items Section */
.cart-items-section {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.cart-items-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--gray-200);
}

.cart-items-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.cart-items-list {
  padding: 0;
}

/* Cart Item */
.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr 120px 100px 40px;
  gap: 20px;
  padding: 24px;
  border-bottom: 1px solid var(--gray-100);
  align-items: center;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: var(--gray-100);
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cart-item-details {
  min-width: 0;
}

.cart-item-brand {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.cart-item-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  line-height: 1.3;
}

.cart-item-variant {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 2px;
}

.cart-item-price {
  margin-top: 8px;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-600);
}

.item-original-price {
  font-size: 14px;
  color: var(--gray-400);
  text-decoration: line-through;
  margin-left: 8px;
}

/* Quantity Controls */
.cart-item-quantity {
  text-align: center;
}

.quantity-label {
  display: block;
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  border: 2px solid var(--gray-200);
  border-radius: 6px;
  overflow: hidden;
}

.quantity-btn {
  background: var(--gray-50);
  border: none;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background: var(--gray-100);
  color: var(--gray-800);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  border: none;
  width: 56px;
  height: 32px;
  text-align: center;
  font-weight: 500;
  background: white;
}

.quantity-input:focus {
  outline: none;
}

/* Item Total */
.cart-item-total {
  text-align: center;
}

.item-total-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--gray-800);
}

/* Remove Button */
.cart-item-actions {
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-400);
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: var(--error-50);
  color: var(--error-500);
}

/* Cart Summary */
.summary-card {
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 24px;
  position: sticky;
  top: 20px;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-label {
  color: var(--gray-600);
  font-size: 15px;
}

.summary-value {
  font-weight: 500;
  color: var(--gray-800);
}

.discount-row .summary-label {
  color: var(--success-600);
}

.discount-value {
  color: var(--success-600) !important;
}

.summary-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 16px 0;
}

.total-row {
  margin-bottom: 24px;
}

.total-row .summary-label {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
}

.total-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-600) !important;
}

/* Free Shipping Progress */
.free-shipping-progress {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.free-shipping-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-700);
  font-size: 14px;
  margin-bottom: 12px;
}

.free-shipping-text i {
  color: var(--primary-600);
}

.progress-bar {
  height: 6px;
  background: var(--primary-100);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-500), var(--primary-600));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.free-shipping-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--success-600);
  font-weight: 600;
}

.free-shipping-badge i {
  color: var(--success-500);
}

/* Promo Code */
.promo-section {
  margin-bottom: 24px;
}

.promo-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.promo-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid var(--gray-200);
  border-radius: 6px;
  font-size: 14px;
}

.promo-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.promo-btn {
  background: var(--gray-100);
  border: 2px solid var(--gray-200);
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.promo-btn:hover:not(:disabled) {
  background: var(--gray-200);
}

.promo-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.promo-message {
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 6px;
  margin-top: 8px;
}

.promo-message.success {
  background: var(--success-50);
  color: var(--success-700);
  border: 1px solid var(--success-200);
}

.promo-message.error {
  background: var(--error-50);
  color: var(--error-700);
  border: 1px solid var(--error-200);
}

/* Action Buttons */
.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn {
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);
}

.btn-secondary {
  background: white;
  color: var(--gray-700);
  border-color: var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .cart-content {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .summary-card {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-title {
    font-size: 2rem;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    gap: 16px;
    padding: 20px 16px;
  }

  .cart-item-image {
    width: 60px;
    height: 60px;
  }

  .cart-item-quantity,
  .cart-item-total,
  .cart-item-actions {
    grid-column: 1 / -1;
    margin-top: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .cart-item-total {
    justify-content: flex-end;
  }

  .cart-item-actions {
    justify-content: center;
  }

  .quantity-controls {
    width: auto;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }

  .cart-actions {
    flex-direction: column-reverse;
  }
}
</style>
