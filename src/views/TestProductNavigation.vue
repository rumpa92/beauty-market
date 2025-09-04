<template>
  <div class="test-navigation-page">
    <div class="market-container">
      <h1>Test Product Navigation</h1>
      <p>Click on any product below to verify navigation to the Product Detail Page:</p>
      
      <!-- Test Product Cards -->
      <div class="test-products-grid">
        <div 
          v-for="product in testProducts"
          :key="product.id"
          class="test-product-card"
          @click="navigateToProduct(product.id)"
        >
          <div class="product-image-container">
            <img :src="product.image" :alt="product.name" class="product-image" />
            <div class="quick-nav-overlay">
              <span>Click to view Product Detail Page</span>
            </div>
          </div>
          <div class="product-info">
            <div class="product-brand">{{ product.brand }}</div>
            <h3 class="product-name">{{ product.name }}</h3>
            <div class="product-price">₹{{ product.price.toLocaleString() }}</div>
          </div>
        </div>
      </div>

      <!-- Direct Navigation Links -->
      <div class="direct-links">
        <h2>Direct Product Links</h2>
        <div class="link-grid">
          <router-link 
            v-for="product in testProducts"
            :key="'link-' + product.id"
            :to="`/product/${product.id}`"
            class="direct-link"
          >
            <i class="fas fa-external-link-alt"></i>
            {{ product.name }}
          </router-link>
        </div>
      </div>

      <!-- Test Cart Integration -->
      <div class="cart-test">
        <h2>Test Cart Integration</h2>
        <p>Cart Items: {{ cartItems.length }}</p>
        <div v-if="cartItems.length > 0" class="cart-items">
          <div v-for="item in cartItems" :key="item.id" class="cart-item">
            <span>{{ item.name }} - Qty: {{ item.quantity }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TestProductNavigation',
  data() {
    return {
      testProducts: [
        {
          id: 1,
          name: 'Hydrating Vitamin C Face Serum',
          brand: 'GlowLux Premium',
          price: 1299,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
        },
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          price: 1950,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
        },
        {
          id: 3,
          name: 'Matte Lipstick Collection',
          brand: 'LipLux',
          price: 749,
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop'
        },
        {
          id: 4,
          name: 'Gentle Cleansing Oil',
          brand: 'PureClean',
          price: 1049,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems'])
  },
  methods: {
    navigateToProduct(productId) {
      console.log(`Navigating to product ${productId}`);
      this.$router.push(`/product/${productId}`);
    }
  }
};
</script>

<style scoped>
.test-navigation-page {
  padding: 40px 0;
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
  min-height: 100vh;
}

.test-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.test-product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.test-product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  border-color: var(--market-primary);
}

.product-image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.test-product-card:hover .product-image {
  transform: scale(1.05);
}

.quick-nav-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(236, 72, 153, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.test-product-card:hover .quick-nav-overlay {
  opacity: 1;
}

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
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--market-primary);
}

.direct-links {
  margin-bottom: 40px;
}

.direct-links h2 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--market-text);
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.direct-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  text-decoration: none;
  color: var(--market-text);
  font-weight: 500;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.direct-link:hover {
  color: var(--market-primary);
  border-color: var(--market-primary);
  transform: translateY(-2px);
}

.direct-link i {
  color: var(--market-primary);
}

.cart-test {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.cart-test h2 {
  color: var(--market-text);
  margin-bottom: 16px;
}

.cart-items {
  margin-top: 16px;
}

.cart-item {
  padding: 8px 0;
  border-bottom: 1px solid var(--market-border);
  color: var(--market-text);
}

.cart-item:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .test-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .link-grid {
    grid-template-columns: 1fr;
  }
}
</style>
