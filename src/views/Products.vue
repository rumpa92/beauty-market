<template>
  <div class="products-page">
    <PageHeader
      :title="pageTitle"
      :subtitle="products.length ? `${products.length} products found` : 'Loading products...'"
    />
    <div class="market-container">
      <!-- Banner Section -->
      <div v-if="showBanner" class="products-banner" :class="bannerType">
        <div class="banner-content">
          <div class="banner-icon">
            <i :class="bannerIcon"></i>
          </div>
          <div class="banner-text">
            <h1 class="banner-title">{{ bannerTitle }}</h1>
            <p class="banner-subtitle">{{ bannerSubtitle }}</p>
          </div>
        </div>
      </div>

      <div class="products-header">
        <h1 v-if="!showBanner" class="market-title-lg">{{ pageTitle }}</h1>
      </div>
      
      <div class="products-content">
        <!-- Filters Sidebar -->
        <div class="filters-sidebar">
          <SmartFilters 
            :total-products="products.length"
            :is-mobile="isMobile"
            @filters-changed="handleFiltersChanged"
          />
        </div>
        
        <!-- Main Content -->
        <div class="products-main">
          <!-- Sort Bar with prompt -->
          <SortBar 
            :total-results="products.length"
            :active-filters="activeFiltersCount"
            :is-mobile="isMobile"
            @sort-changed="handleSortChanged"
            @view-changed="handleViewChanged"
            @quick-filter-changed="handleQuickFilterChanged"
          />
          
          <!-- Products Grid -->
          <div :class="['products-grid', viewMode]">
            <ProductCard 
              v-for="product in products" 
              :key="product.id"
              :product="product"
              :view-mode="viewMode"
            />
          </div>
          
          <!-- Empty State -->
          <div v-if="products.length === 0" class="empty-state">
            <i class="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your filters or search terms</p>
            <button @click="clearAllFilters" class="market-btn market-btn-primary">
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ProductCard from '../components/product/ProductCard.vue';
import SmartFilters from '../components/filters/SmartFilters.vue';
import SortBar from '../components/sorting/SortBar.vue';
import PageHeader from '../components/ui/PageHeader.vue';

export default {
  name: 'Products',
  components: {
    ProductCard,
    SmartFilters,
    SortBar,
    PageHeader
  },
  props: {
    category: String
  },
  data() {
    return {
      viewMode: 'grid',
      activeFiltersCount: 0,
      isMobile: false
    };
  },
  computed: {
    ...mapGetters('products', ['filteredProducts', 'categories']),
    products() {
      if (this.category) {
        return this.$store.getters['products/productsByCategory'](this.category);
      }
      return this.filteredProducts;
    },
    pageTitle() {
      if (this.$route.query.title) {
        return this.$route.query.title;
      }
      if (this.category) {
        const categoryObj = this.categories.find(cat => cat.id === this.category);
        return categoryObj ? categoryObj.name : 'Products';
      }
      return 'All Products';
    },
    showBanner() {
      return this.$route.query.banner && (this.$route.query.skinType || this.$route.query.hairType);
    },
    bannerType() {
      return this.$route.query.banner;
    },
    bannerTitle() {
      if (this.$route.query.skinType) {
        const skinType = this.$route.query.skinType;
        return `${skinType.charAt(0).toUpperCase() + skinType.slice(1)} Skin Care`;
      }
      if (this.$route.query.hairType) {
        const hairType = this.$route.query.hairType;
        return `${hairType.charAt(0).toUpperCase() + hairType.slice(1)} Hair Care`;
      }
      return 'Beauty Products';
    },
    bannerSubtitle() {
      if (this.$route.query.skinType) {
        return 'Specially curated products for your skin type';
      }
      if (this.$route.query.hairType) {
        return 'Professional hair care solutions for your hair type';
      }
      return 'Discover premium beauty products';
    },
    bannerIcon() {
      if (this.$route.query.banner === 'skin') {
        return 'fas fa-leaf';
      }
      if (this.$route.query.banner === 'hair') {
        return 'fas fa-cut';
      }
      return 'fas fa-sparkles';
    },
    productsDescription() {
      if (this.showBanner) {
        return `Found ${this.products.length} products matching your selection`;
      }
      return 'Discover our curated collection of premium beauty products';
    }
  },
  methods: {
    ...mapActions('products', ['setSortBy', 'clearAllFilters']),
    handleFiltersChanged(filters) {
      // Update active filters count
      this.activeFiltersCount = this.countActiveFilters(filters);
      // Apply filters to store
      this.$store.dispatch('products/applyFilters', filters);
    },
    handleSortChanged(sortValue) {
      this.setSortBy(sortValue);
    },
    handleViewChanged(view) {
      this.viewMode = view;
    },
    handleQuickFilterChanged(quickFilters) {
      // Handle quick filters
      this.$store.dispatch('products/applyQuickFilters', quickFilters);
    },
    countActiveFilters(filters) {
      let count = 0;
      if (filters.brands && filters.brands.length) count += filters.brands.length;
      if (filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 500)) count += 1;
      if (filters.concerns && filters.concerns.length) count += filters.concerns.length;
      if (filters.skinType) count += 1;
      if (filters.hairTypes && filters.hairTypes.length) count += filters.hairTypes.length;
      if (filters.ingredients && filters.ingredients.length) count += filters.ingredients.length;
      if (filters.offers && filters.offers.length) count += filters.offers.length;
      if (filters.minRating > 0) count += 1;
      return count;
    },
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);

    // Apply filters from query parameters
    if (this.$route.query.skinType) {
      this.$store.dispatch('products/setSkinTypeFilter', this.$route.query.skinType);
    }
    if (this.$route.query.hairType) {
      this.$store.dispatch('products/setHairTypeFilter', this.$route.query.hairType);
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  }
};
</script>

<style scoped>
.products-page {
  padding: 40px 0;
  min-height: calc(100vh - 200px);
}

/* Products Banner */
.products-banner {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--purple-50) 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 32px;
  border: 1px solid var(--primary-200);
  position: relative;
  overflow: hidden;
}

.products-banner::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--primary-100) 0%, var(--purple-100) 100%);
  border-radius: 50%;
  transform: translate(50%, -50%);
  opacity: 0.3;
}

.products-banner.skin {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-color: #bbf7d0;
}

.products-banner.skin::before {
  background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
}

.products-banner.hair {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-color: #bfdbfe;
}

.products-banner.hair::before {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 24px;
  position: relative;
  z-index: 2;
}

.banner-icon {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--primary-600);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.products-banner.skin .banner-icon {
  color: #059669;
}

.products-banner.hair .banner-icon {
  color: #2563eb;
}

.banner-text {
  flex: 1;
}

.banner-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.banner-subtitle {
  font-size: 16px;
  color: var(--gray-600);
  margin: 0;
}

.products-header {
  text-align: center;
  margin-bottom: 40px;
}

.products-description {
  color: var(--gray-600);
  font-size: 16px;
  margin-top: 8px;
}

.products-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 32px;
  align-items: start;
}

.filters-sidebar {
  position: sticky;
  top: 20px;
}

.products-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.products-grid {
  display: grid;
  gap: 24px;
  animation: fadeIn 0.3s ease-out;
}

.products-grid.grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.products-grid.list {
  grid-template-columns: 1fr;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--gray-600);
}

.empty-state i {
  font-size: 48px;
  color: var(--gray-400);
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 24px;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.empty-state p {
  margin-bottom: 24px;
  font-size: 16px;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .products-content {
    grid-template-columns: 280px 1fr;
    gap: 24px;
  }
}

@media (max-width: 768px) {
  .products-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .filters-sidebar {
    position: static;
    order: 2;
  }
  
  .products-main {
    order: 1;
  }
  
  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .products-page {
    padding: 20px 0;
  }
  
  .products-header {
    margin-bottom: 24px;
  }
  
  .products-grid.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
}
</style>
