<template>
  <div class="fashion-home">
    <!-- Campaign Banners -->
    <section class="campaign-banners">
      <div class="banner-carousel">
        <div 
          v-for="(campaign, index) in campaigns" 
          :key="campaign.id"
          class="banner-slide"
          :class="{ active: currentSlide === index }"
          :style="{ backgroundImage: `url(${campaign.image})` }"
        >
          <div class="banner-overlay">
            <div class="market-container">
              <div class="banner-content">
                <h2 class="banner-title">{{ campaign.title }}</h2>
                <p class="banner-subtitle">{{ campaign.subtitle }}</p>
                <button class="market-btn market-btn-accent banner-cta">
                  {{ campaign.cta }}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Carousel Controls -->
        <div class="carousel-controls">
          <button 
            v-for="(campaign, index) in campaigns" 
            :key="index"
            class="carousel-dot"
            :class="{ active: currentSlide === index }"
            @click="currentSlide = index"
          ></button>
        </div>
      </div>
    </section>

    <!-- Personalized Section -->
    <section class="personalized-section" v-if="isLoggedIn">
      <div class="market-container">
        <div class="section-header">
          <h2 class="market-title-lg">Welcome back, {{ userName }}!</h2>
          <p class="market-text-light">Curated just for your style</p>
        </div>
        
        <div class="personalized-grid">
          <div class="recommendation-card">
            <h3>Continue Shopping</h3>
            <div class="recent-items">
              <div 
                v-for="item in recentlyViewed.slice(0, 3)" 
                :key="item.id"
                class="recent-item"
                @click="goToProduct(item.id)"
              >
                <img :src="item.image" :alt="item.name">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="recommendation-card">
            <h3>Your Size Recommendations</h3>
            <div class="size-recommendations">
              <div class="size-item">
                <i class="fas fa-tshirt"></i>
                <span>Size {{ userProfile.preferredSize || 'M' }} Tops</span>
              </div>
              <div class="size-item">
                <i class="fas fa-shoe-prints"></i>
                <span>Size {{ userProfile.shoeSize || '9' }} Shoes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="market-container">
        <div class="section-header">
          <h2 class="market-title-lg">Shop by Category</h2>
          <p class="market-text-light">Discover your perfect style</p>
        </div>
        
        <div class="categories-grid">
          <router-link 
            v-for="category in categories" 
            :key="category.id"
            :to="`/fashion/products/${category.id}`"
            class="category-card"
          >
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
            <div class="category-overlay">
              <span class="shop-now">Shop Now</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="featured-section">
      <div class="market-container">
        <div class="section-header">
          <h2 class="market-title-lg">Trending Now</h2>
          <div class="section-controls">
            <div class="view-toggle">
              <button 
                @click="featuredView = 'new'"
                :class="{ active: featuredView === 'new' }"
              >
                New Arrivals
              </button>
              <button 
                @click="featuredView = 'trending'"
                :class="{ active: featuredView === 'trending' }"
              >
                Trending
              </button>
              <button 
                @click="featuredView = 'sale'"
                :class="{ active: featuredView === 'sale' }"
              >
                On Sale
              </button>
            </div>
            <router-link to="/fashion/products" class="view-all-link">
              View All <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
        
        <div class="products-grid market-grid-auto">
          <FashionProductCard 
            v-for="product in displayedProducts" 
            :key="product.id"
            :product="product"
          />
        </div>
      </div>
    </section>

    <!-- Style Guide Section -->
    <section class="style-guide-section">
      <div class="market-container">
        <div class="style-guide-content">
          <div class="style-guide-text">
            <h2 class="market-title-lg">Find Your Perfect Style</h2>
            <p class="market-text">
              Not sure what looks good on you? Take our style quiz to get 
              personalized recommendations based on your preferences, body type, 
              and lifestyle.
            </p>
            <div class="style-guide-features">
              <div class="feature">
                <i class="fas fa-palette"></i>
                <span>Color Analysis</span>
              </div>
              <div class="feature">
                <i class="fas fa-ruler"></i>
                <span>Size Recommendation</span>
              </div>
              <div class="feature">
                <i class="fas fa-heart"></i>
                <span>Style Preferences</span>
              </div>
            </div>
            <button @click="openStyleQuiz" class="market-btn market-btn-primary">
              Take Style Quiz
            </button>
          </div>
          <div class="style-guide-visual">
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600" alt="Style Guide">
          </div>
        </div>
      </div>
    </section>

    <!-- Voice Shopping Section -->
    <section class="voice-shopping-section">
      <div class="market-container">
        <div class="voice-shopping-card">
          <div class="voice-content">
            <div class="voice-icon">
              <i class="fas fa-microphone"></i>
            </div>
            <div class="voice-text">
              <h3>Try Voice Shopping</h3>
              <p>Say "Show me black dresses" or "Find Nike sneakers" to shop hands-free</p>
            </div>
          </div>
          <button @click="startVoiceShopping" class="voice-btn" :class="{ listening: isListening }">
            <i class="fas fa-microphone"></i>
            {{ isListening ? 'Listening...' : 'Start Voice Shopping' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="newsletter-section">
      <div class="market-container">
        <div class="newsletter-content">
          <h2 class="market-title-lg">Stay In Style</h2>
          <p class="market-text">Get the latest trends, exclusive offers, and style tips delivered to your inbox</p>
          <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email"
              v-model="email"
              class="newsletter-input"
              required
            >
            <button type="submit" class="market-btn market-btn-accent">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { fashionMarketConfig } from '../config.js';
import FashionProductCard from '../components/FashionProductCard.vue';

export default {
  name: 'FashionHome',
  components: {
    FashionProductCard
  },
  data() {
    return {
      currentSlide: 0,
      featuredView: 'new',
      email: '',
      isListening: false
    };
  },
  computed: {
    ...mapGetters('products', ['featuredProducts', 'onSaleProducts']),
    ...mapGetters('user', ['userProfile', 'recentlyViewedItems']),
    categories() {
      return fashionMarketConfig.categories;
    },
    campaigns() {
      return fashionMarketConfig.campaigns;
    },
    isLoggedIn() {
      return !!this.userProfile.name;
    },
    userName() {
      return this.userProfile.name || 'Guest';
    },
    recentlyViewed() {
      return this.recentlyViewedItems || [];
    },
    displayedProducts() {
      switch (this.featuredView) {
        case 'trending':
          return this.featuredProducts.slice(0, 8);
        case 'sale':
          return this.onSaleProducts.slice(0, 8);
        default:
          return this.featuredProducts.slice(0, 8);
      }
    }
  },
  mounted() {
    this.startCarousel();
  },
  methods: {
    ...mapActions('ui', ['showNotification', 'openModal']),
    startCarousel() {
      setInterval(() => {
        this.currentSlide = (this.currentSlide + 1) % this.campaigns.length;
      }, 5000);
    },
    goToProduct(productId) {
      this.$router.push(`/fashion/product/${productId}`);
    },
    openStyleQuiz() {
      this.openModal({ modalName: 'styleQuiz' });
    },
    startVoiceShopping() {
      if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
        this.showNotification({
          type: 'error',
          message: 'Voice shopping is not supported in your browser'
        });
        return;
      }

      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        this.isListening = true;
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.$store.dispatch('products/searchProducts', transcript);
        this.$router.push('/fashion/products');
        this.showNotification({
          type: 'success',
          message: `Searching for: "${transcript}"`
        });
      };

      recognition.onerror = () => {
        this.showNotification({
          type: 'error',
          message: 'Voice search failed. Please try again.'
        });
      };

      recognition.onend = () => {
        this.isListening = false;
      };

      recognition.start();
    },
    subscribeNewsletter() {
      if (this.email) {
        this.showNotification({
          type: 'success',
          message: 'Thank you for subscribing to our fashion newsletter!'
        });
        this.email = '';
      }
    }
  }
};
</script>

<style scoped>
.fashion-home {
  padding-top: 0;
}

/* Campaign Banners */
.campaign-banners {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.banner-carousel {
  position: relative;
  height: 100%;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1s ease;
}

.banner-slide.active {
  opacity: 1;
}

.banner-overlay {
  background: rgba(0, 0, 0, 0.4);
  height: 100%;
  display: flex;
  align-items: center;
}

.banner-content {
  color: white;
  max-width: 500px;
}

.banner-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 20px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.banner-cta {
  font-size: 18px;
  padding: 16px 32px;
}

.carousel-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background: var(--market-accent);
  transform: scale(1.2);
}

/* Personalized Section */
.personalized-section {
  padding: 60px 0;
  background: var(--market-secondary);
}

.personalized-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 32px;
}

.recommendation-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.recommendation-card h3 {
  margin-bottom: 16px;
  color: var(--market-text);
  font-weight: 600;
}

.recent-items {
  display: flex;
  gap: 12px;
}

.recent-item {
  cursor: pointer;
  text-align: center;
  transition: transform 0.2s ease;
}

.recent-item:hover {
  transform: scale(1.05);
}

.recent-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.recent-item span {
  font-size: 12px;
  color: var(--market-text-light);
  display: block;
}

.size-recommendations {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.size-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--market-secondary);
  border-radius: 8px;
}

.size-item i {
  color: var(--market-accent);
  font-size: 18px;
}

/* Categories Section */
.categories-section {
  padding: 80px 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 48px;
}

.category-card {
  position: relative;
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  color: var(--market-text);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.category-icon {
  width: 80px;
  height: 80px;
  background: var(--market-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.category-overlay {
  position: absolute;
  bottom: -50px;
  left: 0;
  right: 0;
  background: var(--market-accent-gradient);
  color: white;
  padding: 12px;
  text-align: center;
  transition: bottom 0.3s ease;
}

.category-card:hover .category-overlay {
  bottom: 0;
}

/* Featured Section */
.featured-section {
  padding: 80px 0;
  background: var(--market-secondary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.section-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.view-toggle {
  display: flex;
  background: white;
  border-radius: 8px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.view-toggle button {
  background: none;
  border: none;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--market-text-light);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.view-toggle button.active {
  background: var(--market-primary);
  color: white;
}

.view-all-link {
  color: var(--market-primary);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Style Guide Section */
.style-guide-section {
  padding: 80px 0;
}

.style-guide-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.style-guide-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 32px 0;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature i {
  color: var(--market-accent);
  font-size: 18px;
  width: 20px;
}

.style-guide-visual img {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

/* Voice Shopping Section */
.voice-shopping-section {
  padding: 60px 0;
  background: var(--market-secondary);
}

.voice-shopping-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.voice-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.voice-icon {
  width: 60px;
  height: 60px;
  background: var(--market-accent-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.voice-text h3 {
  margin-bottom: 8px;
  color: var(--market-text);
}

.voice-btn {
  background: var(--market-gradient);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 25px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.voice-btn:hover {
  transform: translateY(-2px);
}

.voice-btn.listening {
  background: #e74c3c;
  animation: pulse 1s infinite;
}

/* Newsletter Section */
.newsletter-section {
  padding: 80px 0;
  background: var(--market-gradient);
  color: white;
  text-align: center;
}

.newsletter-content h2 {
  color: white;
  margin-bottom: 16px;
}

.newsletter-content p {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 32px;
  font-size: 18px;
}

.newsletter-form {
  display: flex;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.newsletter-input {
  flex: 1;
  padding: 16px 20px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .style-guide-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .section-header {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .voice-shopping-card {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 32px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .newsletter-form {
    flex-direction: column;
  }
  
  .personalized-grid {
    grid-template-columns: 1fr;
  }
}
</style>
