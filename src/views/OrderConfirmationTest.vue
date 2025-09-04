<template>
  <div class="order-success-page">
    <div class="success-container">
      <!-- Success Icon -->
      <div class="success-icon-section">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
      </div>

      <!-- Success Content -->
      <div class="success-content">
        <h1 class="success-title">🎉 Order Placed Successfully!</h1>
        <p class="success-subtitle">
          Thank you for shopping with us. Your order ID is 
          <span class="order-id">#{{ orderId }}</span>
        </p>

        <!-- Order Details Card -->
        <div class="order-card">
          <h3>Order Summary</h3>
          <div class="order-details">
            <div class="detail-row">
              <span>Order ID:</span>
              <span>#{{ orderId }}</span>
            </div>
            <div class="detail-row">
              <span>Payment Method:</span>
              <span>Cash on Delivery</span>
            </div>
            <div class="detail-row">
              <span>Total Amount:</span>
              <span class="amount">$97.64</span>
            </div>
            <div class="detail-row">
              <span>Delivery:</span>
              <span>3-5 business days</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="trackOrder" class="btn-primary">
            <i class="fas fa-map-marker-alt"></i>
            Track Order
          </button>
          
          <button @click="continueShopping" class="btn-secondary">
            <i class="fas fa-shopping-bag"></i>
            Continue Shopping
          </button>
        </div>

        <!-- Special Offer -->
        <div class="special-offer">
          <div class="offer-content">
            <h4>🎁 Special Offer for You!</h4>
            <p>Get 15% off on your next order with code: <strong>THANKYOU15</strong></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderConfirmationTest',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  methods: {
    trackOrder() {
      this.$router.push(`/order-tracking/${this.orderId}`);
    },
    
    continueShopping() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fce7f3, #f3e8ff);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.success-container {
  background: white;
  border-radius: 20px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.success-icon-section {
  margin-bottom: 2rem;
}

.success-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  color: white;
  font-size: 3rem;
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.success-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.success-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.order-id {
  font-weight: 700;
  color: #db2777;
  background: #fdf2f8;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: monospace;
}

.order-card {
  background: #f9fafb;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}

.order-card h3 {
  color: #1f2937;
  margin-bottom: 1rem;
  text-align: center;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-row:last-child {
  border-bottom: none;
  font-weight: 600;
}

.amount {
  color: #db2777;
  font-weight: 700;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #db2777, #be185d);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.3);
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #f472b6;
  transform: translateY(-2px);
}

.special-offer {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;
  text-align: center;
}

.special-offer h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.special-offer p {
  margin: 0;
  opacity: 0.9;
}

@media (max-width: 768px) {
  .success-container {
    padding: 2rem 1.5rem;
  }
  
  .success-title {
    font-size: 1.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
