<template>
  <div class="smart-filters">
    <!-- Mobile Filter Trigger -->
    <button 
      v-if="isMobile"
      @click="toggleFilters"
      class="mobile-filter-trigger"
    >
      <i class="fas fa-sliders-h"></i>
      <span>Filters</span>
      <span v-if="activeFiltersCount" class="filter-count">{{ activeFiltersCount }}</span>
    </button>

    <!-- Filter Overlay (Mobile) -->
    <div 
      v-if="isMobile && showFilters"
      class="filter-overlay"
      @click="closeFilters"
    ></div>

    <!-- Filter Panel -->
    <div 
      :class="[
        'filter-panel',
        { 
          'mobile-drawer': isMobile,
          'open': showFilters || !isMobile,
          'closed': !showFilters && isMobile
        }
      ]"
    >
      <!-- Filter Header -->
      <div class="filter-header">
        <h3 class="filter-title">
          <i class="fas fa-filter"></i>
          Smart Filters
        </h3>
        <p class="filter-prompt">Refine your search by brand, price, concerns, skin & hair type, ingredients, offers, and customer ratings.</p>
        <div class="filter-actions">
          <button @click="clearAllFilters" class="clear-all-btn">
            Clear All
          </button>
          <button 
            v-if="isMobile"
            @click="closeFilters"
            class="close-filters-btn"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Active Filters Summary -->
      <div v-if="activeFiltersCount" class="active-filters-summary">
        <h4>Active Filters ({{ activeFiltersCount }})</h4>
        <div class="active-filter-tags">
          <span 
            v-for="filter in activeFiltersList" 
            :key="filter.key"
            class="filter-tag"
            @click="removeFilter(filter.key, filter.value)"
          >
            {{ filter.label }}
            <i class="fas fa-times"></i>
          </span>
        </div>
      </div>

      <!-- Filter Sections -->
      <div class="filter-sections">
        <!-- Brand Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('brand')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-star"></i>
              <span>Brand</span>
            </div>
            <i :class="['fas', openSections.brand ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.brand" class="section-content">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                v-model="brandSearch"
                type="text"
                placeholder="Search brands..."
                class="search-input"
              >
            </div>
            <div class="checkbox-list">
              <label 
                v-for="brand in filteredBrands" 
                :key="brand.id"
                class="checkbox-item"
              >
                <input 
                  type="checkbox"
                  :value="brand.name"
                  v-model="filters.brands"
                  @change="updateFilters"
                >
                <span class="checkmark"></span>
                <span class="label-text">{{ brand.name }}</span>
                <span class="item-count">({{ brand.count }})</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('price')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-dollar-sign"></i>
              <span>Price Range</span>
            </div>
            <i :class="['fas', openSections.price ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.price" class="section-content">
            <div class="price-inputs">
              <div class="price-input-group">
                <label>Min Price</label>
                <input 
                  type="number"
                  v-model="filters.priceRange[0]"
                  @input="updateFilters"
                  class="price-input"
                  placeholder="$0"
                >
              </div>
              <span class="price-separator">to</span>
              <div class="price-input-group">
                <label>Max Price</label>
                <input 
                  type="number"
                  v-model="filters.priceRange[1]"
                  @input="updateFilters"
                  class="price-input"
                  placeholder="$500"
                >
              </div>
            </div>
            <div class="price-slider">
              <input 
                type="range"
                :min="priceRange.min"
                :max="priceRange.max"
                v-model="filters.priceRange[0]"
                @input="updateFilters"
                class="range-input range-min"
              >
              <input 
                type="range"
                :min="priceRange.min"
                :max="priceRange.max"
                v-model="filters.priceRange[1]"
                @input="updateFilters"
                class="range-input range-max"
              >
            </div>
            <div class="price-presets">
              <button 
                v-for="preset in pricePresets" 
                :key="preset.label"
                @click="setPriceRange(preset.min, preset.max)"
                class="preset-btn"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Skin Concern Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('concern')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-leaf"></i>
              <span>Skin Concern</span>
            </div>
            <i :class="['fas', openSections.concern ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.concern" class="section-content">
            <div class="pill-list">
              <button 
                v-for="concern in skinConcerns" 
                :key="concern.id"
                @click="toggleFilter('concerns', concern.name)"
                :class="['pill-item', { active: filters.concerns.includes(concern.name) }]"
              >
                <i :class="concern.icon"></i>
                <span>{{ concern.name }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Skin Type Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('skinType')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-user"></i>
              <span>Skin Type</span>
            </div>
            <i :class="['fas', openSections.skinType ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.skinType" class="section-content">
            <div class="radio-list">
              <label 
                v-for="type in skinTypes" 
                :key="type.id"
                class="radio-item"
              >
                <input 
                  type="radio"
                  :value="type.name"
                  v-model="filters.skinType"
                  @change="updateFilters"
                >
                <span class="radio-mark"></span>
                <div class="radio-content">
                  <span class="radio-label">{{ type.name }}</span>
                  <span class="radio-description">{{ type.description }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Hair Type Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('hairType')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-cut"></i>
              <span>Hair Type</span>
            </div>
            <i :class="['fas', openSections.hairType ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.hairType" class="section-content">
            <div class="toggle-list">
              <button 
                v-for="type in hairTypes" 
                :key="type.id"
                @click="toggleFilter('hairTypes', type.name)"
                :class="['toggle-item', { active: filters.hairTypes.includes(type.name) }]"
              >
                <i :class="type.icon"></i>
                <span>{{ type.name }}</span>
                <div v-if="filters.hairTypes.includes(type.name)" class="check-icon">
                  <i class="fas fa-check"></i>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Ingredients Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('ingredients')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-flask"></i>
              <span>Key Ingredients</span>
            </div>
            <i :class="['fas', openSections.ingredients ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.ingredients" class="section-content">
            <div class="ingredient-tags">
              <button 
                v-for="ingredient in keyIngredients" 
                :key="ingredient.id"
                @click="toggleFilter('ingredients', ingredient.name)"
                :class="['ingredient-tag', { active: filters.ingredients.includes(ingredient.name) }]"
              >
                {{ ingredient.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Offers Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('offers')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-tag"></i>
              <span>Offers & Deals</span>
            </div>
            <i :class="['fas', openSections.offers ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.offers" class="section-content">
            <div class="checkbox-list">
              <label 
                v-for="offer in offerTypes" 
                :key="offer.id"
                class="checkbox-item special"
              >
                <input 
                  type="checkbox"
                  :value="offer.value"
                  v-model="filters.offers"
                  @change="updateFilters"
                >
                <span class="checkmark"></span>
                <div class="offer-content">
                  <i :class="offer.icon"></i>
                  <span class="label-text">{{ offer.label }}</span>
                  <span class="offer-description">{{ offer.description }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Ratings Filter -->
        <div class="filter-section">
          <button 
            @click="toggleSection('rating')"
            class="section-header"
          >
            <div class="section-info">
              <i class="fas fa-star"></i>
              <span>Customer Rating</span>
            </div>
            <i :class="['fas', openSections.rating ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
          </button>
          <div v-show="openSections.rating" class="section-content">
            <div class="rating-list">
              <button 
                v-for="rating in ratingOptions" 
                :key="rating.value"
                @click="setRating(rating.value)"
                :class="['rating-item', { active: filters.minRating === rating.value }]"
              >
                <div class="stars">
                  <i 
                    v-for="star in 5" 
                    :key="star"
                    :class="['fas fa-star', { active: star <= rating.value }]"
                  ></i>
                </div>
                <span class="rating-text">{{ rating.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Apply Button -->
      <div v-if="isMobile" class="mobile-filter-actions">
        <button @click="clearAllFilters" class="mobile-clear-btn">
          Clear All
        </button>
        <button @click="applyFilters" class="mobile-apply-btn">
          Apply Filters ({{ totalProducts }})
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmartFilters',
  props: {
    totalProducts: {
      type: Number,
      default: 0
    },
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFilters: false,
      brandSearch: '',
      filters: {
        brands: [],
        priceRange: [0, 500],
        concerns: [],
        skinType: '',
        hairTypes: [],
        ingredients: [],
        offers: [],
        minRating: 0
      },
      openSections: {
        brand: false,
        price: false,
        concern: false,
        skinType: false,
        hairType: false,
        ingredients: false,
        offers: false,
        rating: false
      },
      priceRange: {
        min: 0,
        max: 500
      },
      brands: [
        { id: 1, name: 'The Ordinary', count: 45 },
        { id: 2, name: 'CeraVe', count: 32 },
        { id: 3, name: 'Neutrogena', count: 28 },
        { id: 4, name: 'L\'Oréal', count: 56 },
        { id: 5, name: 'Olay', count: 34 },
        { id: 6, name: 'Clinique', count: 29 },
        { id: 7, name: 'Estée Lauder', count: 41 },
        { id: 8, name: 'MAC', count: 67 }
      ],
      pricePresets: [
        { label: 'Under $25', min: 0, max: 25 },
        { label: '$25 - $50', min: 25, max: 50 },
        { label: '$50 - $100', min: 50, max: 100 },
        { label: '$100+', min: 100, max: 500 }
      ],
      skinConcerns: [
        { id: 1, name: 'Acne', icon: 'fas fa-dot-circle' },
        { id: 2, name: 'Dark Spots', icon: 'fas fa-circle' },
        { id: 3, name: 'Fine Lines', icon: 'fas fa-wave-square' },
        { id: 4, name: 'Dryness', icon: 'fas fa-tint' },
        { id: 5, name: 'Oiliness', icon: 'fas fa-sun' },
        { id: 6, name: 'Sensitivity', icon: 'fas fa-feather' },
        { id: 7, name: 'Pores', icon: 'fas fa-th' },
        { id: 8, name: 'Dullness', icon: 'fas fa-moon' }
      ],
      skinTypes: [
        { id: 1, name: 'Oily', description: 'Excess oil production' },
        { id: 2, name: 'Dry', description: 'Lacks moisture' },
        { id: 3, name: 'Combination', description: 'Mixed oily and dry areas' },
        { id: 4, name: 'Sensitive', description: 'Easily irritated' },
        { id: 5, name: 'Normal', description: 'Well-balanced' }
      ],
      hairTypes: [
        { id: 1, name: 'Straight', icon: 'fas fa-minus' },
        { id: 2, name: 'Wavy', icon: 'fas fa-wave-square' },
        { id: 3, name: 'Curly', icon: 'fas fa-circle' },
        { id: 4, name: 'Coily', icon: 'fas fa-dot-circle' }
      ],
      keyIngredients: [
        { id: 1, name: 'Hyaluronic Acid' },
        { id: 2, name: 'Vitamin C' },
        { id: 3, name: 'Retinol' },
        { id: 4, name: 'Niacinamide' },
        { id: 5, name: 'Salicylic Acid' },
        { id: 6, name: 'Glycolic Acid' },
        { id: 7, name: 'Peptides' },
        { id: 8, name: 'Ceramides' }
      ],
      offerTypes: [
        {
          id: 1,
          value: 'sale',
          label: 'On Sale',
          description: 'Discounted items',
          icon: 'fas fa-percentage'
        },
        {
          id: 2,
          value: 'new',
          label: 'New Arrivals',
          description: 'Latest products',
          icon: 'fas fa-sparkles'
        },
        {
          id: 3,
          value: 'bundle',
          label: 'Bundle Deals',
          description: 'Save on sets',
          icon: 'fas fa-boxes'
        },
        {
          id: 4,
          value: 'free-shipping',
          label: 'Free Shipping',
          description: 'No delivery cost',
          icon: 'fas fa-shipping-fast'
        }
      ],
      ratingOptions: [
        { value: 4, label: '4+ Stars' },
        { value: 3, label: '3+ Stars' },
        { value: 2, label: '2+ Stars' },
        { value: 1, label: '1+ Stars' }
      ]
    };
  },
  computed: {
    filteredBrands() {
      if (!this.brandSearch) return this.brands;
      return this.brands.filter(brand =>
        brand.name.toLowerCase().includes(this.brandSearch.toLowerCase())
      );
    },
    activeFiltersCount() {
      let count = 0;
      if (this.filters.brands.length) count += this.filters.brands.length;
      if (this.filters.priceRange[0] > 0 || this.filters.priceRange[1] < 500) count += 1;
      if (this.filters.concerns.length) count += this.filters.concerns.length;
      if (this.filters.skinType) count += 1;
      if (this.filters.hairTypes.length) count += this.filters.hairTypes.length;
      if (this.filters.ingredients.length) count += this.filters.ingredients.length;
      if (this.filters.offers.length) count += this.filters.offers.length;
      if (this.filters.minRating > 0) count += 1;
      return count;
    },
    activeFiltersList() {
      const list = [];
      
      this.filters.brands.forEach(brand => {
        list.push({ key: 'brands', value: brand, label: brand });
      });
      
      if (this.filters.priceRange[0] > 0 || this.filters.priceRange[1] < 500) {
        list.push({
          key: 'priceRange',
          value: this.filters.priceRange,
          label: `$${this.filters.priceRange[0]} - $${this.filters.priceRange[1]}`
        });
      }
      
      this.filters.concerns.forEach(concern => {
        list.push({ key: 'concerns', value: concern, label: concern });
      });
      
      if (this.filters.skinType) {
        list.push({ key: 'skinType', value: this.filters.skinType, label: this.filters.skinType });
      }
      
      return list;
    }
  },
  methods: {
    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    closeFilters() {
      this.showFilters = false;
    },
    toggleSection(section) {
      this.openSections[section] = !this.openSections[section];
    },
    updateFilters() {
      this.$emit('filters-changed', this.filters);
    },
    toggleFilter(filterType, value) {
      if (this.filters[filterType].includes(value)) {
        this.filters[filterType] = this.filters[filterType].filter(item => item !== value);
      } else {
        this.filters[filterType].push(value);
      }
      this.updateFilters();
    },
    removeFilter(key, value) {
      if (key === 'brands') {
        this.filters.brands = this.filters.brands.filter(brand => brand !== value);
      } else if (key === 'priceRange') {
        this.filters.priceRange = [0, 500];
      } else if (key === 'concerns') {
        this.filters.concerns = this.filters.concerns.filter(concern => concern !== value);
      } else if (key === 'skinType') {
        this.filters.skinType = '';
      }
      this.updateFilters();
    },
    setPriceRange(min, max) {
      this.filters.priceRange = [min, max];
      this.updateFilters();
    },
    setRating(value) {
      this.filters.minRating = this.filters.minRating === value ? 0 : value;
      this.updateFilters();
    },
    clearAllFilters() {
      this.filters = {
        brands: [],
        priceRange: [0, 500],
        concerns: [],
        skinType: '',
        hairTypes: [],
        ingredients: [],
        offers: [],
        minRating: 0
      };
      this.updateFilters();
    },
    applyFilters() {
      this.updateFilters();
      this.closeFilters();
    }
  }
};
</script>

<style scoped>
.smart-filters {
  position: relative;
}

.mobile-filter-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  width: 100%;
  justify-content: center;
  position: relative;
}

.mobile-filter-trigger:hover {
  border-color: var(--primary-400);
  background: var(--primary-50);
}

.filter-count {
  background: var(--primary-500);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  top: -8px;
  right: -8px;
}

.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  backdrop-filter: blur(4px);
}

.filter-panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.filter-panel:not(.mobile-drawer) {
  border: 1px solid var(--gray-200);
  position: sticky;
  top: 180px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: 90%;
  max-width: 400px;
  z-index: 999;
  transform: translateX(100%);
  border-radius: 0;
}

.mobile-drawer.open {
  transform: translateX(0);
}

.filter-header {
  background: white;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-title i {
  display: none;
}

.filter-prompt {
  display: none;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clear-all-btn {
  background: none;
  border: none;
  color: var(--primary-600);
  padding: 0;
  border-radius: 0;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: underline;
}


.clear-all-btn:hover {
  color: var(--primary-700);
}

.close-filters-btn {
  background: var(--gray-100);
  border: none;
  color: var(--gray-600);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-filters-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.active-filters-summary {
  padding: 16px 24px;
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
}

.active-filters-summary h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-700);
  margin: 0 0 12px;
}

.active-filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 4px 8px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
}

.filter-tag:hover {
  background: var(--primary-200);
}

.filter-tag i {
  font-size: 10px;
}

.filter-sections {
  max-height: 60vh;
  overflow-y: auto;
}

.filter-section {
  border-bottom: 1px solid var(--gray-200);
}

.section-header {
  width: 100%;
  background: none;
  border: none;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
}

.section-header:hover {
  background: var(--gray-50);
}

.section-header i.fa-chevron-down,
.section-header i.fa-chevron-up {
  color: var(--gray-400);
  font-size: 12px;
  transition: transform 0.2s ease;
}

.section-header i.fa-chevron-down {
  transform: rotate(0deg);
}

.section-header i.fa-chevron-up {
  transform: rotate(180deg);
}

.section-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  color: var(--gray-800);
  font-size: 14px;
}

.section-info i {
  color: var(--gray-500);
  width: 16px;
  text-align: center;
  font-size: 12px;
}

.section-content {
  padding: 0 24px 20px;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.search-box {
  position: relative;
  margin-bottom: 16px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-400);
  font-size: 14px;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid var(--gray-300);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-400);
}

.checkbox-list,
.radio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.checkbox-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 0;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover,
.radio-item:hover {
  background: var(--gray-50);
}

.checkbox-item input,
.radio-item input {
  display: none;
}

.checkmark,
.radio-mark {
  width: 16px;
  height: 16px;
  border: 1px solid var(--gray-300);
  border-radius: 3px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
  background: white;
}

.radio-mark {
  border-radius: 50%;
}

.checkbox-item input:checked + .checkmark,
.radio-item input:checked + .radio-mark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.checkbox-item input:checked + .checkmark::after {
  content: '\2713';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.radio-item input:checked + .radio-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
}

.label-text {
  font-weight: 400;
  color: var(--gray-700);
  flex: 1;
  font-size: 14px;
}

.item-count {
  font-size: 12px;
  color: var(--gray-400);
  font-weight: 400;
}

.radio-content {
  flex: 1;
}

.radio-label {
  display: block;
  font-weight: 500;
  color: var(--gray-700);
  margin-bottom: 2px;
}

.radio-description {
  font-size: 12px;
  color: var(--gray-500);
}

.checkbox-item.special {
  align-items: flex-start;
  padding: 12px 8px;
}

.offer-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.offer-content i {
  color: var(--primary-500);
  margin-top: 2px;
}

.offer-description {
  font-size: 12px;
  color: var(--gray-500);
  margin-top: 2px;
}

.price-inputs {
  display: flex;
  align-items: end;
  gap: 12px;
  margin-bottom: 20px;
}

.price-input-group {
  flex: 1;
}

.price-input-group label {
  display: block;
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 4px;
  font-weight: 500;
}

.price-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  font-size: 14px;
}

.price-separator {
  color: var(--gray-500);
  margin: 0 4px;
  margin-bottom: 8px;
}

.price-slider {
  position: relative;
  height: 6px;
  background: var(--gray-200);
  border-radius: 3px;
  margin-bottom: 20px;
}

.range-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  background: transparent;
  pointer-events: none;
  -webkit-appearance: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: var(--primary-500);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  pointer-events: auto;
}

.price-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preset-btn {
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  color: var(--gray-700);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.preset-btn:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  color: var(--primary-700);
}

.pill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.pill-item {
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  color: var(--gray-700);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
}

.pill-item:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  color: var(--primary-700);
}

.pill-item.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.toggle-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.toggle-item {
  background: var(--gray-50);
  border: 2px solid var(--gray-200);
  color: var(--gray-700);
  padding: 16px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  font-weight: 500;
}

.toggle-item:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.toggle-item.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-500);
  font-size: 10px;
}

.ingredient-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ingredient-tag {
  background: var(--gray-100);
  border: 1px solid var(--gray-200);
  color: var(--gray-700);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.ingredient-tag:hover {
  background: var(--primary-100);
  border-color: var(--primary-300);
  color: var(--primary-700);
}

.ingredient-tag.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.rating-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.rating-item {
  background: none;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.rating-item:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.rating-item.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars i {
  font-size: 14px;
  color: var(--gray-300);
}

.stars i.active {
  color: var(--warning-500);
}

.rating-item.active .stars i.active {
  color: white;
}

.rating-text {
  font-weight: 500;
}

.mobile-filter-actions {
  padding: 24px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
  display: flex;
  gap: 12px;
}

.mobile-clear-btn {
  flex: 1;
  background: white;
  border: 1px solid var(--gray-300);
  color: var(--gray-700);
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-apply-btn {
  flex: 2;
  background: var(--primary-500);
  border: none;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-apply-btn:hover {
  background: var(--primary-600);
}

/* Responsive Design */
@media (max-width: 768px) {
  .mobile-drawer {
    width: 100%;
    max-width: none;
  }

  .filter-sections {
    max-height: calc(100vh - 240px);
  }

  .filter-prompt {
    font-size: 12px;
    margin-top: 6px;
  }

  .filter-header {
    padding: 20px;
  }
}
</style>
