<template>
  <transition name="slide-over">
    <div v-if="isCartOpen" class="cart-overlay" @click="closeCart">
      <div class="cart-sidebar" @click.stop>
        <div class="cart-header">
          <h2 class="cart-title">Shopping Cart</h2>
          <button class="close-btn" @click="closeCart">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div v-if="cartItems.length === 0" class="empty-cart">
          <i class="fas fa-shopping-bag empty-icon"></i>
          <h3>Your cart is empty</h3>
          <p>Add some products to get started</p>
          <router-link to="/products" class="btn btn-primary" @click="closeCart">
            Shop Now
          </router-link>
        </div>

        <div v-else class="cart-content">
          <div class="cart-items">
            <div v-for="item in cartItems" :key="item.id" class="cart-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name">
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-brand">{{ item.brand }}</p>
                <div class="item-price">${{ item.price.toFixed(2) }}</div>
              </div>
              <div class="item-actions">
                <div class="quantity-controls">
                  <button @click="decreaseQuantity(item.id)" class="qty-btn">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button @click="increaseQuantity(item.id)" class="qty-btn">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <button @click="removeItem(item.id)" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="cart-footer">
            <div class="cart-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>${{ cartSubtotal.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>${{ shippingCost.toFixed(2) }}</span>
              </div>
              <div v-if="promoDiscount > 0" class="summary-row discount">
                <span>Discount ({{ promoCode }})</span>
                <span>-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>${{ finalTotal.toFixed(2) }}</span>
              </div>
            </div>
            <div class="cart-actions">
              <router-link to="/cart" class="btn btn-secondary" @click="closeCart">
                View Cart
              </router-link>
              <router-link to="/checkout" class="btn btn-primary checkout-btn" @click="closeCart">
                Checkout
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CartSidebar',
  computed: {
    ...mapGetters('cart', [
      'isCartOpen', 
      'cartItems', 
      'cartSubtotal', 
      'shippingCost', 
      'discountAmount', 
      'finalTotal',
      'promoCode',
      'promoDiscount'
    ])
  },
  methods: {
    ...mapActions('cart', ['closeCart', 'updateQuantity', 'removeFromCart']),
    increaseQuantity(productId) {
      const item = this.cartItems.find(item => item.id === productId);
      this.updateQuantity({ productId, quantity: item.quantity + 1 });
    },
    decreaseQuantity(productId) {
      const item = this.cartItems.find(item => item.id === productId);
      if (item.quantity > 1) {
        this.updateQuantity({ productId, quantity: item.quantity - 1 });
      }
    },
    removeItem(productId) {
      this.removeFromCart(productId);
    }
  }
};
</script>

<style scoped>
.slide-over-enter-active, .slide-over-leave-active {
  transition: all 0.3s ease;
}

.slide-over-enter, .slide-over-leave-to {
  opacity: 0;
}

.slide-over-enter .cart-sidebar, .slide-over-leave-to .cart-sidebar {
  transform: translateX(100%);
}

.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 400px;
  max-width: 90vw;
  background: white;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  transform: translateX(0);
  transition: transform 0.3s ease;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.cart-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--gray-500);
  font-size: 18px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  color: var(--gray-300);
  margin-bottom: 16px;
}

.empty-cart h3 {
  margin-bottom: 8px;
  color: var(--gray-700);
}

.empty-cart p {
  color: var(--gray-500);
  margin-bottom: 24px;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
}

.cart-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--gray-100);
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-brand {
  font-size: 12px;
  color: var(--gray-500);
  margin-bottom: 8px;
}

.item-price {
  font-weight: 600;
  color: var(--primary-600);
  font-size: 14px;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--gray-100);
  border-radius: 6px;
  padding: 4px;
}

.qty-btn {
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  font-size: 10px;
  transition: all 0.2s ease;
}

.qty-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.quantity {
  font-size: 14px;
  font-weight: 500;
  min-width: 20px;
  text-align: center;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.remove-btn:hover {
  color: var(--error-500);
}

.cart-footer {
  border-top: 1px solid var(--gray-200);
  padding: 24px;
}

.cart-summary {
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.summary-row.discount {
  color: var(--success-500);
}

.summary-row.total {
  font-weight: 600;
  font-size: 16px;
  color: var(--gray-800);
  border-top: 1px solid var(--gray-200);
  padding-top: 8px;
  margin-top: 8px;
}

.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkout-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
}

@media (max-width: 480px) {
  .cart-sidebar {
    width: 100vw;
  }
  
  .cart-header {
    padding: 20px 16px;
  }
  
  .cart-items {
    padding: 16px;
  }
  
  .cart-footer {
    padding: 20px 16px;
  }
}
</style>
