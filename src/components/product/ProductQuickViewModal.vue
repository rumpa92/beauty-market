<template>
  <div v-if="show" class="quick-view-modal-overlay" @click="closeModal">
    <div class="quick-view-modal" @click.stop>
      <!-- Close Button -->
      <button @click="closeModal" class="modal-close-btn">
        <i class="fas fa-times"></i>
      </button>

      <div class="modal-content">
        <!-- Product Image Section -->
        <div class="modal-image-section">
          <div class="modal-product-image">
            <img :src="product.image || product.images?.[0]" :alt="product.name" />
          </div>
        </div>

        <!-- Product Details Section -->
        <div class="modal-details-section">
          <!-- Price -->
          <div class="modal-price">
            ${{ formatPrice(product.price) }}
          </div>

          <!-- Product Description -->
          <div class="modal-description">
            {{ product.description }}
          </div>

          <!-- Key Benefits -->
          <div class="modal-benefits">
            <h4 class="benefits-title">Key Benefits:</h4>
            <div class="benefits-list">
              <div 
                v-for="benefit in getBenefits()" 
                :key="benefit" 
                class="benefit-item"
              >
                <i class="fas fa-check benefit-check"></i>
                <span>{{ benefit }}</span>
              </div>
            </div>
          </div>

          <!-- Quantity Selector -->
          <div class="modal-quantity">
            <label class="quantity-label">Quantity:</label>
            <div class="quantity-controls">
              <button 
                @click="decreaseQuantity" 
                class="quantity-btn"
                :disabled="quantity <= 1"
              >
                <i class="fas fa-minus"></i>
              </button>
              <span class="quantity-display">{{ quantity }}</span>
              <button 
                @click="increaseQuantity" 
                class="quantity-btn"
                :disabled="quantity >= 10"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="modal-actions">
            <button 
              @click="addToCart" 
              class="modal-btn add-to-cart-btn"
              :disabled="isAddingToCart"
            >
              <i class="fas fa-shopping-cart"></i>
              {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
            </button>
            
            <button 
              @click="toggleWishlist" 
              class="modal-btn wishlist-btn"
              :class="{ active: isInWishlist }"
            >
              <i class="fas fa-heart"></i>
              {{ isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist' }}
            </button>
          </div>

          <!-- View Full Details Button -->
          <div class="view-full-details">
            <button @click="viewFullDetails" class="view-full-btn">
              View Full Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ProductQuickViewModal',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      quantity: 1,
      isAddingToCart: false,
      isInWishlist: false
    };
  },
  computed: {
    ...mapGetters('cart', ['cartItems'])
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    
    closeModal() {
      this.$emit('close');
      this.quantity = 1; // Reset quantity when closing
    },
    
    increaseQuantity() {
      if (this.quantity < 10) {
        this.quantity++;
      }
    },
    
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    
    async addToCart() {
      this.isAddingToCart = true;
      
      try {
        await this.addToCart({
          ...this.product,
          quantity: this.quantity
        });
        
        // Show success feedback
        this.$emit('added-to-cart', {
          product: this.product,
          quantity: this.quantity
        });
        
        // Optional: Close modal after adding to cart
        // this.closeModal();
        
      } catch (error) {
        console.error('Error adding to cart:', error);
      } finally {
        this.isAddingToCart = false;
      }
    },
    
    toggleWishlist() {
      this.isInWishlist = !this.isInWishlist;
      this.$emit('wishlist-toggle', {
        product: this.product,
        isInWishlist: this.isInWishlist
      });
    },
    
    viewFullDetails() {
      this.$emit('view-full-details', this.product);
      this.closeModal();
      this.$router.push(`/product/${this.product.id}`);
    },
    
    formatPrice(price) {
      return typeof price === 'number' ? price.toFixed(2) : price;
    },
    
    getBenefits() {
      // Return benefits from product or default benefits
      if (this.product.benefits && Array.isArray(this.product.benefits)) {
        return this.product.benefits;
      }
      
      // Default benefits based on product type
      const defaultBenefits = {
        'serum': ['Brightening', 'Even tone', 'Antioxidant protection'],
        'moisturizer': ['Hydrating', 'Anti-aging', 'Firming'],
        'cleanser': ['Deep cleansing', 'Gentle formula', 'Removes impurities'],
        'lipstick': ['Long-lasting', 'Transfer-proof', 'Comfortable wear']
      };
      
      // Try to determine product type from name or category
      const productName = this.product.name.toLowerCase();
      const productCategory = this.product.category?.toLowerCase() || '';
      
      if (productName.includes('serum') || productCategory.includes('serum')) {
        return defaultBenefits.serum;
      } else if (productName.includes('moisturizer') || productName.includes('cream')) {
        return defaultBenefits.moisturizer;
      } else if (productName.includes('cleanser') || productName.includes('wash')) {
        return defaultBenefits.cleanser;
      } else if (productName.includes('lipstick') || productCategory.includes('lip')) {
        return defaultBenefits.lipstick;
      }
      
      // Default fallback
      return ['High quality', 'Dermatologically tested', 'Premium formula'];
    }
  },
  
  mounted() {
    // Add escape key listener
    const handleEscape = (event) => {
      if (event.key === 'Escape' && this.show) {
        this.closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    // Cleanup
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('keydown', handleEscape);
    });
  }
};
</script>

<style scoped>
.quick-view-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.quick-view-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.3s ease;
}

.modal-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}

.modal-close-btn:hover {
  background: rgba(0, 0, 0, 0.2);
  color: #333;
}

.modal-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  height: 100%;
}

.modal-image-section {
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.modal-product-image {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-details-section {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-price {
  font-size: 32px;
  font-weight: 700;
  color: #e91e63;
  margin: 0;
}

.modal-description {
  color: #666;
  line-height: 1.6;
  font-size: 16px;
}

.modal-benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.benefits-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.benefit-check {
  color: #4caf50;
  font-size: 12px;
}

.modal-quantity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.quantity-btn:hover:not(:disabled) {
  background: #f5f5f5;
  color: #e91e63;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  min-width: 40px;
  text-align: center;
  font-weight: 600;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-btn {
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
}

.add-to-cart-btn {
  background: #e91e63;
  color: white;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #c2185b;
  transform: translateY(-1px);
}

.add-to-cart-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wishlist-btn {
  background: #e91e63;
  color: white;
}

.wishlist-btn:hover {
  background: #c2185b;
  transform: translateY(-1px);
}

.wishlist-btn.active {
  background: #c2185b;
}

.view-full-details {
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.view-full-btn {
  width: 100%;
  padding: 12px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.view-full-btn:hover {
  border-color: #e91e63;
  color: #e91e63;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .quick-view-modal {
    width: 95vw;
    max-height: 95vh;
  }
  
  .modal-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  
  .modal-image-section {
    padding: 20px;
  }
  
  .modal-product-image {
    max-width: 200px;
  }
  
  .modal-details-section {
    padding: 20px;
    gap: 20px;
  }
  
  .modal-price {
    font-size: 24px;
  }
  
  .modal-actions {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .modal-image-section {
    padding: 15px;
  }
  
  .modal-product-image {
    max-width: 150px;
  }
  
  .modal-details-section {
    padding: 15px;
    gap: 16px;
  }
  
  .modal-price {
    font-size: 20px;
  }
}
</style>
