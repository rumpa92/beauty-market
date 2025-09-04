<template>
  <div class="variant-selection-grid">
    <h3>Select Size & Shade</h3>
    
    <!-- Variant Matrix -->
    <div class="variant-matrix">
      <!-- Size Headers -->
      <div class="matrix-header">
        <div class="empty-cell"></div>
        <div 
          v-for="size in availableSizes" 
          :key="size"
          class="size-header"
        >
          {{ size }}
        </div>
      </div>

      <!-- Shade Rows -->
      <div 
        v-for="shade in availableShades" 
        :key="shade"
        class="shade-row"
      >
        <div class="shade-label">
          <div class="shade-swatch" :style="{ backgroundColor: getShadeColor(shade) }"></div>
          <span>{{ shade }}</span>
        </div>
        
        <div 
          v-for="size in availableSizes" 
          :key="`${size}-${shade}`"
          class="variant-cell"
        >
          <button
            v-if="getVariant(size, shade)"
            :class="{
              'variant-btn': true,
              'selected': selectedVariant?.id === getVariant(size, shade).id,
              'low-stock': getVariant(size, shade).stock <= 5,
              'out-of-stock': getVariant(size, shade).stock === 0
            }"
            :disabled="getVariant(size, shade).stock === 0"
            @click="selectVariant(getVariant(size, shade))"
          >
            <span class="price">${{ getVariant(size, shade).price.toFixed(2) }}</span>
            <span v-if="getVariant(size, shade).stock <= 5 && getVariant(size, shade).stock > 0" 
                  class="stock-warning">
              Only {{ getVariant(size, shade).stock }} left
            </span>
            <span v-if="getVariant(size, shade).stock === 0" 
                  class="out-of-stock-text">
              Out of Stock
            </span>
          </button>
          <div v-else class="unavailable-cell">
            <span>—</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Variant Info -->
    <div v-if="selectedVariant" class="selected-variant-info">
      <div class="variant-details">
        <h4>Selected: {{ selectedVariant.size }} • {{ selectedVariant.shade }}</h4>
        <div class="variant-meta">
          <span class="price">${{ selectedVariant.price.toFixed(2) }}</span>
          <span class="stock" :class="{ 'low-stock': selectedVariant.stock <= 5 }">
            {{ selectedVariant.stock }} in stock
          </span>
        </div>
      </div>
      
      <!-- Quick Add Multiple Sizes -->
      <div class="quick-add-section">
        <h5>Add Multiple Sizes</h5>
        <div class="quick-add-options">
          <label 
            v-for="size in availableSizes" 
            :key="size"
            class="quick-add-option"
          >
            <input 
              type="checkbox" 
              :value="size"
              v-model="selectedSizes"
              :disabled="!getVariant(size, selectedVariant.shade) || getVariant(size, selectedVariant.shade).stock === 0"
            >
            <span class="checkmark"></span>
            <span class="size-info">
              {{ size }} - ${{ getVariant(size, selectedVariant.shade)?.price.toFixed(2) || '—' }}
            </span>
          </label>
        </div>
        
        <button 
          v-if="selectedSizes.length > 1"
          @click="addAllToCart"
          class="add-all-btn"
        >
          <i class="fas fa-shopping-cart"></i>
          Add All {{ selectedSizes.length }} Items to Cart
        </button>
      </div>
    </div>

    <!-- Variant Recommendations -->
    <div class="variant-recommendations">
      <h4>Popular Combinations</h4>
      <div class="recommendation-pills">
        <button 
          v-for="combo in popularCombos" 
          :key="combo.id"
          class="combo-pill"
          @click="selectCombo(combo)"
        >
          <span class="combo-text">{{ combo.size }} • {{ combo.shade }}</span>
          <span class="combo-badge">{{ combo.popularity }}% choose this</span>
        </button>
      </div>
    </div>

    <!-- Size Guide Link -->
    <div class="size-guide">
      <button @click="openSizeGuide" class="size-guide-btn">
        <i class="fas fa-ruler"></i>
        View Size Guide
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariantSelectionGrid',
  props: {
    variants: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedVariant: null,
      selectedSizes: [],
      popularCombos: [
        { id: 1, size: 'M', shade: 'Medium', popularity: 67 },
        { id: 2, size: 'S', shade: 'Light', popularity: 45 },
        { id: 3, size: 'M', shade: 'Light', popularity: 38 }
      ]
    };
  },
  computed: {
    availableSizes() {
      return [...new Set(this.variants.map(v => v.size))].sort();
    },
    availableShades() {
      return [...new Set(this.variants.map(v => v.shade))];
    }
  },
  methods: {
    getVariant(size, shade) {
      return this.variants.find(v => v.size === size && v.shade === shade);
    },
    selectVariant(variant) {
      this.selectedVariant = variant;
      this.selectedSizes = [variant.size];
      this.$emit('variant-selected', variant);
    },
    selectCombo(combo) {
      const variant = this.getVariant(combo.size, combo.shade);
      if (variant && variant.stock > 0) {
        this.selectVariant(variant);
      }
    },
    getShadeColor(shade) {
      const shadeColors = {
        'Light': '#f5deb3',
        'Medium': '#deb887',
        'Dark': '#8b7355',
        'Deep': '#654321'
      };
      return shadeColors[shade] || '#ddd';
    },
    addAllToCart() {
      const itemsToAdd = this.selectedSizes.map(size => {
        const variant = this.getVariant(size, this.selectedVariant.shade);
        return variant;
      }).filter(Boolean);
      
      this.$emit('add-multiple-variants', itemsToAdd);
    },
    openSizeGuide() {
      this.$emit('open-size-guide');
    }
  }
};
</script>

<style scoped>
.variant-selection-grid {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
}

.variant-selection-grid h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--gray-800);
}

.variant-matrix {
  display: grid;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
}

.matrix-header {
  display: grid;
  grid-template-columns: 120px repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  margin-bottom: 8px;
}

.empty-cell {
  /* Empty space above shade labels */
}

.size-header {
  background: var(--primary-100);
  color: var(--primary-700);
  padding: 12px 8px;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
}

.shade-row {
  display: grid;
  grid-template-columns: 120px repeat(auto-fit, minmax(80px, 1fr));
  gap: 8px;
  align-items: center;
}

.shade-label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-weight: 500;
  color: var(--gray-700);
}

.shade-swatch {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--gray-300);
  flex-shrink: 0;
}

.variant-cell {
  height: 100%;
}

.variant-btn {
  width: 100%;
  min-height: 60px;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  position: relative;
}

.variant-btn:hover:not(:disabled) {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.variant-btn.selected {
  border-color: var(--primary-500);
  background: var(--primary-100);
}

.variant-btn.low-stock {
  border-color: var(--warning-400);
  background: var(--warning-50);
}

.variant-btn.out-of-stock {
  background: var(--gray-100);
  border-color: var(--gray-300);
  opacity: 0.6;
  cursor: not-allowed;
}

.variant-btn .price {
  font-weight: 600;
  color: var(--gray-800);
  font-size: 14px;
}

.stock-warning {
  font-size: 10px;
  color: var(--warning-600);
  font-weight: 500;
}

.out-of-stock-text {
  font-size: 10px;
  color: var(--gray-500);
  font-weight: 500;
}

.unavailable-cell {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-400);
  font-size: 18px;
}

.selected-variant-info {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid var(--primary-200);
}

.variant-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.variant-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.variant-meta .price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-600);
}

.variant-meta .stock {
  font-size: 14px;
  color: var(--success-600);
}

.variant-meta .stock.low-stock {
  color: var(--warning-600);
}

.quick-add-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid var(--gray-200);
}

.quick-add-section h5 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--gray-700);
}

.quick-add-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.quick-add-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.quick-add-option input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid var(--gray-300);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.quick-add-option input:checked + .checkmark {
  background: var(--primary-500);
  border-color: var(--primary-500);
}

.quick-add-option input:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.quick-add-option input:disabled + .checkmark {
  opacity: 0.5;
  cursor: not-allowed;
}

.size-info {
  font-size: 14px;
  color: var(--gray-700);
}

.add-all-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.add-all-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(var(--primary-500), 0.3);
}

.variant-recommendations {
  margin-bottom: 20px;
}

.variant-recommendations h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: var(--gray-700);
}

.recommendation-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.combo-pill {
  background: white;
  border: 1px solid var(--gray-300);
  border-radius: 20px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.combo-pill:hover {
  border-color: var(--primary-400);
  background: var(--primary-50);
}

.combo-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
}

.combo-badge {
  font-size: 10px;
  color: var(--primary-600);
  font-weight: 600;
}

.size-guide {
  text-align: center;
}

.size-guide-btn {
  background: none;
  border: 2px solid var(--primary-500);
  color: var(--primary-500);
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.size-guide-btn:hover {
  background: var(--primary-500);
  color: white;
}

@media (max-width: 768px) {
  .variant-selection-grid {
    padding: 16px;
  }
  
  .matrix-header,
  .shade-row {
    grid-template-columns: 100px repeat(auto-fit, minmax(70px, 1fr));
  }
  
  .variant-btn {
    min-height: 50px;
    padding: 6px;
  }
  
  .variant-btn .price {
    font-size: 12px;
  }
  
  .quick-add-options {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .variant-matrix {
    overflow-x: scroll;
  }
  
  .recommendation-pills {
    flex-direction: column;
  }
  
  .combo-pill {
    width: 100%;
  }
}
</style>
