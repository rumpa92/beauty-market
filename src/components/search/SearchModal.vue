<template>
  <transition name="fade">
    <div v-if="isSearchOpen" class="search-overlay" @click="closeSearch">
      <div class="search-modal" @click.stop>
        <div class="search-header">
          <div class="search-input-container">
            <i class="fas fa-search search-icon"></i>
            <input 
              ref="searchInput"
              type="text" 
              placeholder="Search products, brands..."
              class="search-input"
              v-model="searchQuery"
              @input="handleSearch"
              @keyup.enter="performSearch"
            >
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <button class="close-btn" @click="closeSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="search-content">
          <!-- Search Results -->
          <div v-if="searchQuery && searchResults.length > 0" class="search-results">
            <h3 class="results-title">Search Results</h3>
            <div class="results-list">
              <div 
                v-for="product in searchResults.slice(0, 6)" 
                :key="product.id"
                class="result-item"
                @click="selectProduct(product)"
              >
                <div class="result-image">
                  <img :src="product.image" :alt="product.name">
                </div>
                <div class="result-details">
                  <h4 class="result-name">{{ product.name }}</h4>
                  <p class="result-brand">{{ product.brand }}</p>
                  <div class="result-price">${{ product.price.toFixed(2) }}</div>
                </div>
              </div>
            </div>
            <div v-if="searchResults.length > 6" class="view-all">
              <button @click="viewAllResults" class="btn btn-outline">
                View All {{ searchResults.length }} Results
              </button>
            </div>
          </div>

          <!-- No Results -->
          <div v-else-if="searchQuery && searchResults.length === 0" class="no-results">
            <i class="fas fa-search no-results-icon"></i>
            <h3>No results found</h3>
            <p>Try searching for something else</p>
          </div>

          <!-- Default Content -->
          <div v-else class="search-suggestions">
            <div class="popular-searches">
              <h3 class="suggestions-title">Popular Searches</h3>
              <div class="suggestion-tags">
                <button 
                  v-for="tag in popularSearches" 
                  :key="tag"
                  class="suggestion-tag"
                  @click="searchTag(tag)"
                >
                  {{ tag }}
                </button>
              </div>
            </div>

            <div class="trending-products">
              <h3 class="suggestions-title">Trending Now</h3>
              <div class="trending-list">
                <div 
                  v-for="product in featuredProducts.slice(0, 4)" 
                  :key="product.id"
                  class="trending-item"
                  @click="selectProduct(product)"
                >
                  <div class="trending-image">
                    <img :src="product.image" :alt="product.name">
                  </div>
                  <div class="trending-details">
                    <h4 class="trending-name">{{ product.name }}</h4>
                    <p class="trending-brand">{{ product.brand }}</p>
                    <div class="trending-price">${{ product.price.toFixed(2) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'SearchModal',
  data() {
    return {
      searchQuery: '',
      popularSearches: [
        'Face Cream', 'Lipstick', 'Serum', 'Foundation', 
        'Moisturizer', 'Mascara', 'Cleanser', 'Sunscreen'
      ]
    };
  },
  computed: {
    ...mapGetters('ui', ['isSearchOpen']),
    ...mapGetters('products', ['featuredProducts']),
    searchResults() {
      if (!this.searchQuery) return [];
      
      const query = this.searchQuery.toLowerCase();
      return this.$store.getters['products/allProducts'].filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category && product.category.toLowerCase().includes(query))
      );
    }
  },
  watch: {
    isSearchOpen(isOpen) {
      if (isOpen) {
        this.$nextTick(() => {
          this.$refs.searchInput?.focus();
        });
      } else {
        this.searchQuery = '';
      }
    }
  },
  methods: {
    ...mapActions('ui', ['closeSearch']),
    ...mapActions('products', ['searchProducts']),
    handleSearch() {
      // Real-time search is handled by computed property
    },
    performSearch() {
      if (this.searchQuery.trim()) {
        this.searchProducts(this.searchQuery);
        this.$router.push('/products');
        this.closeSearch();
      }
    },
    clearSearch() {
      this.searchQuery = '';
    },
    searchTag(tag) {
      this.searchQuery = tag;
      this.performSearch();
    },
    selectProduct(product) {
      this.$router.push(`/product/${product.id}`);
      this.closeSearch();
    },
    viewAllResults() {
      this.searchProducts(this.searchQuery);
      this.$router.push('/products');
      this.closeSearch();
    }
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  backdrop-filter: blur(2px);
  padding: 20px;
}

.search-modal {
  max-width: 700px;
  margin: 60px auto 0;
  background: white;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  max-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.search-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.search-input-container {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  color: var(--gray-400);
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 16px 48px 16px 48px;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  font-size: 18px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-500);
}

.clear-btn {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s ease;
}

.clear-btn:hover {
  color: var(--gray-600);
}

.close-btn {
  background: none;
  border: none;
  padding: 12px;
  cursor: pointer;
  color: var(--gray-500);
  font-size: 18px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-700);
}

.search-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.search-results, .search-suggestions {
  max-height: 400px;
  overflow-y: auto;
}

.results-title, .suggestions-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--gray-800);
}

.results-list, .trending-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item, .trending-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.result-item:hover, .trending-item:hover {
  background: var(--gray-50);
}

.result-image, .trending-image {
  width: 50px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.result-image img, .trending-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-details, .trending-details {
  flex: 1;
  min-width: 0;
}

.result-name, .trending-name {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  color: var(--gray-800);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-brand, .trending-brand {
  font-size: 12px;
  color: var(--gray-500);
  margin-bottom: 4px;
}

.result-price, .trending-price {
  font-weight: 600;
  color: var(--primary-600);
  font-size: 14px;
}

.view-all {
  margin-top: 16px;
  text-align: center;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
}

.no-results-icon {
  font-size: 48px;
  color: var(--gray-300);
  margin-bottom: 16px;
}

.no-results h3 {
  margin-bottom: 8px;
  color: var(--gray-700);
}

.no-results p {
  color: var(--gray-500);
}

.popular-searches {
  margin-bottom: 32px;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggestion-tag {
  background: var(--gray-100);
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s ease;
}

.suggestion-tag:hover {
  background: var(--primary-100);
  color: var(--primary-700);
}

@media (max-width: 768px) {
  .search-overlay {
    padding: 16px;
  }
  
  .search-modal {
    margin: 40px auto 0;
    max-height: calc(100vh - 80px);
  }
  
  .search-header {
    padding: 20px 16px;
  }
  
  .search-content {
    padding: 20px 16px;
  }
  
  .search-input {
    font-size: 16px;
    padding: 14px 40px 14px 40px;
  }
}
</style>
