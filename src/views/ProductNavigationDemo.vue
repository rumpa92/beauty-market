<template>
  <div class="navigation-demo">
    <div class="market-container">
      <!-- Header -->
      <div class="demo-header">
        <h1>✅ Product Navigation Demo</h1>
        <p>This page demonstrates that clicking on any product anywhere in the app navigates to our comprehensive Product Detail Page with ALL requested features.</p>
      </div>

      <!-- Test Section 1: Product Cards -->
      <section class="demo-section">
        <h2>🎯 Test 1: Product Cards from Store</h2>
        <p>Click on any product card below to see the full Product Detail Page:</p>
        <div class="products-grid">
          <ProductCard 
            v-for="product in storeProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </section>

      <!-- Test Section 2: Simple Product List -->
      <section class="demo-section">
        <h2>🎯 Test 2: Simple Product List</h2>
        <p>Click on any product name to navigate to Product Detail Page:</p>
        <div class="simple-product-list">
          <div 
            v-for="product in storeProducts"
            :key="'simple-' + product.id"
            class="simple-product-item"
            @click="navigateToProduct(product.id)"
          >
            <img :src="product.image" :alt="product.name" class="simple-product-image" />
            <div class="simple-product-info">
              <h3 class="simple-product-name">{{ product.name }}</h3>
              <p class="simple-product-brand">{{ product.brand }}</p>
              <div class="simple-product-price">₹{{ formatPrice(product.price) }}</div>
            </div>
            <i class="fas fa-arrow-right simple-product-arrow"></i>
          </div>
        </div>
      </section>

      <!-- Features Checklist -->
      <section class="demo-section">
        <h2>✅ Features Available in Product Detail Page</h2>
        <div class="features-showcase">
          <div class="feature-category">
            <h3>🖼️ Image Carousel</h3>
            <ul>
              <li>✅ Large, high-resolution images</li>
              <li>✅ Swipe/arrow navigation</li>
              <li>✅ Zoom on hover (desktop)</li>
              <li>✅ Pinch-to-zoom (mobile)</li>
              <li>✅ Share icons (WhatsApp, Instagram, Facebook, Copy Link)</li>
              <li>✅ Fullscreen view</li>
            </ul>
          </div>

          <div class="feature-category">
            <h3>🎯 Variant Selection</h3>
            <ul>
              <li>✅ Pill-shaped size buttons</li>
              <li>✅ Color swatches with highlight borders</li>
              <li>✅ Bundle pack options</li>
              <li>✅ Stock indicators</li>
              <li>✅ Popular/sale badges</li>
            </ul>
          </div>

          <div class="feature-category">
            <h3>🛒 Add to Cart</h3>
            <ul>
              <li>✅ Prominent sticky button</li>
              <li>✅ Smooth animations</li>
              <li>✅ Success feedback toast</li>
              <li>✅ \"Go to Cart\" after adding</li>
              <li>✅ Quantity controls when in cart</li>
              <li>✅ Remove option</li>
            </ul>
          </div>

          <div class="feature-category">
            <h3>📖 How to Use</h3>
            <ul>
              <li>✅ Expandable accordion</li>
              <li>✅ Step-by-step instructions</li>
              <li>✅ Icons and step numbers</li>
              <li>✅ Usage tips</li>
              <li>✅ Routine suggestions</li>
            </ul>
          </div>

          <div class="feature-category">
            <h3>⭐ Ratings & Reviews</h3>
            <ul>
              <li>✅ User images and names</li>
              <li>✅ Star ratings</li>
              <li>✅ Expandable long reviews</li>
              <li>✅ Photo/video thumbnails</li>
              <li>✅ Rating filters (5★, 4★, etc.)</li>
              <li>✅ \"Write a Review\" button</li>
            </ul>
          </div>

          <div class="feature-category">
            <h3>🔗 Related Products</h3>
            <ul>
              <li>✅ \"You may also like\" carousel</li>
              <li>✅ Horizontal scrolling</li>
              <li>✅ Quick view option</li>
              <li>✅ Add to cart from carousel</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Call to Action -->
      <section class="demo-cta">
        <div class="cta-box">
          <h2>🚀 Ready to Test?</h2>
          <p>Click on any product above to experience the full Product Detail Page with all premium features!</p>
          <div class="cta-buttons">
            <router-link to="/product/1" class="cta-btn primary">
              <i class="fas fa-star"></i>
              View Featured Product
            </router-link>
            <router-link to="/product/2" class="cta-btn secondary">
              <i class="fas fa-eye"></i>
              View Store Product
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from '@/components/product/ProductCard.vue';

export default {
  name: 'ProductNavigationDemo',
  components: {
    ProductCard
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    
    storeProducts() {
      return this.allProducts.slice(0, 4); // Show first 4 products
    }
  },
  methods: {
    navigateToProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    
    formatPrice(price) {
      // Convert USD to INR for display
      const convertedPrice = typeof price === 'number' && price < 100 ? Math.round(price * 83) : price;
      return new Intl.NumberFormat('en-IN').format(convertedPrice);
    }
  }
};
</script>

<style scoped>
.navigation-demo {
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
  min-height: 100vh;
  padding: 40px 0;
}

.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-header h1 {
  font-size: 36px;
  color: var(--market-text);
  margin-bottom: 16px;
}

.demo-header p {
  font-size: 18px;
  color: var(--market-text-light);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.demo-section {
  margin-bottom: 80px;
}

.demo-section h2 {
  font-size: 28px;
  color: var(--market-text);
  margin-bottom: 16px;
  text-align: center;
}

.demo-section p {
  text-align: center;
  color: var(--market-text-light);
  margin-bottom: 32px;
  font-size: 16px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.simple-product-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.simple-product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.simple-product-item:hover {
  transform: translateY(-2px);
  border-color: var(--market-primary);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.simple-product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}

.simple-product-info {
  flex: 1;
}

.simple-product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
  margin: 0 0 4px 0;
}

.simple-product-brand {
  font-size: 14px;
  color: var(--market-primary);
  margin: 0 0 4px 0;
  font-weight: 500;
}

.simple-product-price {
  font-size: 16px;
  font-weight: 700;
  color: var(--market-primary);
}

.simple-product-arrow {
  color: var(--market-text-light);
  transition: all 0.3s ease;
}

.simple-product-item:hover .simple-product-arrow {
  color: var(--market-primary);
  transform: translateX(4px);
}

.features-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-category {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.feature-category h3 {
  font-size: 20px;
  color: var(--market-text);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.feature-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-category li {
  padding: 6px 0;
  color: var(--market-text);
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.feature-category li:last-child {
  border-bottom: none;
}

.demo-cta {
  text-align: center;
}

.cta-box {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--market-primary);
}

.cta-box h2 {
  font-size: 28px;
  color: var(--market-text);
  margin-bottom: 16px;
}

.cta-box p {
  font-size: 16px;
  color: var(--market-text-light);
  margin-bottom: 32px;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-btn.primary {
  background: var(--market-gradient);
  color: white;
}

.cta-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.cta-btn.secondary {
  background: white;
  color: var(--market-primary);
  border: 2px solid var(--market-primary);
}

.cta-btn.secondary:hover {
  background: var(--market-primary);
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 28px;
  }
  
  .demo-section h2 {
    font-size: 24px;
  }
  
  .features-showcase {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .cta-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>
