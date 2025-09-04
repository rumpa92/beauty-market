<template>
  <div class="order-success">
    <div class="market-container">
      <div class="success-content">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        
        <h1 class="success-title">🎉 Order Placed Successfully!</h1>
        
        <p class="success-message">
          Thank you for your order! Your order ID is 
          <span class="order-id">#{{ orderId }}</span>
        </p>
        
        <div class="order-details">
          <h3>Order Summary</h3>
          <div class="detail-item">
            <span>Order ID:</span>
            <span>#{{ orderId }}</span>
          </div>
          <div class="detail-item">
            <span>Payment Method:</span>
            <span>Cash on Delivery</span>
          </div>
          <div class="detail-item">
            <span>Total Amount:</span>
            <span class="amount">$97.64</span>
          </div>
          <div class="detail-item">
            <span>Expected Delivery:</span>
            <span>3-5 business days</span>
          </div>
        </div>
        
        <div class="action-buttons">
          <button @click="trackOrder" class="market-btn market-btn-primary">
            <i class="fas fa-map-marker-alt"></i>
            Track Order
          </button>
          
          <button @click="continueShopping" class="market-btn market-btn-secondary">
            <i class="fas fa-shopping-bag"></i>
            Continue Shopping
          </button>
        </div>
        
        <div class="special-offer">
          <h4>🎁 Special Offer!</h4>
          <p>Get 15% off your next order with code: <strong>THANKYOU15</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSuccess',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  methods: {
    trackOrder() {
      console.log('Track order:', this.orderId);
      // In real app: this.$router.push(`/order-tracking/${this.orderId}`);
    },
    
    continueShopping() {
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>
.order-success {
  padding: 40px 0;
  min-height: 80vh;
  background: linear-gradient(135deg, #fdf2f8, #f3e8ff);
}

.success-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 3rem 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.success-icon {
  font-size: 4rem;
  color: #10b981;
  margin-bottom: 1.5rem;
}

.success-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.success-message {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.order-id {
  background: #fdf2f8;
  color: #ec4899;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-weight: 700;
  font-family: monospace;
}

.order-details {
  background: #f9fafb;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  text-align: left;
}

.order-details h3 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.detail-item:last-child {
  border-bottom: none;
}

.amount {
  color: #ec4899;
  font-weight: 700;
  font-size: 1.1rem;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.special-offer {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  padding: 1.5rem;
  border-radius: 16px;
}

.special-offer h4 {
  margin-bottom: 0.5rem;
}

.special-offer p {
  margin: 0;
}

@media (max-width: 768px) {
  .success-content {
    padding: 2rem 1.5rem;
    margin: 0 1rem;
  }
  
  .success-title {
    font-size: 2rem;
  }
}
</style>
