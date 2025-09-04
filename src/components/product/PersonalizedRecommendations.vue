<template>
  <div class="personalized-recommendations">
    <div class="recommendations-header">
      <h2>Recommended for You</h2>
      <p class="recommendations-subtitle">
        Based on your browsing history and preferences
      </p>
    </div>

    <div class="recommendation-sections">
      <!-- AI-Powered Recommendations -->
      <div class="recommendation-section">
        <div class="section-header">
          <div class="section-icon ai-icon">
            <i class="fas fa-brain"></i>
          </div>
          <div class="section-info">
            <h3>AI-Powered Picks</h3>
            <p>Personalized selections based on your skin profile</p>
          </div>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in aiRecommendations" 
            :key="product.id"
            :product="product"
            class="recommendation-product"
          />
        </div>
      </div>

      <!-- Similar Products -->
      <div class="recommendation-section">
        <div class="section-header">
          <div class="section-icon similar-icon">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="section-info">
            <h3>Similar Products</h3>
            <p>Products with similar ingredients and benefits</p>
          </div>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in similarProducts" 
            :key="product.id"
            :product="product"
            class="recommendation-product"
          />
        </div>
      </div>

      <!-- Trending in Your Category -->
      <div class="recommendation-section">
        <div class="section-header">
          <div class="section-icon trending-icon">
            <i class="fas fa-fire"></i>
          </div>
          <div class="section-info">
            <h3>Trending in Skincare</h3>
            <p>What others with similar skin types are loving</p>
          </div>
        </div>
        
        <div class="products-grid">
          <ProductCard 
            v-for="product in trendingProducts" 
            :key="product.id"
            :product="product"
            class="recommendation-product"
          />
        </div>
      </div>

      <!-- Complete Your Routine -->
      <div class="recommendation-section routine-section">
        <div class="section-header">
          <div class="section-icon routine-icon">
            <i class="fas fa-list-check"></i>
          </div>
          <div class="section-info">
            <h3>Complete Your Routine</h3>
            <p>Essential steps you might be missing</p>
          </div>
        </div>
        
        <div class="routine-recommendations">
          <div 
            v-for="step in routineSteps" 
            :key="step.id"
            class="routine-step"
            :class="{ completed: step.hasProduct }"
          >
            <div class="step-info">
              <div class="step-number">{{ step.order }}</div>
              <div class="step-details">
                <h4>{{ step.name }}</h4>
                <p>{{ step.description }}</p>
              </div>
            </div>
            
            <div class="step-products" v-if="!step.hasProduct">
              <ProductCard 
                v-for="product in step.recommendedProducts.slice(0, 2)" 
                :key="product.id"
                :product="product"
                class="routine-product"
              />
            </div>
            
            <div v-else class="step-completed">
              <i class="fas fa-check-circle"></i>
              <span>You have this step covered!</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendation Insights -->
    <div class="recommendation-insights">
      <h3>Why These Recommendations?</h3>
      <div class="insights-grid">
        <div class="insight-card">
          <i class="fas fa-user-circle"></i>
          <div>
            <h4>Your Skin Profile</h4>
            <p>Combination skin with sensitivity to fragrances</p>
          </div>
        </div>
        
        <div class="insight-card">
          <i class="fas fa-chart-line"></i>
          <div>
            <h4>Purchase History</h4>
            <p>Preference for anti-aging and hydrating products</p>
          </div>
        </div>
        
        <div class="insight-card">
          <i class="fas fa-users"></i>
          <div>
            <h4>Similar Users</h4>
            <p>Based on users with similar preferences</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ProductCard from './ProductCard.vue';

export default {
  name: 'PersonalizedRecommendations',
  components: {
    ProductCard
  },
  props: {
    basedOn: String
  },
  computed: {
    ...mapGetters('products', ['allProducts']),
    ...mapGetters('user', ['userProfile']),
    aiRecommendations() {
      // Mock AI recommendations - would come from ML algorithm
      return this.allProducts.slice(0, 3);
    },
    similarProducts() {
      // Mock similar products
      return this.allProducts.slice(3, 6);
    },
    trendingProducts() {
      // Mock trending products
      return this.allProducts.filter(p => p.trending).slice(0, 3);
    },
    routineSteps() {
      return [
        {
          id: 1,
          order: 1,
          name: 'Cleanser',
          description: 'Remove makeup and impurities',
          hasProduct: true,
          recommendedProducts: []
        },
        {
          id: 2,
          order: 2,
          name: 'Toner',
          description: 'Balance and prep your skin',
          hasProduct: false,
          recommendedProducts: this.allProducts.slice(0, 2)
        },
        {
          id: 3,
          order: 3,
          name: 'Serum',
          description: 'Target specific skin concerns',
          hasProduct: true,
          recommendedProducts: []
        },
        {
          id: 4,
          order: 4,
          name: 'Moisturizer',
          description: 'Hydrate and protect',
          hasProduct: false,
          recommendedProducts: this.allProducts.slice(2, 4)
        },
        {
          id: 5,
          order: 5,
          name: 'SPF',
          description: 'Daily sun protection',
          hasProduct: false,
          recommendedProducts: this.allProducts.slice(4, 6)
        }
      ];
    }
  }
};
</script>

<style scoped>
.personalized-recommendations {
  padding: 60px 0;
  background: var(--gray-50);
  border-radius: 20px;
  margin-top: 40px;
}

.recommendations-header {
  text-align: center;
  margin-bottom: 48px;
}

.recommendations-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.recommendations-subtitle {
  color: var(--gray-600);
  font-size: 16px;
}

.recommendation-sections {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.recommendation-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--gray-200);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.section-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.ai-icon {
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
}

.similar-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.trending-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.routine-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.section-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.section-info p {
  color: var(--gray-600);
  font-size: 14px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.recommendation-product {
  transition: transform 0.2s ease;
}

.recommendation-product:hover {
  transform: translateY(-2px);
}

.routine-section {
  background: linear-gradient(135deg, var(--primary-50), var(--primary-100));
  border-color: var(--primary-200);
}

.routine-recommendations {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.routine-step {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 2px solid var(--gray-200);
  transition: all 0.2s ease;
}

.routine-step.completed {
  border-color: var(--success-300);
  background: var(--success-50);
}

.step-info {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.step-number {
  width: 32px;
  height: 32px;
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.routine-step.completed .step-number {
  background: var(--success-500);
}

.step-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.step-details p {
  color: var(--gray-600);
  font-size: 14px;
}

.step-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.routine-product {
  transform: scale(0.9);
}

.step-completed {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--success-600);
  font-weight: 500;
}

.step-completed i {
  font-size: 20px;
}

.recommendation-insights {
  margin-top: 48px;
  text-align: center;
}

.recommendation-insights h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 24px;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.insight-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--gray-200);
  text-align: left;
}

.insight-card i {
  font-size: 24px;
  color: var(--primary-500);
  width: 40px;
  text-align: center;
}

.insight-card h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.insight-card p {
  font-size: 13px;
  color: var(--gray-600);
  line-height: 1.3;
}

@media (max-width: 768px) {
  .personalized-recommendations {
    padding: 40px 20px;
  }
  
  .recommendation-section {
    padding: 24px;
  }
  
  .section-header {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .step-info {
    flex-direction: column;
    text-align: center;
  }
  
  .step-products {
    grid-template-columns: 1fr;
  }
  
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
