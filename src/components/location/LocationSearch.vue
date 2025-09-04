<template>
  <div class="location-search-overlay" v-if="isVisible" @click="closeModal">
    <div class="location-search-modal" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">
          <i class="fas fa-map-marker-alt"></i>
          Let's find beauty near you
        </h2>
        <p class="modal-subtitle">
          Discover personalized beauty experiences in your area
        </p>
        <button @click="closeModal" class="close-btn">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="modal-body">
        <!-- Auto-Detection Section -->
        <div class="detection-section">
          <div class="auto-detect-card" :class="{ loading: isDetecting, success: locationDetected }">
            <div class="detect-icon">
              <i v-if="!isDetecting && !locationDetected" class="fas fa-location-crosshairs"></i>
              <i v-if="isDetecting" class="fas fa-spinner fa-spin"></i>
              <i v-if="locationDetected" class="fas fa-check-circle"></i>
            </div>
            <div class="detect-content">
              <h3>{{ detectTitle }}</h3>
              <p>{{ detectSubtitle }}</p>
            </div>
            <button 
              v-if="!locationDetected" 
              @click="detectLocation" 
              :disabled="isDetecting"
              class="detect-btn"
            >
              {{ isDetecting ? 'Detecting...' : 'Use My Location' }}
            </button>
            <div v-if="locationDetected" class="detected-location">
              <i class="fas fa-map-pin"></i>
              <span>{{ currentLocation.address }}</span>
            </div>
          </div>
        </div>

        <!-- Manual Search Section -->
        <div class="search-section">
          <div class="search-divider">
            <span>or</span>
          </div>
          
          <div class="search-input-container">
            <div class="search-input-wrapper">
              <i class="fas fa-search search-icon"></i>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="showSuggestions = true"
                @keydown="handleKeyDown"
                type="text"
                placeholder="Search for a city, address, or ZIP code"
                class="location-input"
                ref="searchInput"
              >
              <button 
                v-if="searchQuery" 
                @click="clearSearch" 
                class="clear-btn"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <!-- Auto-suggestions Dropdown -->
            <div v-if="showSuggestions && suggestions.length" class="suggestions-dropdown">
              <div 
                v-for="(suggestion, index) in suggestions" 
                :key="index"
                @click="selectSuggestion(suggestion)"
                :class="['suggestion-item', { active: selectedIndex === index }]"
              >
                <div class="suggestion-icon">
                  <i class="fas fa-map-marker-alt"></i>
                </div>
                <div class="suggestion-content">
                  <div class="suggestion-main">{{ suggestion.main }}</div>
                  <div class="suggestion-secondary">{{ suggestion.secondary }}</div>
                </div>
                <div class="suggestion-distance" v-if="suggestion.distance">
                  {{ suggestion.distance }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Locations -->
        <div class="popular-section" v-if="!searchQuery && !locationDetected">
          <h3 class="popular-title">Popular Beauty Destinations</h3>
          <div class="popular-grid">
            <div 
              v-for="location in popularLocations" 
              :key="location.id"
              @click="selectPopularLocation(location)"
              class="popular-item"
            >
              <div class="popular-icon">
                <i :class="location.icon"></i>
              </div>
              <div class="popular-info">
                <h4>{{ location.name }}</h4>
                <p>{{ location.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results Preview -->
        <div v-if="selectedLocation" class="results-preview">
          <h3 class="preview-title">Beauty Services Near You</h3>
          <div class="preview-stats">
            <div class="stat-item">
              <i class="fas fa-store"></i>
              <span>{{ nearbyResults.stores }}+ Beauty Stores</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-cut"></i>
              <span>{{ nearbyResults.salons }}+ Salons & Spas</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-shipping-fast"></i>
              <span>Same-day delivery available</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button @click="closeModal" class="btn btn-outline">
          Skip for Now
        </button>
        <button 
          @click="confirmLocation" 
          :disabled="!selectedLocation && !locationDetected"
          class="btn btn-primary"
        >
          <i class="fas fa-check"></i>
          {{ selectedLocation || locationDetected ? 'Continue' : 'Select Location' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationSearch',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDetecting: false,
      locationDetected: false,
      searchQuery: '',
      showSuggestions: false,
      selectedIndex: -1,
      selectedLocation: null,
      currentLocation: {
        lat: null,
        lng: null,
        address: ''
      },
      searchTimeout: null,
      suggestions: [],
      popularLocations: [
        {
          id: 1,
          name: 'New York City',
          description: '500+ beauty stores & salons',
          icon: 'fas fa-city',
          coordinates: { lat: 40.7128, lng: -74.0060 }
        },
        {
          id: 2,
          name: 'Los Angeles',
          description: '400+ beauty destinations',
          icon: 'fas fa-palm-tree',
          coordinates: { lat: 34.0522, lng: -118.2437 }
        },
        {
          id: 3,
          name: 'Chicago',
          description: '300+ beauty professionals',
          icon: 'fas fa-building',
          coordinates: { lat: 41.8781, lng: -87.6298 }
        },
        {
          id: 4,
          name: 'Miami',
          description: '250+ luxury beauty spots',
          icon: 'fas fa-sun',
          coordinates: { lat: 25.7617, lng: -80.1918 }
        }
      ],
      nearbyResults: {
        stores: 156,
        salons: 89,
        delivery: true
      }
    };
  },
  computed: {
    detectTitle() {
      if (this.isDetecting) return 'Finding your location...';
      if (this.locationDetected) return 'Location detected!';
      return 'Quick & Easy Location Detection';
    },
    detectSubtitle() {
      if (this.isDetecting) return 'Please allow location access in your browser';
      if (this.locationDetected) return 'We found beauty services near you';
      return 'Get personalized beauty recommendations based on your area';
    }
  },
  methods: {
    async detectLocation() {
      if (!navigator.geolocation) {
        this.$emit('error', 'Geolocation is not supported by this browser');
        return;
      }

      this.isDetecting = true;
      
      try {
        const position = await this.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        
        this.currentLocation.lat = latitude;
        this.currentLocation.lng = longitude;
        
        // Reverse geocoding simulation (in real app, use Google Maps API)
        const address = await this.reverseGeocode(latitude, longitude);
        this.currentLocation.address = address;
        
        this.locationDetected = true;
        this.selectedLocation = this.currentLocation;
        
        // Update nearby results based on location
        this.updateNearbyResults();
        
        this.$emit('location-detected', this.currentLocation);
      } catch (error) {
        this.handleLocationError(error);
      } finally {
        this.isDetecting = false;
      }
    },

    getCurrentPosition() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 600000
          }
        );
      });
    },

    async reverseGeocode(lat, lng) {
      // Simulate reverse geocoding API call
      await this.delay(1000);
      
      // In a real implementation, use Google Maps Geocoding API
      const cities = [
        'New York, NY',
        'Los Angeles, CA', 
        'Chicago, IL',
        'Houston, TX',
        'Phoenix, AZ',
        'Philadelphia, PA',
        'San Antonio, TX',
        'San Diego, CA'
      ];
      
      return cities[Math.floor(Math.random() * cities.length)];
    },

    handleLocationError(error) {
      let message = 'Unable to detect location';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access denied. Please enable location sharing.';
          break;
        case error.POSITION_UNAVAILABLE:
          message = 'Location information unavailable.';
          break;
        case error.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }
      
      this.$emit('error', message);
    },

    handleSearchInput() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      
      this.searchTimeout = setTimeout(() => {
        if (this.searchQuery.length >= 2) {
          this.fetchSuggestions();
        } else {
          this.suggestions = [];
          this.showSuggestions = false;
        }
      }, 300);
    },

    async fetchSuggestions() {
      // Simulate API call for location suggestions
      await this.delay(200);
      
      const mockSuggestions = [
        {
          main: 'New York, NY, USA',
          secondary: 'New York, United States',
          distance: '0 mi'
        },
        {
          main: 'New York University',
          secondary: '4 Washington Square N, New York, NY',
          distance: '2.1 mi'
        },
        {
          main: 'New York Public Library',
          secondary: '5th Ave & E 42nd St, New York, NY',
          distance: '1.8 mi'
        },
        {
          main: 'Newark, NJ, USA',
          secondary: 'New Jersey, United States',
          distance: '8.7 mi'
        }
      ].filter(item => 
        item.main.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      
      this.suggestions = mockSuggestions;
      this.showSuggestions = true;
      this.selectedIndex = -1;
    },

    handleKeyDown(event) {
      if (!this.showSuggestions || !this.suggestions.length) return;
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.selectedIndex = Math.min(this.selectedIndex + 1, this.suggestions.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.selectedIndex = Math.max(this.selectedIndex - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.selectedIndex >= 0) {
            this.selectSuggestion(this.suggestions[this.selectedIndex]);
          }
          break;
        case 'Escape':
          this.showSuggestions = false;
          this.selectedIndex = -1;
          break;
      }
    },

    selectSuggestion(suggestion) {
      this.searchQuery = suggestion.main;
      this.selectedLocation = {
        address: suggestion.main,
        lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock coordinates
        lng: -74.0060 + (Math.random() - 0.5) * 0.1
      };
      this.showSuggestions = false;
      this.updateNearbyResults();
      this.$emit('location-selected', this.selectedLocation);
    },

    selectPopularLocation(location) {
      this.selectedLocation = {
        address: location.name,
        lat: location.coordinates.lat,
        lng: location.coordinates.lng
      };
      this.searchQuery = location.name;
      this.updateNearbyResults();
      this.$emit('location-selected', this.selectedLocation);
    },

    updateNearbyResults() {
      // Simulate updating nearby results based on location
      this.nearbyResults = {
        stores: Math.floor(Math.random() * 200) + 50,
        salons: Math.floor(Math.random() * 100) + 30,
        delivery: true
      };
    },

    clearSearch() {
      this.searchQuery = '';
      this.suggestions = [];
      this.showSuggestions = false;
      this.selectedLocation = null;
      this.selectedIndex = -1;
    },

    confirmLocation() {
      const location = this.selectedLocation || this.currentLocation;
      this.$emit('location-confirmed', location);
      this.closeModal();
    },

    closeModal() {
      this.$emit('close');
      this.resetState();
    },

    resetState() {
      this.searchQuery = '';
      this.suggestions = [];
      this.showSuggestions = false;
      this.selectedIndex = -1;
      this.selectedLocation = null;
      this.locationDetected = false;
      this.isDetecting = false;
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  },

  mounted() {
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showSuggestions = false;
      }
    });
  }
};
</script>

<style scoped>
.location-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.location-search-modal {
  background: white;
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  max-width: 580px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 32px 32px 24px;
  text-align: center;
  position: relative;
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border-radius: 20px 20px 0 0;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-800);
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.modal-title i {
  color: var(--primary-600);
  font-size: 24px;
}

.modal-subtitle {
  color: var(--gray-600);
  font-size: 16px;
  margin: 0;
  line-height: 1.5;
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-600);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: white;
  color: var(--gray-800);
  box-shadow: var(--shadow);
}

.modal-body {
  padding: 0 32px 24px;
}

/* Auto-Detection Section */
.detection-section {
  margin-bottom: 32px;
}

.auto-detect-card {
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.auto-detect-card.loading {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.auto-detect-card.success {
  border-color: var(--success-500);
  background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
}

.auto-detect-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%);
  transition: left 0.6s ease;
}

.auto-detect-card.loading::before {
  left: 100%;
}

.detect-icon {
  text-align: center;
  margin-bottom: 16px;
}

.detect-icon i {
  font-size: 48px;
  color: var(--primary-500);
}

.auto-detect-card.loading .detect-icon i {
  color: var(--primary-600);
}

.auto-detect-card.success .detect-icon i {
  color: var(--success-500);
}

.detect-content {
  text-align: center;
  margin-bottom: 20px;
}

.detect-content h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 8px;
}

.detect-content p {
  color: var(--gray-600);
  margin: 0;
  line-height: 1.5;
}

.detect-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.detect-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.detect-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.detected-location {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  color: var(--gray-700);
  font-weight: 500;
}

.detected-location i {
  color: var(--success-500);
}

/* Search Section */
.search-section {
  margin-bottom: 32px;
}

.search-divider {
  text-align: center;
  margin: 24px 0;
  position: relative;
}

.search-divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gray-200);
}

.search-divider span {
  background: white;
  color: var(--gray-500);
  padding: 0 16px;
  font-size: 14px;
  position: relative;
  z-index: 1;
}

.search-input-container {
  position: relative;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 16px;
  z-index: 2;
}

.location-input {
  width: 100%;
  padding: 16px 20px 16px 48px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 16px;
  background: white;
  transition: all 0.2s ease;
}

.location-input:focus {
  outline: none;
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
}

.clear-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--gray-100);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--gray-500);
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

/* Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  z-index: 10;
  max-height: 300px;
  overflow-y: auto;
  margin-top: 4px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid var(--gray-100);
  transition: background-color 0.2s ease;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover,
.suggestion-item.active {
  background: var(--primary-50);
}

.suggestion-icon {
  color: var(--gray-400);
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.suggestion-content {
  flex: 1;
  min-width: 0;
}

.suggestion-main {
  font-weight: 500;
  color: var(--gray-800);
  margin-bottom: 2px;
}

.suggestion-secondary {
  font-size: 14px;
  color: var(--gray-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-distance {
  font-size: 12px;
  color: var(--gray-500);
  margin-left: 12px;
}

/* Popular Locations */
.popular-section {
  margin-bottom: 32px;
}

.popular-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 16px;
}

.popular-grid {
  display: grid;
  gap: 12px;
}

.popular-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.popular-item:hover {
  background: var(--primary-50);
  border-color: var(--primary-200);
  transform: translateY(-1px);
}

.popular-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-600);
  margin-right: 16px;
  font-size: 16px;
}

.popular-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 4px;
}

.popular-info p {
  font-size: 14px;
  color: var(--gray-600);
  margin: 0;
}

/* Results Preview */
.results-preview {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
}

.preview-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0 0 16px;
  text-align: center;
}

.preview-stats {
  display: grid;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  font-weight: 500;
  color: var(--gray-700);
}

.stat-item i {
  color: var(--primary-600);
  width: 20px;
  text-align: center;
}

/* Modal Footer */
.modal-footer {
  padding: 24px 32px 32px;
  display: flex;
  gap: 16px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
  border-radius: 0 0 20px 20px;
}

.modal-footer .btn {
  flex: 1;
  padding: 16px 24px;
  font-weight: 600;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-outline {
  background: white;
  color: var(--gray-700);
  border: 2px solid var(--gray-300);
}

.btn-outline:hover {
  border-color: var(--gray-400);
  background: var(--gray-50);
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: 2px solid transparent;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive Design */
@media (max-width: 768px) {
  .location-search-overlay {
    padding: 16px;
  }
  
  .location-search-modal {
    max-height: 95vh;
  }
  
  .modal-header {
    padding: 24px 24px 20px;
  }
  
  .modal-title {
    font-size: 24px;
  }
  
  .modal-body {
    padding: 0 24px 20px;
  }
  
  .modal-footer {
    padding: 20px 24px 24px;
    flex-direction: column;
  }
  
  .close-btn {
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
  }
  
  .detect-icon i {
    font-size: 40px;
  }
  
  .detect-content h3 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .modal-header {
    padding: 20px 20px 16px;
  }
  
  .modal-title {
    font-size: 20px;
    flex-direction: column;
    gap: 8px;
  }
  
  .modal-body {
    padding: 0 20px 16px;
  }
  
  .modal-footer {
    padding: 16px 20px 20px;
  }
  
  .auto-detect-card {
    padding: 20px;
  }
  
  .suggestion-item {
    padding: 12px;
  }
  
  .popular-item {
    padding: 12px;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .location-search-modal,
  .auto-detect-card,
  .detect-btn,
  .popular-item,
  .suggestion-item,
  .btn {
    transition: none;
  }
  
  .auto-detect-card::before {
    transition: none;
  }
}

/* Focus styles for keyboard navigation */
.detect-btn:focus-visible,
.location-input:focus-visible,
.clear-btn:focus-visible,
.close-btn:focus-visible,
.popular-item:focus-visible,
.suggestion-item:focus-visible,
.btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
