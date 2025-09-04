<template>
  <div class="cart-demo-page">
    <div class="container">
      <!-- Demo Header -->
      <div class="demo-header">
        <h1 class="demo-title">Cart & Checkout Demo</h1>
        <p class="demo-description">Test the cart and checkout functionality with sample products</p>
      </div>

      <!-- Demo Actions -->
      <div class="demo-actions">
        <button @click="addSampleItems" class="btn btn-primary">
          <i class="fas fa-plus"></i>
          Add Sample Items to Cart
        </button>
        <button @click="clearCart" class="btn btn-secondary">
          <i class="fas fa-trash"></i>
          Clear Cart
        </button>
        <button @click="openCart" class="btn btn-accent">
          <i class="fas fa-shopping-bag"></i>
          Open Cart Sidebar ({{ cartItemCount }})
        </button>
      </div>

      <!-- Sample Products -->
      <div class="sample-products">
        <h2>Sample Beauty Products</h2>
        <div class="products-grid">
          <div v-for="product in sampleProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
            </div>
            <div class="product-details">
              <div class="product-brand">{{ product.brand }}</div>
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">₹{{ product.price }}</div>
              <button @click="addToCart(product)" class="btn btn-primary btn-sm">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Status -->
      <div class="cart-status">
        <h3>Current Cart Status</h3>
        <div v-if="cartItems.length === 0" class="empty-cart-status">
          <p>Cart is empty. Add some products to test!</p>
        </div>
        <div v-else class="cart-items-status">
          <div class="cart-summary-box">
            <div class="summary-item">
              <span>Items in Cart:</span>
              <span>{{ cartItemCount }}</span>
            </div>
            <div class="summary-item">
              <span>Subtotal:</span>
              <span>₹{{ cartSubtotal.toFixed(2) }}</span>
            </div>
            <div class="summary-item">
              <span>Shipping:</span>
              <span>{{ shippingCost > 0 ? `₹${shippingCost.toFixed(2)}` : 'FREE' }}</span>
            </div>
            <div class="summary-item total">
              <span>Total:</span>
              <span>₹{{ finalTotal.toFixed(2) }}</span>
            </div>
          </div>
          
          <!-- Cart Items List -->
          <div class="cart-items-list">
            <div v-for="item in cartItems" :key="item.id" class="cart-item-mini">
              <img :src="item.image" :alt="item.name" class="item-image">
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-details">
                  <span class="item-brand">{{ item.brand }}</span>
                  <span class="item-qty">Qty: {{ item.quantity }}</span>
                  <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="decreaseQuantity(item.id)" class="qty-btn">
                  <i class="fas fa-minus"></i>
                </button>
                <span class="qty-display">{{ item.quantity }}</span>
                <button @click="increaseQuantity(item.id)" class="qty-btn">
                  <i class="fas fa-plus"></i>
                </button>
                <button @click="removeItem(item.id)" class="remove-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="checkout-actions" v-if="cartItems.length > 0">
        <router-link to="/cart" class="btn btn-outline btn-lg">
          <i class="fas fa-shopping-cart"></i>
          View Full Cart
        </router-link>
        <router-link to="/checkout" class="btn btn-primary btn-lg">
          <i class="fas fa-lock"></i>
          Proceed to Checkout
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'CartDemo',
  data() {
    return {
      sampleProducts: [
        {
          id: 1,
          name: 'Hydrating Face Moisturizer',
          brand: 'GlowLux',
          price: 1299,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop'
        },
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          price: 899,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'
        },
        {
          id: 3,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          price: 599,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300&h=300&fit=crop'
        },
        {
          id: 4,
          name: 'Anti-Aging Eye Cream',
          brand: 'YouthGlow',
          price: 1599,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('cart', [
      'cartItems',
      'cartItemCount',
      'cartSubtotal',
      'shippingCost',
      'finalTotal',
      'isCartOpen'
    ])
  },
  methods: {
    ...mapActions('cart', [
      'addToCart',
      'removeFromCart',
      'updateQuantity',
      'clearCart',
      'toggleCart'
    ]),
    addSampleItems() {
      this.sampleProducts.forEach(product => {
        this.addToCart({ ...product, quantity: 1 });
      });
      this.$store.dispatch('ui/showNotification', {
        type: 'success',
        message: 'Sample items added to cart!'
      });
    },
    openCart() {
      this.toggleCart();
    },
    removeItem(id) {
      this.removeFromCart(id);
    },
    increaseQuantity(id) {
      const item = this.cartItems.find(item => item.id === id);
      if (item) {
        this.updateQuantity({ productId: id, quantity: item.quantity + 1 });
      }
    },
    decreaseQuantity(id) {
      const item = this.cartItems.find(item => item.id === id);
      if (item && item.quantity > 1) {
        this.updateQuantity({ productId: id, quantity: item.quantity - 1 });
      } else if (item && item.quantity === 1) {
        this.removeFromCart(id);
      }
    }
  }
};
</script>

<style scoped>
.cart-demo-page {
  padding: 40px 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faff 0%, #fef7ff 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.demo-header {
  text-align: center;
  margin-bottom: 40px;
}

.demo-title {
  font-size: 36px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.demo-description {
  font-size: 18px;
  color: #6b7280;
  margin-bottom: 0;
}

.demo-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #e5e7eb;
  color: #374151;
}

.btn-accent {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.btn-outline {
  background: transparent;
  color: #ec4899;
  border: 2px solid #ec4899;
}

.btn-outline:hover {
  background: #ec4899;
  color: white;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 12px;
}

.btn-lg {
  padding: 16px 32px;
  font-size: 16px;
}

.sample-products {
  margin-bottom: 48px;
}

.sample-products h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.product-image {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-brand {
  font-size: 12px;
  color: #8b5cf6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: #ec4899;
  margin-bottom: 16px;
}

.cart-status {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.cart-status h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.empty-cart-status {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.cart-summary-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-item.total {
  font-weight: 700;
  font-size: 16px;
  padding-top: 12px;
  border-top: 2px solid #e5e7eb;
  margin-top: 12px;
  color: #1f2937;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cart-item-mini {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.item-details {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: #6b7280;
}

.item-brand {
  color: #8b5cf6;
  font-weight: 600;
}

.item-price {
  color: #ec4899;
  font-weight: 600;
}

.item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #6b7280;
}

.qty-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.qty-display {
  min-width: 24px;
  text-align: center;
  font-weight: 600;
  color: #1f2937;
}

.remove-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #dc2626;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  margin-left: 4px;
}

.remove-btn:hover {
  background: #fecaca;
}

.checkout-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .demo-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .cart-item-mini {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .item-actions {
    width: 100%;
    justify-content: center;
  }
  
  .checkout-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
