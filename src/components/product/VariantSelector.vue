<template>
  <div class="variant-selector">
    <!-- Size Selection -->
    <div v-if="sizes && sizes.length > 0" class="variant-group size-group">
      <div class="variant-header">
        <h4 class="variant-title">Size</h4>
        <span v-if="selectedSize" class="selected-info">
          {{ getSelectedSizeInfo() }}
        </span>
      </div>
      
      <div class="size-options">
        <button 
          v-for="size in sizes" 
          :key="size.id"
          class="size-pill"
          :class="{ 
            selected: selectedSize === size.id,
            'out-of-stock': size.stock === 0 
          }"
          @click="selectSize(size)"
          :disabled="size.stock === 0"
        >
          <div class="size-content">
            <span class="size-value">{{ size.value }}</span>
            <span class="size-price">₹{{ size.price.toLocaleString() }}</span>
            <span v-if="size.originalPrice && size.originalPrice > size.price" class="size-original-price">
              ₹{{ size.originalPrice.toLocaleString() }}
            </span>
          </div>
          <div v-if="size.popular" class="popular-badge">Popular</div>
          <div v-if="size.stock === 0" class="stock-status">Out of Stock</div>
          <div v-else-if="size.stock <= 5" class="stock-status low-stock">
            Only {{ size.stock }} left
          </div>
        </button>
      </div>
      
      <!-- Size Guide Link -->
      <button v-if="showSizeGuide" @click="openSizeGuide" class="size-guide-btn">
        <i class="fas fa-ruler"></i>
        Size Guide
      </button>
    </div>

    <!-- Color Selection -->
    <div v-if="colors && colors.length > 0" class="variant-group color-group">
      <div class="variant-header">
        <h4 class="variant-title">Color</h4>
        <span v-if="selectedColor" class="selected-info">
          {{ getSelectedColorInfo() }}
        </span>
      </div>
      
      <div class="color-options">
        <button 
          v-for="color in colors" 
          :key="color.id"
          class="color-swatch"
          :class="{ 
            selected: selectedColor === color.id,
            'out-of-stock': color.stock === 0 
          }"
          :style="{ backgroundColor: color.hex }"
          @click="selectColor(color)"
          :disabled="color.stock === 0"
          :title="color.name"
        >
          <!-- Selected Check -->
          <div class="color-check" v-if="selectedColor === color.id">
            <i class="fas fa-check"></i>
          </div>
          
          <!-- Image Preview for Colors -->
          <img 
            v-if="color.image" 
            :src="color.image" 
            :alt="color.name"
            class="color-image"
          />
          
          <!-- Stock Indicator -->
          <div v-if="color.stock === 0" class="color-stock-indicator out">
            <i class="fas fa-times"></i>
          </div>
          <div v-else-if="color.stock <= 3" class="color-stock-indicator low">
            <i class="fas fa-exclamation"></i>
          </div>
        </button>
      </div>
      
      <!-- Color Names -->
      <div class="color-names">
        <div 
          v-for="color in colors" 
          :key="'name-' + color.id"
          class="color-name"
          :class="{ active: selectedColor === color.id }"
        >
          {{ color.name }}
        </div>
      </div>
    </div>

    <!-- Bundle Options -->
    <div v-if="bundles && bundles.length > 0" class="variant-group bundle-group">
      <div class="variant-header">
        <h4 class="variant-title">Bundle Options</h4>
        <span class="save-badge">Save up to {{ getMaxBundleDiscount() }}%</span>
      </div>
      
      <div class="bundle-options">
        <div 
          v-for="bundle in bundles"
          :key="bundle.id"
          class="bundle-option"
          :class="{ selected: selectedBundle === bundle.id }"
          @click="selectBundle(bundle)"
        >
          <div class="bundle-radio">
            <input 
              type="radio" 
              :id="`bundle-${bundle.id}`"
              :value="bundle.id"
              v-model="selectedBundle"
              @change="selectBundle(bundle)"
            />
            <label :for="`bundle-${bundle.id}`"></label>
          </div>
          
          <div class="bundle-content">
            <div class="bundle-title">{{ bundle.title }}</div>
            <div class="bundle-description">{{ bundle.description }}</div>
            <div class="bundle-pricing">
              <span class="bundle-price">₹{{ bundle.price.toLocaleString() }}</span>
              <span v-if="bundle.originalPrice" class="bundle-original-price">
                ₹{{ bundle.originalPrice.toLocaleString() }}
              </span>
              <span v-if="bundle.discount" class="bundle-discount">
                Save {{ bundle.discount }}%
              </span>
            </div>
          </div>
          
          <div v-if="bundle.popular" class="bundle-popular">
            <i class="fas fa-star"></i>
            Most Popular
          </div>
        </div>
      </div>
    </div>

    <!-- Quantity Selector -->
    <div class="variant-group quantity-group">
      <div class="variant-header">
        <h4 class="variant-title">Quantity</h4>
        <span v-if="maxQuantity" class="quantity-limit">
          Max {{ maxQuantity }} per order
        </span>
      </div>
      
      <div class="quantity-selector">
        <button 
          @click="decreaseQuantity" 
          class="quantity-btn decrease"
          :disabled="quantity <= 1"
        >
          <i class="fas fa-minus"></i>
        </button>
        <input 
          v-model.number="quantity" 
          type="number" 
          class="quantity-input"
          :min="1"
          :max="maxQuantity || 999"
          @input="validateQuantity"
          @blur="handleQuantityBlur"
        />
        <button 
          @click="increaseQuantity" 
          class="quantity-btn increase"
          :disabled="quantity >= (maxQuantity || 999)"
        >
          <i class="fas fa-plus"></i>
        </button>
      </div>
    </div>

    <!-- Size Guide Modal -->
    <div v-if="showSizeGuideModal" class="modal-overlay" @click="closeSizeGuide">
      <div class="size-guide-modal" @click.stop>
        <div class="modal-header">
          <h3>Size Guide</h3>
          <button @click="closeSizeGuide" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <div class="size-chart">
            <table>
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Volume</th>
                  <th>Usage Duration</th>
                  <th>Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="guide in sizeGuideData" :key="guide.size">
                  <td class="size-cell">{{ guide.size }}</td>
                  <td>{{ guide.volume }}</td>
                  <td>{{ guide.duration }}</td>
                  <td>{{ guide.bestFor }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VariantSelector',
  props: {
    sizes: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Array,
      default: () => []
    },
    bundles: {
      type: Array,
      default: () => []
    },
    showSizeGuide: {
      type: Boolean,
      default: true
    },
    maxQuantity: {
      type: Number,
      default: null
    },
    defaultSize: {
      type: String,
      default: null
    },
    defaultColor: {
      type: String,
      default: null
    },
    defaultQuantity: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      selectedSize: this.defaultSize,
      selectedColor: this.defaultColor,
      selectedBundle: null,
      quantity: this.defaultQuantity,
      showSizeGuideModal: false,
      sizeGuideData: [
        { size: '15ml', volume: '15ml', duration: '2-3 weeks', bestFor: 'Trial/Travel' },
        { size: '30ml', volume: '30ml', duration: '6-8 weeks', bestFor: 'Regular Use' },
        { size: '50ml', volume: '50ml', duration: '3-4 months', bestFor: 'Best Value' },
        { size: '100ml', volume: '100ml', duration: '6-8 months', bestFor: 'Family/Bulk' }
      ]
    };
  },
  computed: {
    selectedSizeData() {
      return this.sizes.find(size => size.id === this.selectedSize);
    },
    selectedColorData() {
      return this.colors.find(color => color.id === this.selectedColor);
    },
    selectedBundleData() {
      return this.bundles.find(bundle => bundle.id === this.selectedBundle);
    }
  },
  methods: {
    selectSize(size) {
      if (size.stock === 0) return;
      
      this.selectedSize = size.id;
      this.$emit('size-selected', size);
      this.emitVariantChange();
    },
    
    selectColor(color) {
      if (color.stock === 0) return;
      
      this.selectedColor = color.id;
      this.$emit('color-selected', color);
      this.emitVariantChange();
    },
    
    selectBundle(bundle) {
      this.selectedBundle = bundle.id;
      this.$emit('bundle-selected', bundle);
      this.emitVariantChange();
    },
    
    increaseQuantity() {
      if (this.quantity < (this.maxQuantity || 999)) {
        this.quantity++;
        this.emitQuantityChange();
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
        this.emitQuantityChange();
      }
    },
    
    validateQuantity() {
      if (this.quantity < 1) {
        this.quantity = 1;
      }
      if (this.maxQuantity && this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
      }
      this.emitQuantityChange();
    },
    
    handleQuantityBlur() {
      if (!this.quantity || isNaN(this.quantity)) {
        this.quantity = 1;
      }
      this.validateQuantity();
    },
    
    openSizeGuide() {
      this.showSizeGuideModal = true;
      document.body.style.overflow = 'hidden';
    },
    
    closeSizeGuide() {
      this.showSizeGuideModal = false;
      document.body.style.overflow = 'auto';
    },
    
    getSelectedSizeInfo() {
      if (!this.selectedSizeData) return '';
      return `${this.selectedSizeData.value} - ₹${this.selectedSizeData.price.toLocaleString()}`;
    },
    
    getSelectedColorInfo() {
      if (!this.selectedColorData) return '';
      return this.selectedColorData.name;
    },
    
    getMaxBundleDiscount() {
      if (!this.bundles.length) return 0;
      return Math.max(...this.bundles.map(bundle => bundle.discount || 0));
    },
    
    emitVariantChange() {
      this.$emit('variant-change', {
        size: this.selectedSizeData,
        color: this.selectedColorData,
        bundle: this.selectedBundleData,
        quantity: this.quantity
      });
    },
    
    emitQuantityChange() {
      this.$emit('quantity-change', this.quantity);
      this.emitVariantChange();
    },
    
    // Public method to get current selection
    getCurrentSelection() {
      return {
        size: this.selectedSizeData,
        color: this.selectedColorData,
        bundle: this.selectedBundleData,
        quantity: this.quantity
      };
    }
  },
  
  mounted() {
    // Auto-select defaults if available
    if (this.sizes.length && !this.selectedSize) {
      // Select the middle option or "medium" size
      const defaultIndex = Math.floor(this.sizes.length / 2);
      this.selectSize(this.sizes[defaultIndex]);
    }
    
    if (this.colors.length && !this.selectedColor) {
      this.selectColor(this.colors[0]);
    }
    
    // Emit initial state
    this.$nextTick(() => {
      this.emitVariantChange();
    });
  },
  
  watch: {
    defaultSize(newVal) {
      this.selectedSize = newVal;
    },
    defaultColor(newVal) {
      this.selectedColor = newVal;
    },
    defaultQuantity(newVal) {
      this.quantity = newVal;
    }
  }
};
</script>

<style scoped>
.variant-selector {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.variant-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.variant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.variant-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--market-text);
  margin: 0;
}

.selected-info {
  font-size: 14px;
  color: var(--market-text-light);
  font-weight: 500;
}

/* Size Selection */
.size-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-pill {
  border: 2px solid var(--market-border);
  background: var(--market-surface);
  border-radius: 24px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 100px;
  text-align: center;
}

.size-pill:hover:not(:disabled) {
  border-color: var(--market-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.size-pill.selected {
  border-color: var(--market-primary);
  background: var(--market-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.size-pill.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
  background: #f9fafb;
}

.size-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.size-value {
  font-weight: 600;
  font-size: 16px;
}

.size-price {
  font-size: 14px;
  font-weight: 600;
}

.size-original-price {
  font-size: 12px;
  text-decoration: line-through;
  opacity: 0.7;
}

.popular-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: var(--market-accent);
  color: white;
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stock-status {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 600;
  white-space: nowrap;
}

.stock-status:not(.low-stock) {
  background: #fee2e2;
  color: #dc2626;
}

.low-stock {
  background: #fef3c7;
  color: #d97706;
}

.size-guide-btn {
  align-self: flex-start;
  background: none;
  border: 1px solid var(--market-border);
  color: var(--market-text-light);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.size-guide-btn:hover {
  border-color: var(--market-primary);
  color: var(--market-primary);
}

/* Color Selection */
.color-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.color-swatch {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid var(--market-border);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.color-swatch:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.color-swatch.selected {
  border-color: var(--market-primary);
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.3);
  transform: scale(1.1);
}

.color-swatch.out-of-stock {
  opacity: 0.5;
  cursor: not-allowed;
}

.color-check {
  color: #1f2937;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);
}

.color-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.color-stock-indicator {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
}

.color-stock-indicator.out {
  background: #dc2626;
  color: white;
}

.color-stock-indicator.low {
  background: #f59e0b;
  color: white;
}

.color-names {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.color-name {
  font-size: 14px;
  color: var(--market-text-light);
  transition: all 0.3s ease;
}

.color-name.active {
  color: var(--market-primary);
  font-weight: 600;
}

/* Bundle Options */
.save-badge {
  background: var(--market-accent-gradient);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.bundle-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bundle-option {
  border: 2px solid var(--market-border);
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 16px;
  align-items: center;
  position: relative;
}

.bundle-option:hover {
  border-color: var(--market-primary);
  background: var(--market-secondary);
}

.bundle-option.selected {
  border-color: var(--market-primary);
  background: var(--market-secondary);
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.2);
}

.bundle-radio {
  position: relative;
}

.bundle-radio input[type="radio"] {
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid var(--market-border);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
}

.bundle-radio input[type="radio"]:checked {
  border-color: var(--market-primary);
}

.bundle-radio input[type="radio"]:checked::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--market-primary);
  border-radius: 50%;
}

.bundle-content {
  flex: 1;
}

.bundle-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--market-text);
  margin-bottom: 4px;
}

.bundle-description {
  font-size: 14px;
  color: var(--market-text-light);
  margin-bottom: 8px;
}

.bundle-pricing {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bundle-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--market-primary);
}

.bundle-original-price {
  font-size: 14px;
  color: var(--market-text-light);
  text-decoration: line-through;
}

.bundle-discount {
  background: var(--market-accent);
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.bundle-popular {
  position: absolute;
  top: -10px;
  right: 16px;
  background: var(--market-accent);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Quantity Selector */
.quantity-limit {
  font-size: 12px;
  color: var(--market-text-light);
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0;
  width: fit-content;
  border: 2px solid var(--market-border);
  border-radius: 12px;
  overflow: hidden;
}

.quantity-btn {
  width: 44px;
  height: 44px;
  background: var(--market-surface);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--market-text);
}

.quantity-btn:hover:not(:disabled) {
  background: var(--market-primary);
  color: white;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 60px;
  height: 44px;
  border: none;
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  background: var(--market-surface);
  color: var(--market-text);
}

.quantity-input:focus {
  outline: none;
  background: var(--market-secondary);
}

/* Size Guide Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
}

.size-guide-modal {
  background: white;
  border-radius: 20px;
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--market-text);
}

.close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: var(--market-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: var(--market-border);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
}

.size-chart table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.size-chart th,
.size-chart td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--market-border);
}

.size-chart th {
  background: var(--market-secondary);
  font-weight: 600;
  color: var(--market-text);
}

.size-cell {
  font-weight: 600;
  color: var(--market-primary);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .variant-selector {
    gap: 24px;
  }
  
  .size-pill {
    min-width: 80px;
    padding: 12px 16px;
  }
  
  .color-swatch {
    width: 40px;
    height: 40px;
  }
  
  .bundle-option {
    padding: 16px;
    flex-direction: column;
    text-align: center;
  }
  
  .bundle-pricing {
    justify-content: center;
  }
  
  .modal-content {
    padding: 16px;
  }
  
  .size-chart {
    overflow-x: auto;
  }
  
  .size-chart table {
    min-width: 400px;
  }
}

@media (max-width: 480px) {
  .size-options {
    gap: 8px;
  }
  
  .size-pill {
    min-width: 70px;
    padding: 10px 12px;
  }
  
  .size-value {
    font-size: 14px;
  }
  
  .size-price {
    font-size: 12px;
  }
  
  .color-swatch {
    width: 35px;
    height: 35px;
  }
  
  .variant-title {
    font-size: 16px;
  }
}
</style>
