<template>
  <div class="fashion-flash">
    <div class="flash-container">
      <!-- Logo Animation -->
      <div class="logo-animation" :class="{ animate: showLogo }">
        <div class="logo-icon">
          <i class="fas fa-tshirt"></i>
        </div>
        <h1 class="logo-text">Fashion Market</h1>
        <p class="tagline">Discover Your Style</p>
      </div>

      <!-- Loading Animation -->
      <div class="loading-section" :class="{ show: showLoading }">
        <div class="loading-animation">
          <div class="fashion-items">
            <i class="fas fa-tshirt item-1"></i>
            <i class="fas fa-shoe-prints item-2"></i>
            <i class="fas fa-shopping-bag item-3"></i>
            <i class="fas fa-gems item-4"></i>
          </div>
        </div>
        <p class="loading-text">{{ loadingText }}</p>
      </div>

      <!-- Fashion Showcase -->
      <div class="fashion-showcase" :class="{ show: showShowcase }">
        <div class="showcase-grid">
          <div 
            v-for="(item, index) in showcaseItems" 
            :key="index"
            class="showcase-item"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <img :src="item.image" :alt="item.name">
            <div class="item-overlay">
              <span class="item-category">{{ item.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Skip Button -->
      <button 
        v-if="showSkip" 
        @click="skipFlash" 
        class="skip-btn"
      >
        Skip
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FashionFlash',
  data() {
    return {
      showLogo: false,
      showLoading: false,
      showShowcase: false,
      showSkip: false,
      loadingText: 'Loading latest fashion...',
      loadingTexts: [
        'Loading latest fashion...',
        'Curating trending styles...',
        'Preparing your wardrobe...',
        'Almost ready...'
      ],
      currentTextIndex: 0,
      showcaseItems: [
        {
          name: 'Summer Dress',
          category: "Women's",
          image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=300'
        },
        {
          name: 'Casual Blazer',
          category: "Men's",
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
        },
        {
          name: 'Designer Handbag',
          category: 'Accessories',
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300'
        },
        {
          name: 'Luxury Watch',
          category: 'Jewelry',
          image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=300'
        }
      ]
    };
  },
  mounted() {
    this.startFlashSequence();
  },
  methods: {
    startFlashSequence() {
      // Show logo
      setTimeout(() => {
        this.showLogo = true;
      }, 500);

      // Show loading
      setTimeout(() => {
        this.showLoading = true;
        this.startLoadingTextRotation();
      }, 2000);

      // Show skip button
      setTimeout(() => {
        this.showSkip = true;
      }, 3000);

      // Show showcase
      setTimeout(() => {
        this.showShowcase = true;
      }, 4000);

      // Auto proceed to main app
      setTimeout(() => {
        this.proceedToApp();
      }, 7000);
    },
    startLoadingTextRotation() {
      const interval = setInterval(() => {
        this.currentTextIndex = (this.currentTextIndex + 1) % this.loadingTexts.length;
        this.loadingText = this.loadingTexts[this.currentTextIndex];
        
        if (this.currentTextIndex === this.loadingTexts.length - 1) {
          clearInterval(interval);
        }
      }, 1000);
    },
    skipFlash() {
      this.proceedToApp();
    },
    proceedToApp() {
      // Check if user needs to select location
      const userLocation = this.$store.getters['user/userProfile'].location;
      
      if (!userLocation) {
        this.$router.replace('/fashion/location');
      } else {
        this.$router.replace('/fashion');
      }
    }
  }
};
</script>

<style scoped>
.fashion-flash {
  height: 100vh;
  background: linear-gradient(135deg, var(--market-primary) 0%, #2c2c2c 50%, var(--market-accent) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.flash-container {
  text-align: center;
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 40px;
}

.logo-animation {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.logo-animation.animate {
  opacity: 1;
  transform: translateY(0);
}

.logo-icon {
  font-size: 80px;
  color: var(--market-accent);
  margin-bottom: 20px;
  animation: logoFloat 3s ease-in-out infinite;
}

.logo-text {
  font-size: 48px;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  background: linear-gradient(135deg, white, var(--market-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.loading-section {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  margin-top: 60px;
}

.loading-section.show {
  opacity: 1;
  transform: translateY(0);
}

.loading-animation {
  margin-bottom: 24px;
}

.fashion-items {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-bottom: 20px;
}

.fashion-items i {
  font-size: 32px;
  color: var(--market-accent);
  animation: itemBounce 1.5s ease-in-out infinite;
}

.item-1 { animation-delay: 0s; }
.item-2 { animation-delay: 0.3s; }
.item-3 { animation-delay: 0.6s; }
.item-4 { animation-delay: 0.9s; }

.loading-text {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-weight: 500;
  min-height: 24px;
  transition: all 0.3s ease;
}

.fashion-showcase {
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
  margin-top: 40px;
}

.fashion-showcase.show {
  opacity: 1;
  transform: translateY(0);
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
}

.showcase-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  opacity: 0;
  transform: scale(0.8);
  animation: showcaseItemFadeIn 0.8s ease forwards;
}

.showcase-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 16px 12px 8px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.showcase-item:hover .item-overlay {
  transform: translateY(0);
}

.showcase-item:hover img {
  transform: scale(1.1);
}

.item-category {
  color: white;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.skip-btn {
  position: absolute;
  top: 40px;
  right: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeInScale 0.5s ease forwards;
}

.skip-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: var(--market-accent);
  color: var(--market-accent);
}

/* Animations */
@keyframes logoFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes itemBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes showcaseItemFadeIn {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fadeInScale {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .flash-container {
    padding: 20px;
  }
  
  .logo-icon {
    font-size: 60px;
  }
  
  .logo-text {
    font-size: 36px;
  }
  
  .tagline {
    font-size: 16px;
  }
  
  .fashion-items {
    gap: 20px;
  }
  
  .fashion-items i {
    font-size: 24px;
  }
  
  .skip-btn {
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    max-width: 300px;
  }
  
  .logo-text {
    font-size: 28px;
  }
  
  .tagline {
    font-size: 14px;
  }
}
</style>
