<template>
  <div class="recently-viewed-carousel" v-if="recentlyViewed.length > 0">
    <div class="carousel-header">
      <h2>Recently Viewed</h2>
      <button @click="clearHistory" class="clear-btn">
        Clear History
      </button>
    </div>

    <div class="carousel-container">
      <div class="products-scroll">
        <ProductCard 
          v-for="product in recentlyViewed" 
          :key="product.id"
          :product="product"
          class="carousel-product"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductCard from './ProductCard.vue';

export default {
  name: 'RecentlyViewedCarousel',
  components: {
    ProductCard
  },
  computed: {
    ...mapGetters('user', ['recentlyViewedItems']),
    recentlyViewed() {
      return this.recentlyViewedItems.slice(0, 6);
    }
  },
  methods: {
    ...mapActions('user', ['clearRecentlyViewed']),
    clearHistory() {
      this.clearRecentlyViewed();
    }
  }
};
</script>

<style scoped>
.recently-viewed-carousel {
  padding: 40px 0;
  border-top: 1px solid var(--gray-200);
}

.carousel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.carousel-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
}

.clear-btn {
  background: none;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  padding: 8px 16px;
  color: var(--gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.clear-btn:hover {
  border-color: var(--error-400);
  color: var(--error-600);
}

.carousel-container {
  overflow: hidden;
}

.products-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 8px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.products-scroll::-webkit-scrollbar {
  display: none;
}

.carousel-product {
  flex-shrink: 0;
  width: 280px;
}
</style>
