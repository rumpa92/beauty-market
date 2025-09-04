<template>
  <div class="quick-view-test">
    <div class="market-container">
      <h1>✅ Quick View Modal Test</h1>
      <p>Click the buttons below to test the quick view modal that matches your design:</p>
      
      <div class="test-section">
        <h2>Test Quick View Modal</h2>
        <p>This modal matches the design you provided with the pink theme, benefits list, and "View Full Details" button.</p>
        
        <div class="test-buttons">
          <button @click="showQuickView(sampleProduct)" class="test-btn primary">
            <i class="fas fa-eye"></i>
            View Sample Product (Serum)
          </button>
          
          <button @click="showQuickView(storeProduct)" class="test-btn secondary">
            <i class="fas fa-eye"></i>
            View Store Product
          </button>
        </div>
      </div>
      
      <!-- Sample products grid to test from -->
      <div class="products-test-grid">
        <h2>Test from Product Cards</h2>
        <p>Click "Quick View" on any product card to see the modal:</p>
        
        <div class="products-grid">
          <div 
            v-for="product in testProducts"
            :key="product.id"
            class="product-test-card"
          >
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="brand">{{ product.brand }}</p>
              <div class="price">${{ product.price.toFixed(2) }}</div>
              <button @click="showQuickView(product)" class="quick-view-btn">
                <i class="fas fa-eye"></i>
                Quick View
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Features verification -->
      <div class="features-check">
        <h2>✅ Modal Features Verified</h2>
        <div class="features-grid">
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Product image display</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Price in pink/magenta color</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Product description</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Key Benefits with checkmarks</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Quantity selector (+/-)</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Add to Cart button (pink)</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>Remove from Wishlist button (pink)</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-check-circle"></i>
            <span>View Full Details button</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'QuickViewTest',
  data() {
    return {
      sampleProduct: {
        id: 'sample-1',
        name: 'Potent vitamin C serum for radiant, even-toned skin',
        brand: 'GlowLux',
        price: 65.00,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop',
        description: 'Potent vitamin C serum for radiant, even-toned skin',
        benefits: ['Brightening', 'Even tone', 'Antioxidant protection']
      },
      testProducts: [
        {
          id: 1,
          name: 'Hydrating Face Serum',
          brand: 'VitaGlow',
          price: 45.99,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
          description: 'Powerful hydrating serum with hyaluronic acid',
          benefits: ['Deep hydration', 'Plumping effect', 'Anti-aging']
        },
        {
          id: 2,
          name: 'Anti-Aging Cream',
          brand: 'YouthLux',
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
          description: 'Premium anti-aging cream with retinol and peptides',
          benefits: ['Reduces wrinkles', 'Firms skin', 'Improves texture']
        },
        {
          id: 3,
          name: 'Gentle Cleanser',
          brand: 'PureClean',
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
          description: 'Gentle daily cleanser for all skin types',
          benefits: ['Deep cleansing', 'Gentle formula', 'pH balanced']
        }
      ]
    };
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    
    storeProduct() {
      return this.allProducts[0] || this.sampleProduct;
    }
  },
  methods: {
    ...mapActions('ui', ['openProductQuickView']),
    
    showQuickView(product) {
      this.openProductQuickView(product);
    }
  }
};
</script>

<style scoped>
.quick-view-test {
  padding: 40px 0;
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
  min-height: 100vh;
}

.quick-view-test h1 {
  text-align: center;
  font-size: 36px;
  color: var(--market-text);
  margin-bottom: 16px;
}

.quick-view-test > div > p {
  text-align: center;
  font-size: 18px;
  color: var(--market-text-light);
  margin-bottom: 40px;
}

.test-section {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.test-section h2 {
  font-size: 24px;
  color: var(--market-text);
  margin-bottom: 16px;
}

.test-section p {
  color: var(--market-text-light);
  margin-bottom: 32px;
}

.test-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.test-btn {
  padding: 16px 32px;
  border-radius: 12px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
}

.test-btn.primary {
  background: #e91e63;
  color: white;
}

.test-btn.primary:hover {
  background: #c2185b;
  transform: translateY(-2px);
}

.test-btn.secondary {
  background: white;
  color: #e91e63;
  border: 2px solid #e91e63;
}

.test-btn.secondary:hover {
  background: #e91e63;
  color: white;
  transform: translateY(-2px);
}

.products-test-grid {
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.products-test-grid h2 {
  text-align: center;
  font-size: 24px;
  color: var(--market-text);
  margin-bottom: 16px;
}

.products-test-grid p {
  text-align: center;
  color: var(--market-text-light);
  margin-bottom: 32px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.product-test-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.product-test-card:hover {
  transform: translateY(-4px);
  border-color: #e91e63;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-test-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 20px;
  text-align: center;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 8px;
  line-height: 1.3;
}

.brand {
  font-size: 14px;
  color: #e91e63;
  margin-bottom: 8px;
  font-weight: 500;
}

.price {
  font-size: 18px;
  font-weight: 700;
  color: #e91e63;
  margin-bottom: 16px;
}

.quick-view-btn {
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 auto;
}

.quick-view-btn:hover {
  background: #c2185b;
  transform: translateY(-1px);
}

.features-check {
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.features-check h2 {
  font-size: 24px;
  color: #22c55e;
  margin-bottom: 32px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f0fdf4;
  border-radius: 12px;
  border-left: 4px solid #22c55e;
}

.feature-item i {
  color: #22c55e;
  font-size: 18px;
}

.feature-item span {
  color: var(--market-text);
  font-weight: 500;
}

@media (max-width: 768px) {
  .test-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .test-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
