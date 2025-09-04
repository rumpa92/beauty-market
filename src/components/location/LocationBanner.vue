<template>
  <div class="location-banner" v-if="location && showBanner">
    <div class="banner-container">
      <div class="banner-icon">
        <i class="fas fa-map-marker-alt"></i>
      </div>
      <div class="banner-content">
        <h4 class="banner-title">Beauty services in {{ getLocationName(location.address) }}</h4>
        <p class="banner-subtitle">{{ servicesText }}</p>
      </div>
      <div class="banner-actions">
        <button @click="findServices" class="find-btn">
          <i class="fas fa-search"></i>
          Find Services
        </button>
        <button @click="closeBanner" class="close-banner-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationBanner',
  props: {
    location: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      showBanner: true,
      services: {
        stores: Math.floor(Math.random() * 50) + 20,
        salons: Math.floor(Math.random() * 30) + 10,
        spas: Math.floor(Math.random() * 20) + 5
      }
    };
  },
  computed: {
    servicesText() {
      const { stores, salons, spas } = this.services;
      return `${stores} beauty stores, ${salons} salons & ${spas} spas nearby`;
    }
  },
  methods: {
    getLocationName(address) {
      if (!address) return 'your area';
      const parts = address.split(',');
      return parts[0].trim() || 'your area';
    },
    
    findServices() {
      this.$emit('find-services', this.location);
    },
    
    closeBanner() {
      this.showBanner = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.location-banner {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border: 1px solid var(--primary-200);
  border-radius: 12px;
  margin: 16px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  animation: slideDown 0.4s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.banner-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.banner-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  flex-shrink: 0;
  box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
}

.banner-content {
  flex: 1;
  min-width: 0;
}

.banner-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.banner-subtitle {
  font-size: 14px;
  color: var(--gray-600);
  margin: 0;
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.find-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.find-btn:hover {
  background: var(--primary-600);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(236, 72, 153, 0.3);
}

.close-banner-btn {
  background: var(--gray-100);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-500);
  transition: all 0.2s ease;
}

.close-banner-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

@media (max-width: 768px) {
  .location-banner {
    margin: 12px 16px;
  }
  
  .banner-container {
    padding: 14px 16px;
    gap: 12px;
  }
  
  .banner-icon {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
  
  .banner-title {
    font-size: 15px;
  }
  
  .banner-subtitle {
    font-size: 13px;
  }
  
  .find-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .banner-actions {
    flex-direction: column;
    gap: 6px;
  }
  
  .find-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
