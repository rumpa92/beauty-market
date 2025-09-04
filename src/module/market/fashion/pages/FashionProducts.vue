<template>
  <div class="fashion-products">
    <div class="market-container">
      <div class="products-header">
        <h1 class="market-title-lg">{{ pageTitle }}</h1>
        <p class="market-text-light">{{ filteredProducts.length }} products found</p>
      </div>
      
      <div class="products-content">
        <!-- Filters Sidebar -->
        <div class="filters-sidebar">
          <div class="filter-section">
            <h3>Filters</h3>
            <p>Smart filters will be managed by existing store logic</p>
          </div>
        </div>
        
        <!-- Products Grid -->
        <div class="products-main">
          <div class="products-controls">
            <div class="view-controls">
              <button @click="view = 'grid'" :class="{ active: view === 'grid' }">
                <i class="fas fa-th"></i>
              </button>
              <button @click="view = 'list'" :class="{ active: view === 'list' }">
                <i class="fas fa-list"></i>
              </button>
            </div>
            <select v-model="sortBy" class="sort-select">
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
          
          <div class="products-grid" :class="view">
            <FashionProductCard 
              v-for="product in displayedProducts" 
              :key="product.id"
              :product="product"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FashionProductCard from '../components/FashionProductCard.vue';

export default {
  name: 'FashionProducts',
  components: {
    FashionProductCard
  },
  props: {
    category: String
  },
  data() {
    return {
      view: 'grid',
      sortBy: 'relevance'
    };
  },
  computed: {
    ...mapGetters('products', ['filteredProducts']),
    pageTitle() {
      return this.category ? `${this.category} Fashion` : 'All Fashion Products';
    },
    displayedProducts() {
      // Products will be managed by existing store logic
      return this.filteredProducts.slice(0, 12);
    }
  }
};
</script>

<style scoped>
.fashion-products {
  padding: 40px 0;
}

.products-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
  margin-top: 32px;
}

.filters-sidebar {
  background: var(--market-surface);
  padding: 24px;
  border-radius: 12px;
  height: fit-content;
  border: 1px solid var(--market-border);
}

.products-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.view-controls {
  display: flex;
  gap: 8px;
}

.view-controls button {
  padding: 8px 12px;
  border: 1px solid var(--market-border);
  background: var(--market-surface);
  border-radius: 6px;
  cursor: pointer;
}

.view-controls button.active {
  background: var(--market-primary);
  color: white;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid var(--market-border);
  border-radius: 6px;
  background: var(--market-surface);
}

.products-grid {
  display: grid;
  gap: 24px;
}

.products-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.products-grid.list {
  grid-template-columns: 1fr;
}

@media (max-width: 1024px) {
  .products-content {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    order: 2;
  }
}
</style>
