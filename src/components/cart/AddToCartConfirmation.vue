<template>
  <div 
    v-if="isVisible" 
    class="cart-confirmation-overlay"
    @click="closeConfirmation"
  >
    <div 
      class="cart-confirmation-popup"
      @click.stop
    >
      <div class="confirmation-header">
        <button 
          class="close-btn"
          @click="closeConfirmation"
          aria-label="Close confirmation"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="confirmation-content">
        <div class="success-icon">
          <i class="fas fa-check"></i>
        </div>
        
        <h3 class="confirmation-title">Added to Cart!</h3>
        
        <div class="product-summary">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" />
          </div>
          
          <div class="product-details">
            <div class="product-brand">{{ product.brand }}</div>
            <h4 class="product-name">{{ product.name }}</h4>
            <div class="product-price">${{ product.price.toFixed(2) }}</div>
            <div v-if="quantity > 1" class="product-quantity">
              Quantity: {{ quantity }}
            </div>
          </div>
        </div>

        <div class="confirmation-actions">
          <button 
            class="continue-shopping-btn"
            @click="continueShopping"
          >
            Continue Shopping
          </button>
          
          <button 
            class="go-to-cart-btn"
            @click="goToCart"
          >
            <i class="fas fa-shopping-cart"></i>
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddToCartConfirmation',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object,
      default: () => ({})
    },
    quantity: {
      type: Number,
      default: 1
    }
  },
  methods: {
    closeConfirmation() {
      this.$emit('close');
    },
    
    continueShopping() {
      this.$emit('continue-shopping');
      this.closeConfirmation();
    },
    
    goToCart() {
      this.$emit('go-to-cart');
      this.closeConfirmation();
    }
  }
};
</script>

<style scoped>
.cart-confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

.cart-confirmation-popup {
  background: white;
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;
  position: relative;
}

.confirmation-header {
  position: relative;
  padding: 16px 20px 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 18px;
  color: var(--gray-400);
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--gray-100);
  color: var(--gray-600);
}

.confirmation-content {
  padding: 20px 24px 32px;
  text-align: center;
}

.success-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 24px;
  animation: bounceIn 0.6s ease;
}

.confirmation-title {
  color: var(--gray-800);
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
}

.product-summary {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
  text-align: left;
}

.product-image {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-brand {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
  margin-bottom: 4px;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 8px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 18px;
  font-weight: 700;
  color: var(--primary-600);
  margin-bottom: 4px;
}

.product-quantity {
  font-size: 14px;
  color: var(--gray-600);
  font-weight: 500;
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.continue-shopping-btn {
  background: white;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
  font-family: inherit;
}

.continue-shopping-btn:hover {
  background: var(--primary-50);
  border-color: var(--primary-600);
  transform: translateY(-1px);
}

.go-to-cart-btn {
  background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  min-height: 48px;
  font-family: inherit;
}

.go-to-cart-btn:hover {
  background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.25);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .cart-confirmation-popup {
    max-width: 100%;
    margin: 0 16px;
    border-radius: 12px;
  }
  
  .confirmation-content {
    padding: 16px 20px 24px;
  }
  
  .product-summary {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  
  .confirmation-actions {
    flex-direction: column;
  }
  
  .continue-shopping-btn,
  .go-to-cart-btn {
    font-size: 15px;
  }
}
</style>
