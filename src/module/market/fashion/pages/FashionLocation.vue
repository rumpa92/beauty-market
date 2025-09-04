<template>
  <div class="fashion-location market-container">
    <div class="location-container">
      <h1 class="market-title-lg">Select Your Location</h1>
      <p class="market-text-light">We'll show you the best fashion deals in your area</p>
      
      <div class="location-methods">
        <button @click="autoDetectLocation" class="market-btn market-btn-primary">
          <i class="fas fa-location-arrow"></i>
          Auto-detect Location
        </button>
        
        <div class="location-search">
          <input 
            type="text" 
            placeholder="Enter your city or postal code"
            v-model="locationQuery"
            class="market-form-input"
          >
          <button @click="searchLocation" class="market-btn market-btn-secondary">
            Search
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FashionLocation',
  data() {
    return {
      locationQuery: ''
    };
  },
  methods: {
    autoDetectLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {
          this.$router.push('/fashion');
        });
      }
    },
    searchLocation() {
      if (this.locationQuery) {
        this.$router.push('/fashion');
      }
    }
  }
};
</script>

<style scoped>
.fashion-location {
  padding: 60px 0;
  text-align: center;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.location-methods {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.location-search {
  display: flex;
  gap: 12px;
}
</style>
