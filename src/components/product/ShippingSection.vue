<template>
  <div class="shipping-section">
    <div class="shipping-options">
      <h3>Shipping Options</h3>
      <div class="shipping-cards">
        <div class="shipping-card">
          <div class="shipping-icon">
            <i class="fas fa-truck"></i>
          </div>
          <div class="shipping-details">
            <h4>Standard Shipping</h4>
            <p>5-7 business days</p>
            <span class="shipping-price">$5.99</span>
          </div>
        </div>
        
        <div class="shipping-card">
          <div class="shipping-icon express">
            <i class="fas fa-shipping-fast"></i>
          </div>
          <div class="shipping-details">
            <h4>Express Shipping</h4>
            <p>2-3 business days</p>
            <span class="shipping-price">$12.99</span>
          </div>
        </div>
        
        <div class="shipping-card">
          <div class="shipping-icon overnight">
            <i class="fas fa-plane"></i>
          </div>
          <div class="shipping-details">
            <h4>Overnight</h4>
            <p>Next business day</p>
            <span class="shipping-price">$24.99</span>
          </div>
        </div>
      </div>
    </div>

    <div class="shipping-info">
      <h3>Shipping Information</h3>
      <div class="info-grid">
        <div class="info-item">
          <i class="fas fa-gift"></i>
          <div>
            <h4>Free Shipping</h4>
            <p>On orders over $50</p>
          </div>
        </div>
        
        <div class="info-item">
          <i class="fas fa-shield-alt"></i>
          <div>
            <h4>Secure Packaging</h4>
            <p>Protected during transit</p>
          </div>
        </div>
        
        <div class="info-item">
          <i class="fas fa-undo"></i>
          <div>
            <h4>Easy Returns</h4>
            <p>30-day return policy</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShippingSection'
};
</script>

<style scoped>
.shipping-section {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.shipping-options h3,
.shipping-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 20px;
}

.shipping-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.shipping-card {
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.shipping-card:hover {
  border-color: var(--primary-300);
  background: var(--primary-50);
}

.shipping-icon {
  width: 50px;
  height: 50px;
  background: var(--gray-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.shipping-icon.express {
  background: var(--warning-500);
}

.shipping-icon.overnight {
  background: var(--error-500);
}

.shipping-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.shipping-details p {
  color: var(--gray-600);
  font-size: 14px;
  margin-bottom: 8px;
}

.shipping-price {
  font-weight: 700;
  color: var(--primary-600);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid var(--gray-200);
}

.info-item i {
  font-size: 24px;
  color: var(--primary-500);
  width: 40px;
  text-align: center;
}

.info-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.info-item p {
  color: var(--gray-600);
  font-size: 14px;
}
</style>
