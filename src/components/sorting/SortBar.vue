<template>
  <div class="sort-bar">
    <div class="sort-container">
      <!-- Results Info -->
      <div class="results-info">
        <span v-if="activeFilters" class="active-filters-info">
          <strong>{{ activeFilters }}</strong> {{ activeFilters === 1 ? 'filter' : 'filters' }} active
        </span>
      </div>

      <!-- Sort Options -->
      <div class="sort-options">
        <label class="sort-label">Sort by:</label>
        <div class="sort-dropdown-wrapper">
          <button 
            @click="toggleDropdown"
            class="sort-dropdown-trigger"
            :class="{ active: showDropdown }"
          >
            <span class="sort-text">{{ currentSortLabel }}</span>
            <i :class="['fas fa-chevron-down', { rotated: showDropdown }]"></i>
          </button>
          
          <div v-if="showDropdown" class="sort-dropdown-menu">
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option)"
              :class="['sort-option', { active: currentSort === option.value }]"
            >
              <div class="option-content">
                <i :class="option.icon"></i>
                <div class="option-text">
                  <span class="option-label">{{ option.label }}</span>
                  <span class="option-description">{{ option.description }}</span>
                </div>
              </div>
              <i v-if="currentSort === option.value" class="fas fa-check option-check"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- View Toggle -->
      <div class="view-toggle">
        <button
          @click="changeView('grid')"
          :class="['view-btn', { active: currentView === 'grid' }]"
          title="Grid View"
        >
          <i class="fas fa-th-large"></i>
        </button>
        <button
          @click="changeView('list')"
          :class="['view-btn', { active: currentView === 'list' }]"
          title="List View"
        >
          <i class="fas fa-list"></i>
        </button>
      </div>
    </div>

    <!-- Quick Filters (Mobile) -->
    <div v-if="isMobile" class="quick-filters">
      <button
        v-for="filter in quickFilters"
        :key="filter.key"
        @click="applyQuickFilter(filter)"
        :class="['quick-filter-btn', { active: isQuickFilterActive(filter) }]"
      >
        <i :class="filter.icon"></i>
        <span>{{ filter.label }}</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortBar',
  props: {
    totalResults: {
      type: Number,
      default: 0
    },
    activeFilters: {
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
      showDropdown: false,
      currentSort: 'price-low-high',
      currentView: 'grid',
      sortOptions: [
        {
          value: 'relevance',
          label: 'Relevance',
          description: 'Most relevant results first',
          icon: 'fas fa-star'
        },
        {
          value: 'price-low-high',
          label: 'Price: Low to High',
          description: 'Lowest prices first',
          icon: 'fas fa-sort-amount-down'
        },
        {
          value: 'price-high-low',
          label: 'Price: High to Low',
          description: 'Highest prices first',
          icon: 'fas fa-sort-amount-up'
        },
        {
          value: 'popularity',
          label: 'Popularity',
          description: 'Most popular products first',
          icon: 'fas fa-fire'
        },
        {
          value: 'newest',
          label: 'Newest First',
          description: 'Latest arrivals first',
          icon: 'fas fa-clock'
        },
        {
          value: 'rating',
          label: 'Customer Rating',
          description: 'Highest rated products first',
          icon: 'fas fa-star'
        },
        {
          value: 'reviews',
          label: 'Most Reviewed',
          description: 'Products with most reviews first',
          icon: 'fas fa-comments'
        },
        {
          value: 'discount',
          label: 'Biggest Savings',
          description: 'Highest discounts first',
          icon: 'fas fa-percentage'
        }
      ],
      quickFilters: [
        {
          key: 'sale',
          label: 'On Sale',
          icon: 'fas fa-tag'
        },
        {
          key: 'new',
          label: 'New',
          icon: 'fas fa-sparkles'
        },
        {
          key: 'top-rated',
          label: 'Top Rated',
          icon: 'fas fa-star'
        },
        {
          key: 'free-shipping',
          label: 'Free Shipping',
          icon: 'fas fa-shipping-fast'
        }
      ],
      activeQuickFilters: []
    };
  },
  computed: {
    currentSortLabel() {
      const option = this.sortOptions.find(opt => opt.value === this.currentSort);
      return option ? option.label : 'Relevance';
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    selectSort(option) {
      this.currentSort = option.value;
      this.showDropdown = false;
      this.$emit('sort-changed', option.value);
    },
    changeView(view) {
      this.currentView = view;
      this.$emit('view-changed', view);
    },
    applyQuickFilter(filter) {
      if (this.isQuickFilterActive(filter)) {
        this.activeQuickFilters = this.activeQuickFilters.filter(f => f.key !== filter.key);
      } else {
        this.activeQuickFilters.push(filter);
      }
      this.$emit('quick-filter-changed', this.activeQuickFilters);
    },
    isQuickFilterActive(filter) {
      return this.activeQuickFilters.some(f => f.key === filter.key);
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.$el.contains(e.target)) {
        this.showDropdown = false;
      }
    });
  }
};
</script>

<style scoped>
.sort-bar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--gray-200);
  margin-bottom: 24px;
  overflow: hidden;
}

.sort-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  gap: 20px;
}

.results-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.results-count {
  color: var(--gray-800);
  font-size: 14px;
}

.active-filters-info {
  color: var(--gray-600);
  font-size: 13px;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sort-label {
  color: var(--gray-600);
  font-size: 14px;
  font-weight: 500;
}

.sort-prompt {
  font-size: 12px;
  color: var(--gray-500);
  font-weight: 400;
  margin-left: 8px;
  font-style: italic;
}

.sort-dropdown-wrapper {
  position: relative;
}

.sort-dropdown-trigger {
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 160px;
  justify-content: space-between;
}

.sort-dropdown-trigger:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.sort-dropdown-trigger.active {
  border-color: var(--primary-400);
  background: var(--primary-50);
}

.sort-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
}

.sort-dropdown-trigger i {
  color: var(--gray-400);
  font-size: 12px;
  transition: transform 0.2s ease;
}

.sort-dropdown-trigger i.rotated {
  transform: rotate(180deg);
}

.sort-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 100;
  min-width: 280px;
  margin-top: 4px;
  overflow: hidden;
  animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sort-option {
  width: 100%;
  background: none;
  border: none;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-100);
}

.sort-option:last-child {
  border-bottom: none;
}

.sort-option:hover {
  background: var(--gray-50);
}

.sort-option.active {
  background: var(--primary-50);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.option-content i {
  color: var(--primary-500);
  width: 16px;
  text-align: center;
}

.option-text {
  flex: 1;
}

.option-label {
  display: block;
  font-weight: 500;
  color: var(--gray-800);
  font-size: 14px;
  margin-bottom: 2px;
}

.option-description {
  font-size: 12px;
  color: var(--gray-600);
}

.option-check {
  color: var(--primary-500);
  font-size: 14px;
}

.view-toggle {
  display: flex;
  background: var(--gray-100);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}

.view-btn {
  background: none;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.view-btn:hover {
  color: var(--gray-800);
  background: rgba(255, 255, 255, 0.5);
}

.view-btn.active {
  background: white;
  color: var(--primary-600);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.quick-filters {
  background: var(--gray-50);
  padding: 12px 20px;
  border-top: 1px solid var(--gray-200);
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.quick-filters::-webkit-scrollbar {
  display: none;
}

.quick-filter-btn {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
}

.quick-filter-btn:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
  color: var(--primary-700);
}

.quick-filter-btn.active {
  background: var(--primary-500);
  border-color: var(--primary-500);
  color: white;
}

.quick-filter-btn i {
  font-size: 11px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .sort-container {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .results-info {
    order: 1;
    flex: 1 1 100%;
  }
  
  .sort-options {
    order: 2;
    flex: 1;
  }
  
  .view-toggle {
    order: 3;
  }
}

@media (max-width: 768px) {
  .sort-container {
    padding: 12px 16px;
  }
  
  .sort-dropdown-trigger {
    min-width: 140px;
    padding: 6px 12px;
  }
  
  .sort-dropdown-menu {
    min-width: 260px;
    right: -20px;
  }
  
  .view-toggle {
    display: none;
  }
  
  .sort-label,
  .sort-prompt {
    display: none;
  }
}

@media (max-width: 480px) {
  .sort-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .results-info {
    text-align: center;
  }
  
  .sort-options {
    justify-content: center;
  }
  
  .sort-dropdown-trigger {
    min-width: auto;
    width: 100%;
    max-width: 200px;
    margin: 0 auto;
  }
  
  .quick-filters {
    padding: 8px 16px;
  }
}

/* Focus styles for accessibility */
.sort-dropdown-trigger:focus-visible,
.view-btn:focus-visible,
.quick-filter-btn:focus-visible {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
</style>
