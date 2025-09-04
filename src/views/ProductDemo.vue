<template>
  <div class="product-demo-page">
    <div class="container">
      <!-- Demo Header -->
      <div class="demo-header">
        <h1 class="demo-title">Modern Product Detail Page Demo</h1>
        <p class="demo-description">
          Experience our luxury beauty & fashion eCommerce Product Detail Page with advanced features
        </p>
      </div>

      <!-- Features Showcase -->
      <div class="features-showcase">
        <h2>✨ Key Features Included:</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🖼️</div>
            <h3>Image Carousel</h3>
            <p>High-resolution images with zoom on hover, swipe navigation, and thumbnail gallery</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Share Integration</h3>
            <p>WhatsApp, Instagram, Facebook, and copy link sharing options</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h3>Variants & Sizes</h3>
            <p>Size selection with pill buttons and color swatches for different variants</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🛒</div>
            <h3>Smart Cart</h3>
            <p>Add to cart with quantity controls, or modify existing cart items</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h3>How to Use</h3>
            <p>Step-by-step usage instructions with clear icons and numbered steps</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Reviews & Ratings</h3>
            <p>User reviews with photos, star ratings, expandable text, and write review functionality</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🧪</div>
            <h3>Ingredients</h3>
            <p>Detailed ingredient list with benefits and scientific information</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💎</div>
            <h3>Related Products</h3>
            <p>Horizontal scrolling carousel with "You may also like" recommendations</p>
          </div>
        </div>
      </div>

      <!-- Sample Products -->
      <div class="sample-products">
        <h2>🧴 Sample Beauty Products</h2>
        <div class="products-grid">
          <div v-for="product in sampleProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img :src="product.image" :alt="product.name">
              <div class="product-overlay">
                <router-link 
                  :to="`/modern-product/${product.id}`" 
                  class="view-detail-btn"
                >
                  View Details
                </router-link>
              </div>
            </div>
            <div class="product-info">
              <div class="product-brand">{{ product.brand }}</div>
              <h3 class="product-name">{{ product.name }}</h3>
              <div class="product-price">₹{{ product.price.toLocaleString() }}</div>
              <div class="product-rating">
                <div class="stars">
                  <i v-for="i in Math.floor(product.rating)" :key="i" class="star filled">★</i>
                  <i v-if="product.rating % 1 !== 0" class="star half">★</i>
                  <i v-for="i in (5 - Math.ceil(product.rating))" :key="'empty-' + i" class="star">★</i>
                </div>
                <span class="rating-text">({{ product.reviewCount }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Design Features -->
      <div class="design-features">
        <h2>🎨 Design Highlights</h2>
        <div class="design-grid">
          <div class="design-card">
            <h4>Premium Aesthetics</h4>
            <p>Soft pastel gradients, generous white space, and rounded edges for a luxury feel</p>
          </div>
          <div class="design-card">
            <h4>Micro-interactions</h4>
            <p>Smooth animations for carousel swipes, variant selection, and hover effects</p>
          </div>
          <div class="design-card">
            <h4>Mobile Responsive</h4>
            <p>Fully optimized for mobile with touch-friendly controls and responsive layouts</p>
          </div>
          <div class="design-card">
            <h4>Accessibility</h4>
            <p>Keyboard navigation, screen reader support, and WCAG compliance</p>
          </div>
        </div>
      </div>

      <!-- Quick Access -->
      <div class="quick-access">
        <h2>🚀 Quick Access</h2>
        <div class="access-buttons">
          <router-link to="/modern-product/1" class="access-btn primary">
            <i class="fas fa-eye"></i>
            View Vitamin C Serum
          </router-link>
          <router-link to="/cart-demo" class="access-btn secondary">
            <i class="fas fa-shopping-cart"></i>
            Cart Demo
          </router-link>
          <router-link to="/returns" class="access-btn secondary">
            <i class="fas fa-undo"></i>
            Returns Page
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDemo',
  data() {
    return {
      sampleProducts: [
        {
          id: 1,
          name: 'Hydrating Vitamin C Face Serum',
          brand: 'GlowLux Premium',
          price: 1299,
          rating: 4.6,
          reviewCount: 324,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=400&fit=crop'
        },
        {
          id: 2,
          name: 'Nourishing Night Face Cream',
          brand: 'LuxeCare',
          price: 1599,
          rating: 4.8,
          reviewCount: 256,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
        },
        {
          id: 3,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          price: 899,
          rating: 4.4,
          reviewCount: 189,
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop'
        },
        {
          id: 4,
          name: 'Anti-Aging Eye Cream',
          brand: 'YouthGlow',
          price: 1899,
          rating: 4.7,
          reviewCount: 142,
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop'
        }
      ]
    };
  }
};
</script>

<style scoped>
.product-demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf7ff 0%, #f8faff 50%, #fff5f8 100%);
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.demo-header {
  text-align: center;
  margin-bottom: 60px;
}

.demo-title {
  font-size: 42px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.demo-description {
  font-size: 18px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Features Showcase */
.features-showcase {
  margin-bottom: 80px;
}

.features-showcase h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(236, 72, 153, 0.1);
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: rgba(236, 72, 153, 0.2);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.5;
  font-size: 14px;
}

/* Sample Products */
.sample-products {
  margin-bottom: 80px;
}

.sample-products h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.product-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.product-card:hover .product-overlay {
  opacity: 1;
}

.view-detail-btn {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  transform: translateY(20px);
}

.product-card:hover .view-detail-btn {
  transform: translateY(0);
}

.view-detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}

.product-info {
  padding: 24px;
}

.product-brand {
  font-size: 12px;
  color: #8b5cf6;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  line-height: 1.4;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #ec4899;
  margin-bottom: 12px;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  font-size: 14px;
}

.star.filled {
  color: #fbbf24;
}

.star.half {
  background: linear-gradient(90deg, #fbbf24 50%, #d1d5db 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.rating-text {
  color: #9ca3af;
  font-size: 12px;
}

/* Design Features */
.design-features {
  margin-bottom: 80px;
}

.design-features h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 40px;
}

.design-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.design-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #ec4899;
  transition: all 0.3s ease;
}

.design-card:hover {
  transform: translateX(8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.design-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.design-card p {
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* Quick Access */
.quick-access {
  text-align: center;
}

.quick-access h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 32px;
}

.access-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.access-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.3s ease;
  min-width: 180px;
  justify-content: center;
}

.access-btn.primary {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.access-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);
}

.access-btn.secondary {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.access-btn.secondary:hover {
  transform: translateY(-3px);
  border-color: #ec4899;
  color: #ec4899;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Responsive Design */
@media (max-width: 768px) {
  .demo-title {
    font-size: 32px;
  }
  
  .demo-description {
    font-size: 16px;
  }
  
  .features-grid,
  .products-grid,
  .design-grid {
    grid-template-columns: 1fr;
  }
  
  .access-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .access-btn {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .demo-title {
    font-size: 28px;
  }
  
  .product-card {
    margin: 0 auto;
    max-width: 300px;
  }
}
</style>
