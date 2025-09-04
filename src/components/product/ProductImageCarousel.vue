<template>
  <div class="image-carousel-container">
    <!-- Share Icons Overlay -->
    <div class="share-overlay">
      <button @click="shareProduct('whatsapp')" class="share-btn whatsapp-share" title="Share on WhatsApp">
        <i class="fab fa-whatsapp"></i>
      </button>
      <button @click="shareProduct('instagram')" class="share-btn instagram-share" title="Share on Instagram">
        <i class="fab fa-instagram"></i>
      </button>
      <button @click="shareProduct('facebook')" class="share-btn facebook-share" title="Share on Facebook">
        <i class="fab fa-facebook"></i>
      </button>
      <button @click="copyLink" class="share-btn copy-link" title="Copy Link">
        <i class="fas fa-link"></i>
      </button>
    </div>

    <!-- Main Image Container -->
    <div 
      class="main-image-wrapper"
      @mousemove="handleZoom"
      @mouseleave="resetZoom"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      ref="imageWrapper"
    >
      <img 
        :src="currentImage" 
        :alt="imageAlt"
        class="main-image"
        :style="zoomStyle"
        ref="mainImage"
        @click="openFullscreen"
      />
      
      <!-- Zoom Indicator -->
      <div v-if="!isMobile" class="zoom-indicator">
        <i class="fas fa-search-plus"></i>
        <span>Hover to zoom</span>
      </div>

      <!-- Carousel Navigation -->
      <button 
        @click="previousImage" 
        class="carousel-nav-btn prev-btn"
        :disabled="currentIndex === 0"
        v-if="images.length > 1"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button 
        @click="nextImage" 
        class="carousel-nav-btn next-btn"
        :disabled="currentIndex === images.length - 1"
        v-if="images.length > 1"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

      <!-- Image Counter -->
      <div class="image-counter" v-if="images.length > 1">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>

    <!-- Thumbnail Navigation -->
    <div class="thumbnails-container" v-if="images.length > 1">
      <div class="thumbnails-wrapper">
        <button 
          v-for="(image, index) in images" 
          :key="index"
          class="thumbnail-btn"
          :class="{ active: currentIndex === index }"
          @click="selectImage(index)"
        >
          <img :src="image" :alt="`${imageAlt} view ${index + 1}`" />
        </button>
      </div>
    </div>

    <!-- Fullscreen Modal -->
    <div v-if="showFullscreen" class="fullscreen-modal" @click="closeFullscreen">
      <div class="fullscreen-content" @click.stop>
        <button @click="closeFullscreen" class="close-fullscreen">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentImage" :alt="imageAlt" class="fullscreen-image" />
        
        <!-- Fullscreen Navigation -->
        <button 
          @click="previousImage" 
          class="fullscreen-nav prev"
          :disabled="currentIndex === 0"
          v-if="images.length > 1"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          @click="nextImage" 
          class="fullscreen-nav next"
          :disabled="currentIndex === images.length - 1"
          v-if="images.length > 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification success">
        <i class="fas fa-check-circle"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ProductImageCarousel',
  props: {
    images: {
      type: Array,
      required: true,
      default: () => []
    },
    productName: {
      type: String,
      default: 'Product'
    },
    productBrand: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentIndex: 0,
      zoomStyle: {},
      touchStartX: null,
      touchStartY: null,
      showFullscreen: false,
      showToast: false,
      toastMessage: '',
      isMobile: false
    };
  },
  computed: {
    currentImage() {
      return this.images[this.currentIndex] || '';
    },
    imageAlt() {
      return `${this.productBrand} ${this.productName}`;
    }
  },
  methods: {
    selectImage(index) {
      this.currentIndex = index;
      this.resetZoom();
    },
    
    nextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this.resetZoom();
      }
    },
    
    previousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.resetZoom();
      }
    },

    // Desktop zoom functionality
    handleZoom(event) {
      if (this.isMobile) return;
      
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      
      this.zoomStyle = {
        transform: 'scale(2.5)',
        transformOrigin: `${xPercent}% ${yPercent}%`,
        cursor: 'zoom-in'
      };
    },
    
    resetZoom() {
      this.zoomStyle = {};
    },

    // Touch events for mobile swipe
    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
      this.touchStartY = event.touches[0].clientY;
    },
    
    handleTouchMove(event) {
      if (!this.touchStartX || !this.touchStartY) return;
      
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;
      const diffX = this.touchStartX - touchX;
      const diffY = this.touchStartY - touchY;
      
      // Only handle horizontal swipes (ignore vertical scrolling)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        event.preventDefault();
        
        if (diffX > 0) {
          this.nextImage();
        } else {
          this.previousImage();
        }
        this.touchStartX = null;
        this.touchStartY = null;
      }
    },
    
    handleTouchEnd() {
      this.touchStartX = null;
      this.touchStartY = null;
    },

    // Fullscreen functionality
    openFullscreen() {
      this.showFullscreen = true;
      document.body.style.overflow = 'hidden';
    },

    closeFullscreen() {
      this.showFullscreen = false;
      document.body.style.overflow = 'auto';
    },

    // Share functionality
    shareProduct(platform) {
      const url = window.location.href;
      const text = `Check out this amazing ${this.productName} from ${this.productBrand}!`;
      
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
          break;
        case 'instagram':
          this.showToastMessage('Copy the link to share on Instagram');
          this.copyLink();
          break;
      }
    },
    
    copyLink() {
      navigator.clipboard.writeText(window.location.href);
      this.showToastMessage('Link copied to clipboard!');
    },

    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  },

  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    
    // Keyboard navigation
    const handleKeydown = (event) => {
      if (this.showFullscreen) {
        switch (event.key) {
          case 'ArrowLeft':
            this.previousImage();
            break;
          case 'ArrowRight':
            this.nextImage();
            break;
          case 'Escape':
            this.closeFullscreen();
            break;
        }
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    
    // Cleanup
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('resize', this.checkMobile);
      document.removeEventListener('keydown', handleKeydown);
    });
  }
};
</script>

<style scoped>
.image-carousel-container {
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
}

/* Share Overlay */
.share-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 16px;
}

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.whatsapp-share:hover { color: #25d366; background: rgba(37, 211, 102, 0.1); }
.instagram-share:hover { color: #e4405f; background: rgba(228, 64, 95, 0.1); }
.facebook-share:hover { color: #1877f2; background: rgba(24, 119, 242, 0.1); }
.copy-link:hover { color: #8b5cf6; background: rgba(139, 92, 246, 0.1); }

/* Main Image */
.main-image-wrapper {
  position: relative;
  width: 100%;
  height: 600px;
  overflow: hidden;
  cursor: zoom-in;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.zoom-indicator {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.8;
}

/* Carousel Navigation */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  color: #374151;
  z-index: 5;
}

.carousel-nav-btn:hover:not(:disabled) {
  background: white;
  transform: translateY(-50%) scale(1.1);
  color: var(--market-primary);
}

.carousel-nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.prev-btn { left: 20px; }
.next-btn { right: 20px; }

.image-counter {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  font-weight: 500;
}

/* Thumbnails */
.thumbnails-container {
  padding: 20px;
  background: white;
}

.thumbnails-wrapper {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 5px;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}

.thumbnails-wrapper::-webkit-scrollbar {
  height: 4px;
}

.thumbnails-wrapper::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 2px;
}

.thumbnails-wrapper::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 2px;
}

.thumbnail-btn {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  transition: all 0.3s ease;
  background: none;
  padding: 0;
}

.thumbnail-btn:hover {
  border-color: #ec4899;
  transform: scale(1.05);
}

.thumbnail-btn.active {
  border-color: #ec4899;
  transform: scale(1.05);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.thumbnail-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Fullscreen Modal */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
}

.fullscreen-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.close-fullscreen {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-fullscreen:hover {
  background: rgba(255, 255, 255, 0.2);
}

.fullscreen-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-nav:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.fullscreen-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fullscreen-nav.prev { left: -80px; }
.fullscreen-nav.next { right: -80px; }

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #22c55e;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  font-weight: 500;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .main-image-wrapper {
    height: 400px;
  }
  
  .share-overlay {
    top: 10px;
    right: 10px;
  }
  
  .share-btn {
    width: 38px;
    height: 38px;
    font-size: 14px;
  }
  
  .carousel-nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .prev-btn { left: 10px; }
  .next-btn { right: 10px; }
  
  .thumbnails-container {
    padding: 15px;
  }
  
  .thumbnail-btn {
    width: 60px;
    height: 60px;
  }
  
  .zoom-indicator {
    display: none;
  }
  
  .fullscreen-nav.prev { left: -60px; }
  .fullscreen-nav.next { right: -60px; }
}

@media (max-width: 480px) {
  .main-image-wrapper {
    height: 350px;
  }
  
  .thumbnails-container {
    padding: 10px;
  }
  
  .thumbnail-btn {
    width: 50px;
    height: 50px;
  }
  
  .fullscreen-nav {
    width: 50px;
    height: 50px;
    font-size: 18px;
  }
  
  .fullscreen-nav.prev { left: 10px; }
  .fullscreen-nav.next { right: 10px; }
}
</style>
