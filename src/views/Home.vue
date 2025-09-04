<template>
  <div class="home-page">
    <!-- Seasonal Campaign Banners -->
    <section class="campaign-banners">
      <div class="banner-carousel" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
        <div 
          v-for="(banner, index) in campaignBanners" 
          :key="index"
          class="banner-slide"
          :style="{ backgroundImage: `url(${banner.image})` }"
        >
          <div class="banner-overlay"></div>
          <div class="banner-content">
            <span class="banner-badge">{{ banner.badge }}</span>
            <h2 class="banner-title">{{ banner.title }}</h2>
            <p class="banner-subtitle">{{ banner.subtitle }}</p>
            <button class="banner-cta">{{ banner.cta }}</button>
          </div>
        </div>
      </div>
      
      <!-- Banner Navigation -->
      <div class="banner-indicators">
        <button 
          v-for="(banner, index) in campaignBanners" 
          :key="index"
          @click="currentBanner = index"
          :class="['indicator', { active: currentBanner === index }]"
        ></button>
      </div>
      
      <!-- Banner Controls -->
      <button @click="previousBanner" class="banner-nav prev">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button @click="nextBanner" class="banner-nav next">
        <i class="fas fa-chevron-right"></i>
      </button>
    </section>

    <!-- Shop by Skin Type / Hair Type -->
    <section class="type-selector-section">
      <div class="container">
        <h2 class="section-title">Find Your Perfect Match</h2>
        
        <!-- Skin Type Selector -->
        <div class="type-category">
          <h3 class="type-title">
            <i class="fas fa-leaf"></i>
            Shop by Skin Type
          </h3>
          <div class="type-tiles">
            <div 
              v-for="skinType in skinTypes" 
              :key="skinType.id"
              @click="filterBySkinType(skinType)"
              :class="['type-tile', skinType.id, { active: selectedSkinType === skinType.id }]"
            >
              <div class="tile-icon">
                <i :class="skinType.icon"></i>
              </div>
              <h4 class="tile-title">{{ skinType.name }}</h4>
              <p class="tile-description">{{ skinType.description }}</p>
              <span class="tile-count">{{ skinType.productCount }} products</span>
            </div>
          </div>
        </div>
        
        <!-- Hair Type Selector -->
        <div class="type-category">
          <h3 class="type-title">
            <i class="fas fa-cut"></i>
            Shop by Hair Type
          </h3>
          <div class="type-tiles">
            <div 
              v-for="hairType in hairTypes" 
              :key="hairType.id"
              @click="filterByHairType(hairType)"
              :class="['type-tile', hairType.id, { active: selectedHairType === hairType.id }]"
            >
              <div class="tile-icon">
                <i :class="hairType.icon"></i>
              </div>
              <h4 class="tile-title">{{ hairType.name }}</h4>
              <p class="tile-description">{{ hairType.description }}</p>
              <span class="tile-count">{{ hairType.productCount }} products</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced Category Navigation Tiles -->
    <section class="enhanced-categories">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-th-large"></i>
            Explore Our Beauty Universe
          </h2>
          <p class="section-subtitle">Discover thousands of products across all beauty categories</p>
        </div>
        <div class="categories-mega-grid">
          <div 
            v-for="category in beautyCategories" 
            :key="category.id"
            @click="navigateToCategory(category)"
            :class="['mega-category-card', category.id]"
          >
            <div class="category-background" :style="{ background: category.gradient }"></div>
            <div class="category-content">
              <div class="category-icon-wrapper">
                <i :class="category.icon"></i>
              </div>
              <h3 class="category-title">{{ category.name }}</h3>
              <p class="category-description">{{ category.description }}</p>
              <div class="category-stats">
                <span class="product-count">{{ category.productCount }}+ products</span>
                <span class="brand-count">{{ category.brandCount }} brands</span>
              </div>
              <div class="category-trending" v-if="category.trending">
                <i class="fas fa-fire"></i>
                <span>Trending</span>
              </div>
            </div>
            <div class="category-preview">
              <img :src="category.previewImage" :alt="category.name" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Brands -->
    <section class="trending-brands">
      <div class="container">
        <div class="section-header">
          <div class="section-title-wrapper">
            <div class="trending-icon">
              <i class="fas fa-fire"></i>
            </div>
            <div class="section-title-content">
              <h2 class="section-title">Trending Brands</h2>
              <p class="section-subtitle">Discover the hottest beauty brands right now</p>
            </div>
          </div>
          <button class="view-all-btn" @click="$router.push('/brands')">
            View All
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>

        <div class="brands-grid">
          <div
            v-for="(brand, index) in trendingBrands"
            :key="brand.id"
            @click="navigateToBrand(brand)"
            class="brand-card"
            :class="{ featured: index === 0 }"
          >
            <!-- Ranking Badge -->
            <div class="rank-badge" v-if="index < 3">
              #{{ index + 1 }}
            </div>

            <!-- Brand Logo -->
            <div class="brand-logo-wrapper">
              <div class="brand-logo">
                <img :src="brand.logo" :alt="brand.name" />
              </div>
            </div>

            <!-- Brand Content -->
            <div class="brand-content">
              <div class="brand-title-section">
                <h3 class="brand-name">{{ brand.name }}</h3>
                <p class="brand-tagline">{{ brand.tagline }}</p>
              </div>

              <!-- Stats Row -->
              <div class="brand-stats-row">
                <div class="stat-item love-stat">
                  <div class="stat-number">{{ brand.popularity }}%</div>
                  <div class="stat-label">LOVE IT</div>
                </div>
                <div class="stat-item products-stat">
                  <div class="stat-number">{{ brand.productCount }}</div>
                  <div class="stat-label">PRODUCTS</div>
                </div>
              </div>

              <!-- Explore Button -->
              <div class="brand-action-section">
                <button class="explore-brand-btn">
                  <span>Explore Brand</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>

            <!-- Background Pattern -->
            <div class="brand-bg-pattern"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- New Arrivals -->
    <section class="new-arrivals">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-sparkles"></i>
            New Arrivals
          </h2>
          <p class="section-subtitle">Be the first to try the latest beauty innovations</p>
          <router-link to="/products?filter=new" class="section-link">
            View All <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
        <div class="arrivals-grid">
          <ProductCard 
            v-for="product in newArrivals.slice(0, 8)" 
            :key="product.id"
            :product="product"
            class="arrival-card"
          />
        </div>
      </div>
    </section>

    <!-- Limited Time Offers -->
    <section class="limited-offers">
      <div class="container">
        <div class="offers-header">
          <h2 class="section-title">
            <i class="fas fa-bolt"></i>
            Limited Time Offers
          </h2>
        </div>
        <div class="sale-products-grid">
          <ProductCard
            v-for="(product, index) in saleProducts"
            :key="product.id"
            :product="product"
            :class="['sale-product-card', getSaleCardClass(index)]"
          />
        </div>
      </div>
    </section>


    <!-- Beauty Tips & Tutorials -->
    <section class="beauty-tips">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            <i class="fas fa-graduation-cap"></i>
            Beauty Tips & Tutorials
          </h2>
          <p class="section-subtitle">Learn from beauty experts and enhance your routine</p>
        </div>
        <div class="tips-grid">
          <div 
            v-for="tip in beautyTips" 
            :key="tip.id"
            class="tip-card"
          >
            <div class="tip-image">
              <img :src="tip.image" :alt="tip.title" />
              <div class="tip-duration">{{ tip.duration }}</div>
            </div>
            <div class="tip-content">
              <span class="tip-category">{{ tip.category }}</span>
              <h3 class="tip-title">{{ tip.title }}</h3>
              <p class="tip-excerpt">{{ tip.excerpt }}</p>
              <div class="tip-meta">
                <span class="tip-author">By {{ tip.author }}</span>
                <span class="tip-date">{{ formatDate(tip.date) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Enhanced -->
    <section class="newsletter-enhanced">
      <div class="container">
        <div class="newsletter-content">
          <div class="newsletter-visual">
            <div class="beauty-icons">
              <i class="fas fa-leaf"></i>
              <i class="fas fa-palette"></i>
              <i class="fas fa-sparkles"></i>
            </div>
          </div>
          <div class="newsletter-text">
            <h2>Join the Beauty Insider Club</h2>
            <p>Get exclusive access to new launches, expert tips, and member-only deals</p>
            <div class="newsletter-benefits">
              <div class="benefit">
                <i class="fas fa-gift"></i>
                <span>Early access to sales</span>
              </div>
              <div class="benefit">
                <i class="fas fa-star"></i>
                <span>Personalized recommendations</span>
              </div>
              <div class="benefit">
                <i class="fas fa-crown"></i>
                <span>VIP customer support</span>
              </div>
            </div>
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="form-group">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  v-model="email"
                  class="newsletter-input"
                  required
                >
                <button type="submit" class="newsletter-btn">
                  <span>Subscribe</span>
                  <i class="fas fa-arrow-right"></i>
                </button>
              </div>
              <p class="newsletter-disclaimer">
                By subscribing, you agree to our <a href="/privacy-policy">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';

export default {
  name: 'Home',
  components: {
    ProductCard
  },
  data() {
    return {
      email: '',
      currentBanner: 0,
      selectedSkinType: null,
      selectedHairType: null,
      brandOffset: 0,
      countdown: {
        hours: 23,
        minutes: 45,
        seconds: 30
      },
      
      campaignBanners: [
        {
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
          badge: 'Summer Collection',
          title: 'Summer Skincare Essentials',
          subtitle: 'Protect and nourish your skin this summer with our curated collection',
          cta: 'Shop Summer Collection'
        },
        {
          image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=1200',
          badge: 'Back to School',
          title: 'Back-to-School Beauty Deals',
          subtitle: 'Refresh your routine with up to 40% off trending products',
          cta: 'Shop Deals'
        },
        {
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
          badge: 'New Launch',
          title: 'Revolutionary Anti-Aging Serum',
          subtitle: 'Experience the future of skincare with our latest innovation',
          cta: 'Discover Now'
        }
      ],
      
      skinTypes: [
        {
          id: 'oily',
          name: 'Oily',
          description: 'Shine control and pore minimizing',
          icon: 'fas fa-sun',
          productCount: 234
        },
        {
          id: 'dry',
          name: 'Dry',
          description: 'Hydrating and nourishing formulas',
          icon: 'fas fa-tint',
          productCount: 189
        },
        {
          id: 'combination',
          name: 'Combination',
          description: 'Balanced care for mixed skin',
          icon: 'fas fa-adjust',
          productCount: 156
        },
        {
          id: 'sensitive',
          name: 'Sensitive',
          description: 'Gentle and fragrance-free options',
          icon: 'fas fa-feather',
          productCount: 98
        }
      ],
      
      hairTypes: [
        {
          id: 'straight',
          name: 'Straight',
          description: 'Smooth and sleek hair care',
          icon: 'fas fa-minus',
          productCount: 145
        },
        {
          id: 'wavy',
          name: 'Wavy',
          description: 'Enhance natural waves and texture',
          icon: 'fas fa-wave-square',
          productCount: 123
        },
        {
          id: 'curly',
          name: 'Curly',
          description: 'Define and moisturize curls',
          icon: 'fas fa-circle',
          productCount: 167
        },
        {
          id: 'coily',
          name: 'Coily',
          description: 'Deep conditioning and styling',
          icon: 'fas fa-dot-circle',
          productCount: 89
        }
      ],
      
      beautyCategories: [
        {
          id: 'skincare',
          name: 'Skincare',
          description: 'Cleanse, treat, and moisturize',
          icon: 'fas fa-leaf',
          gradient: 'linear-gradient(135deg, #e8f5e8 0%, #d4f1d4 100%)',
          productCount: 500,
          brandCount: 45,
          trending: true,
          previewImage: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200'
        },
        {
          id: 'makeup',
          name: 'Makeup',
          description: 'Express your unique beauty',
          icon: 'fas fa-palette',
          gradient: 'linear-gradient(135deg, #ffe8f5 0%, #ffd4f1 100%)',
          productCount: 350,
          brandCount: 38,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=200'
        },
        {
          id: 'haircare',
          name: 'Hair Care',
          description: 'Healthy hair starts here',
          icon: 'fas fa-cut',
          gradient: 'linear-gradient(135deg, #e8f0ff 0%, #d4e7ff 100%)',
          productCount: 280,
          brandCount: 25,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=200'
        },
        {
          id: 'fragrance',
          name: 'Fragrance',
          description: 'Signature scents for every mood',
          icon: 'fas fa-spray-can',
          gradient: 'linear-gradient(135deg, #fff0e8 0%, #ffe7d4 100%)',
          productCount: 180,
          brandCount: 32,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200'
        },
        {
          id: 'mens-grooming',
          name: "Men's Grooming",
          description: 'Essential grooming for modern men',
          icon: 'fas fa-male',
          gradient: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)',
          productCount: 120,
          brandCount: 18,
          trending: true,
          previewImage: 'https://images.unsplash.com/photo-1503235930437-8c6293ba41f5?w=200'
        },
        {
          id: 'bath-body',
          name: 'Bath & Body',
          description: 'Luxurious body care essentials',
          icon: 'fas fa-bath',
          gradient: 'linear-gradient(135deg, #f0f8ff 0%, #e0f0ff 100%)',
          productCount: 220,
          brandCount: 28,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200'
        },
        {
          id: 'beauty-tools',
          name: 'Beauty Tools',
          description: 'Professional tools & brushes',
          icon: 'fas fa-brush',
          gradient: 'linear-gradient(135deg, #fef3e8 0%, #fdead3 100%)',
          productCount: 95,
          brandCount: 15,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200'
        },
        {
          id: 'nail-care',
          name: 'Nail Care',
          description: 'Manicure & nail essentials',
          icon: 'fas fa-hand-sparkles',
          gradient: 'linear-gradient(135deg, #fceef8 0%, #f9e5f3 100%)',
          productCount: 85,
          brandCount: 12,
          trending: false,
          previewImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=200'
        }
      ],
      
      trendingBrands: [
        {
          id: 1,
          name: 'The Ordinary',
          tagline: 'Clinical formulations with integrity',
          logo: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=50&fit=crop&crop=center',
          popularity: 94,
          productCount: 45
        },
        {
          id: 2,
          name: 'Glossier',
          tagline: 'Beauty inspired by real life',
          logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=50&fit=crop&crop=center',
          popularity: 91,
          productCount: 32
        },
        {
          id: 3,
          name: 'Fenty Beauty',
          tagline: 'Beauty for all',
          logo: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=100&h=50&fit=crop&crop=center',
          popularity: 96,
          productCount: 78
        },
      ],
      
      beautyTips: [
        {
          id: 1,
          title: 'The Perfect Morning Skincare Routine',
          excerpt: 'Start your day with these essential steps for healthy, glowing skin',
          category: 'Skincare',
          author: 'Dr. Sarah Chen',
          date: new Date('2024-01-15'),
          duration: '5 min read',
          image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300'
        },
        {
          id: 2,
          title: 'How to Choose the Right Foundation Shade',
          excerpt: 'Expert tips for finding your perfect foundation match',
          category: 'Makeup',
          author: 'Emma Rodriguez',
          date: new Date('2024-01-10'),
          duration: '7 min read',
          image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300'
        }
      ]
    };
  },
  
  computed: {
    ...mapGetters('products', ['categories', 'featuredProducts', 'onSaleProducts']),
    ...mapGetters('user', [
      'userProfile',
      'personalizedProducts',
      'recentlyViewedItems',
      'isAuthenticated'
    ]),

    newArrivals() {
      // Mock new arrivals - in real app, this would come from API
      return this.featuredProducts.map(product => ({
        ...product,
        isNew: true
      }));
    },

    saleProducts() {
      // Get up to 6 sale products for the limited offers section
      return this.onSaleProducts.slice(0, 3);
    }
  },
  
  methods: {
    ...mapActions('ui', ['openModal', 'showNotification']),
    ...mapActions('user', ['clearRecentlyViewed', 'addToRecentlyViewed']),
    
    // Banner Methods
    nextBanner() {
      this.currentBanner = (this.currentBanner + 1) % this.campaignBanners.length;
    },
    
    previousBanner() {
      this.currentBanner = this.currentBanner === 0 
        ? this.campaignBanners.length - 1 
        : this.currentBanner - 1;
    },
    
    // Sale Card Background Colors
    getSaleCardClass(index) {
      const colorClasses = ['sale-card-blue', 'sale-card-red', 'sale-card-sky'];
      return colorClasses[index % colorClasses.length];
    },

    // Filter Methods
    filterBySkinType(skinType) {
      this.selectedSkinType = this.selectedSkinType === skinType.id ? null : skinType.id;
      this.$router.push({
        path: '/products',
        query: {
          skinType: skinType.id,
          banner: 'skin',
          title: `${skinType.name} Skin Care Products`
        }
      });
    },

    filterByHairType(hairType) {
      this.selectedHairType = this.selectedHairType === hairType.id ? null : hairType.id;
      this.$router.push({
        path: '/products',
        query: {
          hairType: hairType.id,
          banner: 'hair',
          title: `${hairType.name} Hair Care Products`
        }
      });
    },
    
    // Navigation Methods
    navigateToCategory(category) {
      this.$router.push(`/products/${category.id}`);
    },
    
    navigateToBrand(brand) {
      this.$router.push({
        path: '/products',
        query: { brand: brand.name }
      });
    },
    
    viewProduct(productId) {
      this.$router.push(`/product/${productId}`);
    },
    
    // Brand Carousel
    scrollBrands(direction) {
      const cardWidth = 280; // Width of each brand card
      const maxOffset = (this.trendingBrands.length - 4) * cardWidth;
      
      if (direction === 'left') {
        this.brandOffset = Math.max(0, this.brandOffset - cardWidth);
      } else {
        this.brandOffset = Math.min(maxOffset, this.brandOffset + cardWidth);
      }
    },
    
    // Utility Methods
    formatViewTime(timestamp) {
      const now = new Date();
      const viewed = new Date(timestamp);
      const diffMs = now - viewed;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) return `${diffDays}d ago`;
      if (diffHours > 0) return `${diffHours}h ago`;
      return 'Just now';
    },
    
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    },
    
    subscribeNewsletter() {
      if (this.email) {
        this.showNotification({
          type: 'success',
          message: 'Welcome to the Beauty Insider Club!'
        });
        this.email = '';
      }
    },
    
    // Timer Methods
    startCountdown() {
      setInterval(() => {
        if (this.countdown.seconds > 0) {
          this.countdown.seconds--;
        } else if (this.countdown.minutes > 0) {
          this.countdown.minutes--;
          this.countdown.seconds = 59;
        } else if (this.countdown.hours > 0) {
          this.countdown.hours--;
          this.countdown.minutes = 59;
          this.countdown.seconds = 59;
        }
      }, 1000);
    }
  },
  
  mounted() {
    // Auto-rotate banners
    setInterval(this.nextBanner, 5000);
    
    // Start countdown timer
    this.startCountdown();
  }
};
</script>

<style scoped>
.home-page {
  padding-top: 0;
}

/* Campaign Banners */
.campaign-banners {
  position: relative;
  height: 400px;
  overflow: hidden;
  margin-bottom: 40px;
}

.banner-carousel {
  display: flex;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.banner-slide {
  min-width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.1) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 20px;
}

.banner-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.banner-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.banner-subtitle {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.9;
  line-height: 1.5;
}

.banner-cta {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.3);
}

.banner-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(236, 72, 153, 0.4);
}

.banner-indicators {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 3;
}

.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: white;
  transform: scale(1.2);
}

.banner-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  z-index: 3;
}

.banner-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.banner-nav.prev {
  left: 30px;
}

.banner-nav.next {
  right: 30px;
}

/* Type Selector Section */
.type-selector-section {
  padding: 40px 0;
  margin-top: 0;
  background: white;
}

.type-selector-section .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.type-category {
  margin-bottom: 40px;
}

.type-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
}

.type-title i {
  color: var(--primary-500);
}

.type-tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  justify-content: center;
}

.type-tile {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.type-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.type-tile.oily::before {
  background: linear-gradient(135deg, #fff7ed 0%, #fed7aa 100%);
}

.type-tile.dry::before {
  background: linear-gradient(135deg, #eff6ff 0%, #bfdbfe 100%);
}

.type-tile.combination::before {
  background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
}

.type-tile.sensitive::before {
  background: linear-gradient(135deg, #fdf4ff 0%, #f5d0fe 100%);
}

.type-tile.straight::before {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.type-tile.wavy::before {
  background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
}

.type-tile.curly::before {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.type-tile.coily::before {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}

.type-tile:hover::before,
.type-tile.active::before {
  opacity: 1;
}

.type-tile:hover,
.type-tile.active {
  border-color: var(--primary-400);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.tile-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 24px;
  color: var(--primary-600);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.type-tile:hover .tile-icon,
.type-tile.active .tile-icon {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  transform: scale(1.1);
}

.tile-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  position: relative;
  z-index: 2;
}

.tile-description {
  color: var(--gray-600);
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
}

.tile-count {
  background: var(--gray-100);
  color: var(--gray-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  position: relative;
  z-index: 2;
}

/* Enhanced Categories */
.enhanced-categories {
  padding: 40px 0;
  background: var(--gray-50);
}

.enhanced-categories .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.categories-mega-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  justify-content: center;
}

.mega-category-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  min-height: 280px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-100);
}

.mega-category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.category-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  transition: height 0.4s ease;
}

.mega-category-card:hover .category-background {
  height: 50%;
}

.category-content {
  position: relative;
  z-index: 2;
  padding: 32px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  font-size: 32px;
  color: var(--primary-600);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.mega-category-card:hover .category-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.category-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.category-description {
  color: var(--gray-600);
  margin-bottom: 20px;
  flex: 1;
}

.category-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.product-count,
.brand-count {
  background: var(--gray-100);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
}

.category-trending {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  animation: pulse 2s infinite;
}

.category-preview {
  position: absolute;
  bottom: -20px;
  right: 20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.4s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.mega-category-card:hover .category-preview {
  transform: scale(1.1);
  bottom: -10px;
}

.category-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Trending Brands */
.trending-brands {
  padding: 60px 0;
  background: linear-gradient(135deg, #fafafa 0%, #f8f9fa 100%);
  position: relative;
}

.trending-brands .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.trending-brands .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 48px;
}

.section-title-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.trending-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.section-title-content {
  flex: 1;
}

.trending-brands .section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--primary-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trending-brands .section-subtitle {
  font-size: 16px;
  color: var(--gray-600);
  margin: 0;
  font-weight: 400;
}

.view-all-btn {
  background: white;
  border: 2px solid var(--primary-200);
  color: var(--primary-600);
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.view-all-btn:hover {
  background: var(--primary-500);
  color: white;
  border-color: var(--primary-500);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  align-items: stretch;
}

.brand-card {
  background: white;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--gray-100);
}

.brand-card.featured {
  min-height: 400px;
  background: linear-gradient(135deg, #ffffff 0%, #fef7ff 100%);
  border: 2px solid var(--primary-200);
}

.brand-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-300);
}

.brand-card.featured:hover {
  border-color: var(--primary-400);
  box-shadow: 0 24px 48px rgba(236, 72, 153, 0.2);
}

/* Rank Badge */
.rank-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

/* Brand Logo Section */
.brand-logo-wrapper {
  padding: 32px 32px 0;
  display: flex;
  justify-content: center;
  position: relative;
}

.brand-logo {
  width: 100px;
  height: 100px;
  background: var(--gray-50);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--gray-200);
  transition: all 0.4s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.brand-card.featured .brand-logo {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #ffffff 0%, #fef7ff 100%);
  border: 2px solid var(--primary-100);
}

.brand-logo img {
  max-width: 75%;
  max-height: 75%;
  object-fit: contain;
  transition: transform 0.4s ease;
}

.brand-card:hover .brand-logo {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.brand-card:hover .brand-logo img {
  transform: scale(1.1);
}

/* Brand Content */
.brand-content {
  padding: 24px 32px 32px;
  flex: 1;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.brand-title-section {
  margin-bottom: 24px;
}

.brand-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 8px;
  line-height: 1.2;
}

.brand-card.featured .brand-name {
  font-size: 26px;
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--primary-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  color: var(--gray-600);
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  font-weight: 400;
}

/* Brand Stats */
.brand-stats-row {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 28px;
  padding: 20px;
  background: var(--gray-50);
  border-radius: 16px;
  border: 1px solid var(--gray-100);
}

.brand-card.featured .brand-stats-row {
  background: linear-gradient(135deg, #fef7ff 0%, #f0f9ff 100%);
  border-color: var(--primary-100);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}

.love-stat .stat-number {
  color: var(--primary-600);
}

.products-stat .stat-number {
  color: var(--gray-700);
}

.brand-card.featured .stat-number {
  font-size: 28px;
}

.stat-label {
  font-size: 11px;
  color: var(--gray-500);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Action Button */
.brand-action-section {
  margin-top: auto;
}

.explore-brand-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 15px;
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.3);
}

.explore-brand-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(236, 72, 153, 0.4);
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%);
}

.explore-brand-btn i {
  transition: transform 0.3s ease;
}

.explore-brand-btn:hover i {
  transform: translateX(4px);
}

/* Background Pattern */
.brand-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.03) 0%, transparent 50%);
  pointer-events: none;
}

.brand-card.featured .brand-bg-pattern {
  background:
    radial-gradient(circle at 20% 20%, rgba(236, 72, 153, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.06) 0%, transparent 50%);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .brands-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
  }

  .brand-card {
    min-height: 340px;
  }
}

@media (max-width: 768px) {
  .trending-brands {
    padding: 40px 0;
  }

  .trending-brands .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 32px;
  }

  .section-title-wrapper {
    gap: 16px;
  }

  .trending-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .trending-brands .section-title {
    font-size: 24px;
  }

  .brands-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .brand-card {
    min-height: 320px;
  }

  .brand-card.featured {
    min-height: 340px;
  }

  .brand-content {
    padding: 20px 24px 24px;
  }

  .brand-logo-wrapper {
    padding: 24px 24px 0;
  }

  .brand-logo {
    width: 80px;
    height: 80px;
  }

  .brand-card.featured .brand-logo {
    width: 90px;
    height: 90px;
  }

  .brand-name {
    font-size: 20px;
  }

  .brand-card.featured .brand-name {
    font-size: 22px;
  }

  .stat-number {
    font-size: 20px;
  }

  .brand-card.featured .stat-number {
    font-size: 22px;
  }
}

@media (max-width: 480px) {
  .brand-content {
    padding: 16px 20px 20px;
  }

  .brand-logo-wrapper {
    padding: 20px 20px 0;
  }

  .brand-logo {
    width: 70px;
    height: 70px;
  }

  .brand-card.featured .brand-logo {
    width: 80px;
    height: 80px;
  }

  .brand-stats-row {
    gap: 24px;
    padding: 16px;
  }

  .stat-number {
    font-size: 18px;
  }

  .rank-badge {
    top: 16px;
    right: 16px;
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .explore-brand-btn {
    padding: 14px 20px;
    font-size: 14px;
  }
}

/* New Arrivals */
.new-arrivals {
  padding: 40px 0;
  background: linear-gradient(135deg, #faf5ff 0%, #f0f9ff 100%);
}

.new-arrivals .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.arrivals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  justify-content: center;
}

.arrival-card {
  position: relative;
  overflow: visible;
}

.arrival-card::before {
  content: 'NEW';
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  z-index: 3;
  animation: pulse 2s infinite;
}

/* Limited Offers */
.limited-offers {
  padding: 40px 0;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.limited-offers .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.limited-offers::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="2" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  background-size: 50px 50px;
  animation: sparkle 20s linear infinite;
}

.offers-header {
  text-align: center;
  margin-bottom: 60px;
}


.sale-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.sale-product-card {
  transition: all 0.3s ease;
  position: relative;
}

.sale-product-card:hover {
  transform: translateY(-4px);
}

/* Enhanced Sale Badge for Product Cards */
.sale-product-card .sale-badge {
  background: linear-gradient(135deg, var(--error-500), var(--error-600));
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  animation: pulse-sale 2s infinite;
}

@keyframes pulse-sale {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}


.offer-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  color: var(--gray-800);
}

.offer-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.offer-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 2;
}

.discount {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  padding: 8px 16px;
  border-radius: 25px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 4px 16px rgba(255, 107, 107, 0.4);
}

.offer-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.offer-content {
  padding: 32px;
}

.offer-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--gray-800);
}

.offer-description {
  color: var(--gray-600);
  margin-bottom: 20px;
  line-height: 1.5;
}

.offer-pricing {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.offer-new-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-600);
}

.offer-old-price {
  font-size: 18px;
  color: var(--gray-400);
  text-decoration: line-through;
}

.offer-cta {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.offer-cta:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-2px);
}

/* Recently Viewed Enhanced */
.recently-viewed-enhanced {
  padding: 80px 0;
  background: white;
}

.recently-viewed-enhanced .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.recently-viewed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: left;
}

.recently-viewed-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  justify-content: center;
}

.recently-viewed-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-100);
}

.recently-viewed-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.item-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.recently-viewed-item:hover .item-image img {
  transform: scale(1.1);
}

.item-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recently-viewed-item:hover .item-overlay {
  opacity: 1;
}

.quick-add-btn {
  background: white;
  color: var(--primary-600);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick-add-btn:hover {
  background: var(--primary-600);
  color: white;
  transform: scale(1.1);
}

.item-info {
  padding: 16px;
}

.item-info h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--gray-800);
  line-height: 1.3;
}

.item-info .price {
  font-size: 16px;
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: 4px;
}

.viewed-time {
  font-size: 11px;
  color: var(--gray-500);
  margin-bottom: 8px;
}

.item-rating .stars {
  display: flex;
  gap: 2px;
}

.item-rating .stars i {
  font-size: 10px;
  color: var(--gray-300);
}

.item-rating .stars i.active {
  color: var(--warning-500);
}

/* Beauty Tips */
.beauty-tips {
  padding: 40px 0;
  background: var(--gray-50);
}

.beauty-tips .container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
  justify-content: center;
}

.tip-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.tip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.tip-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.tip-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tip-card:hover .tip-image img {
  transform: scale(1.05);
}

.tip-duration {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.tip-content {
  padding: 24px;
}

.tip-category {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.tip-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 16px 0 8px;
  line-height: 1.3;
}

.tip-excerpt {
  color: var(--gray-600);
  line-height: 1.5;
  margin-bottom: 16px;
}

.tip-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--gray-500);
}

/* Newsletter Enhanced */
.newsletter-enhanced {
  padding: 80px 0;
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--purple-600) 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.newsletter-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>') repeat;
  background-size: 100px 100px;
  animation: float 20s ease-in-out infinite;
}

.newsletter-content {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.newsletter-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.beauty-icons {
  display: flex;
  gap: 40px;
  font-size: 80px;
  opacity: 0.3;
}

.beauty-icons i {
  animation: float 3s ease-in-out infinite;
}

.beauty-icons i:nth-child(2) {
  animation-delay: 1s;
}

.beauty-icons i:nth-child(3) {
  animation-delay: 2s;
}

.newsletter-text h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.newsletter-text p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  line-height: 1.5;
}

.newsletter-benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  opacity: 0.9;
}

.benefit i {
  width: 20px;
  text-align: center;
}

.newsletter-form .form-group {
  position: relative;
  margin-bottom: 12px;
}

.newsletter-input {
  width: 100%;
  padding: 18px 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.newsletter-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-btn {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  color: var(--primary-600);
  border: none;
  padding: 12px 24px;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.newsletter-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-50%) scale(1.05);
}

.newsletter-disclaimer {
  font-size: 12px;
  opacity: 0.7;
  text-align: center;
  margin: 0;
}

.newsletter-disclaimer a {
  color: white;
  text-decoration: underline;
}

/* Utility Classes */
.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: var(--gray-800);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.section-subtitle {
  text-align: center;
  color: var(--gray-600);
  font-size: 18px;
  margin-bottom: 48px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.section-header {
  margin-bottom: 60px;
  text-align: center;
}

.section-link {
  color: var(--primary-600);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.2s ease;
  justify-content: center;
  margin-top: 24px;
}

.section-link:hover {
  color: var(--primary-700);
}

.clear-btn {
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  color: var(--gray-600);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.clear-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

/* Animations */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes sparkle {
  0% { transform: translateX(0); }
  100% { transform: translateX(100px); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .newsletter-content {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .beauty-icons {
    font-size: 60px;
    gap: 30px;
  }
  
  .offers-header {
    flex-direction: column;
    text-align: center;
  }
  
  .brands-carousel {
    margin: 0 40px;
  }

  .categories-mega-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 36px;
  }
  
  .banner-subtitle {
    font-size: 16px;
  }
  
  .mega-category-card {
    min-height: 280px;
  }
  
  .category-content {
    padding: 24px;
  }
  
  .category-icon-wrapper {
    width: 60px;
    height: 60px;
    font-size: 24px;
  }
  
  .category-title {
    font-size: 20px;
  }
  
  .type-tiles {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .type-tile {
    padding: 24px 16px;
  }
  
  .newsletter-text h2 {
    font-size: 28px;
  }
  
  .beauty-icons {
    font-size: 40px;
    gap: 20px;
  }
  
  .brands-carousel {
    margin: 0 20px;
  }
  
  .carousel-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .campaign-banners {
    height: 400px;
  }
  
  .banner-title {
    font-size: 28px;
  }
  
  .banner-content {
    padding: 0 16px;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .categories-mega-grid,
  .arrivals-grid,
  .offers-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .newsletter-input {
    padding: 16px 20px;
    font-size: 14px;
  }
  
  .newsletter-btn {
    position: static;
    width: 100%;
    margin-top: 12px;
    justify-content: center;
    transform: none !important;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
}

/* Colored Background Classes for Sale Cards */
.sale-card-blue {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.sale-card-blue:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(59, 130, 246, 0.3);
}

.sale-card-red {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.sale-card-red:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(239, 68, 68, 0.3);
}

.sale-card-sky {
  background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%);
  border: 1px solid #81d4fa;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.sale-card-sky:hover {
  background: linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%);
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(3, 169, 244, 0.3);
}
</style>
