<template>
  <div class="returns-page">
    <!-- Hero Section -->
    <div class="returns-hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-icon">
            <i class="fas fa-undo-alt"></i>
          </div>
          <h1 class="hero-title">Easy Returns & Refunds</h1>
          <p class="hero-description">
            Returning is simple — select your delivered item from order history, choose a reason, and submit your request. For faster access to your money, choose an instant refund to your store wallet and shop again anytime.
          </p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">24hrs</div>
              <div class="stat-label">Quick Processing</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98%</div>
              <div class="stat-label">Success Rate</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">5-7 Days</div>
              <div class="stat-label">Refund Timeline</div>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="card-item card-1">
              <i class="fas fa-box-open"></i>
              <span>Select Item</span>
            </div>
            <div class="card-item card-2">
              <i class="fas fa-edit"></i>
              <span>Choose Reason</span>
            </div>
            <div class="card-item card-3">
              <i class="fas fa-rocket"></i>
              <span>Submit Request</span>
            </div>
            <div class="card-item card-4">
              <i class="fas fa-wallet"></i>
              <span>Instant Refund</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Methods Section -->
    <div class="return-methods">
      <div class="container">
        <h2 class="section-title">Choose Your Refund Method</h2>
        <div class="methods-grid">
          <!-- Instant Wallet Refund -->
          <div class="method-card featured">
            <div class="method-badge">Recommended</div>
            <div class="method-icon wallet-icon">
              <i class="fas fa-wallet"></i>
              <div class="icon-sparkle">✨</div>
            </div>
            <h3 class="method-title">Instant Store Wallet</h3>
            <p class="method-description">Get your money back instantly to your store wallet. Shop immediately with bonus credits!</p>
            <div class="method-benefits">
              <div class="benefit-item">
                <i class="fas fa-zap"></i>
                <span>Instant Processing</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-gift"></i>
                <span>+5% Bonus Credits</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-shopping-bag"></i>
                <span>Shop Immediately</span>
              </div>
            </div>
            <div class="method-timeline">
              <div class="timeline-item active">
                <div class="timeline-dot"></div>
                <span>Request Submitted</span>
              </div>
              <div class="timeline-item active">
                <div class="timeline-dot"></div>
                <span>Instantly Credited</span>
              </div>
            </div>
          </div>

          <!-- Original Payment Method -->
          <div class="method-card">
            <div class="method-icon payment-icon">
              <i class="fas fa-credit-card"></i>
            </div>
            <h3 class="method-title">Original Payment Method</h3>
            <p class="method-description">Refund to your original payment method (card, UPI, etc.)</p>
            <div class="method-benefits">
              <div class="benefit-item">
                <i class="fas fa-shield-alt"></i>
                <span>Secure Processing</span>
              </div>
              <div class="benefit-item">
                <i class="fas fa-university"></i>
                <span>Bank Transfer</span>
              </div>
            </div>
            <div class="method-timeline">
              <div class="timeline-item active">
                <div class="timeline-dot"></div>
                <span>Request Submitted</span>
              </div>
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <span>5-7 Business Days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Return Process Steps -->
    <div class="return-process">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="process-steps">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Find Your Order</h3>
              <p>Go to "My Orders" and find the delivered item you want to return</p>
              <div class="step-visual">
                <div class="mini-order-card">
                  <div class="order-image"></div>
                  <div class="order-details">
                    <div class="order-title"></div>
                    <div class="order-status">✓ Delivered</div>
                  </div>
                  <button class="return-btn-mini">Return</button>
                </div>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Select Return Reason</h3>
              <p>Choose from common reasons or describe your specific issue</p>
              <div class="step-visual">
                <div class="reason-selector">
                  <div class="reason-option selected">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>Product Defective</span>
                  </div>
                  <div class="reason-option">
                    <i class="fas fa-shipping-fast"></i>
                    <span>Wrong Item</span>
                  </div>
                  <div class="reason-option">
                    <i class="fas fa-heart-broken"></i>
                    <span>Not As Expected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Choose Refund Method</h3>
              <p>Pick instant wallet credit or original payment method</p>
              <div class="step-visual">
                <div class="refund-options">
                  <div class="refund-option featured-mini">
                    <i class="fas fa-wallet"></i>
                    <span>Instant Wallet</span>
                    <div class="bonus-tag">+5% Bonus</div>
                  </div>
                  <div class="refund-option">
                    <i class="fas fa-credit-card"></i>
                    <span>Original Method</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>Get Your Refund</h3>
              <p>Receive instant wallet credit or wait 5-7 days for bank transfer</p>
              <div class="step-visual">
                <div class="success-animation">
                  <div class="checkmark">✓</div>
                  <div class="success-text">Refund Processed!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Orders Section -->
    <div class="recent-orders-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Your Recent Orders</h2>
          <p class="section-subtitle">Select an item to start your return process</p>
        </div>
        
        <div class="orders-grid">
          <div class="order-card returnable" @click="initiateReturn('10234')">
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">#10234</span>
                <span class="order-date">Jan 15, 2024</span>
              </div>
              <div class="order-status delivered">
                <i class="fas fa-check"></i>
                Delivered
              </div>
            </div>
            <div class="order-items">
              <div class="item-preview">
                <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150" alt="Face Cream">
                <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150" alt="Serum">
                <img src="https://images.unsplash.com/photo-1571875257727-256c39da42af?w=150" alt="Cleanser">
                <div class="more-items">+0</div>
              </div>
              <div class="item-details">
                <span class="item-count">3 items</span>
                <span class="order-total">₹2,499</span>
              </div>
            </div>
            <div class="order-actions">
              <button class="return-button">
                <i class="fas fa-undo"></i>
                Return Items
              </button>
              <button class="view-button">
                <i class="fas fa-eye"></i>
                View Details
              </button>
            </div>
            <div class="return-eligible-badge">
              <i class="fas fa-shield-check"></i>
              Return Eligible
            </div>
          </div>

          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">#10189</span>
                <span class="order-date">Jan 10, 2024</span>
              </div>
              <div class="order-status shipped">
                <i class="fas fa-truck"></i>
                Shipped
              </div>
            </div>
            <div class="order-items">
              <div class="item-preview">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=150" alt="Lipstick">
                <img src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150" alt="Foundation">
                <div class="more-items">+0</div>
              </div>
              <div class="item-details">
                <span class="item-count">2 items</span>
                <span class="order-total">₹1,799</span>
              </div>
            </div>
            <div class="order-actions">
              <button class="track-button">
                <i class="fas fa-map-marker-alt"></i>
                Track Order
              </button>
            </div>
          </div>

          <div class="order-card">
            <div class="order-header">
              <div class="order-info">
                <span class="order-number">#10145</span>
                <span class="order-date">Dec 28, 2023</span>
              </div>
              <div class="order-status delivered">
                <i class="fas fa-check"></i>
                Delivered
              </div>
            </div>
            <div class="order-items">
              <div class="item-preview">
                <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150" alt="Shampoo">
                <div class="more-items">+0</div>
              </div>
              <div class="item-details">
                <span class="item-count">1 item</span>
                <span class="order-total">₹899</span>
              </div>
            </div>
            <div class="return-expired">
              <i class="fas fa-clock"></i>
              Return Period Expired
            </div>
          </div>
        </div>

        <div class="view-all-orders">
          <button class="view-all-btn" @click="$router.push('/orders')">
            <i class="fas fa-list"></i>
            View All Orders
          </button>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="faq-section">
      <div class="container">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-grid">
          <div class="faq-item" v-for="(faq, index) in faqs" :key="index" @click="toggleFaq(index)">
            <div class="faq-header">
              <h3 class="faq-question">{{ faq.question }}</h3>
              <i class="fas fa-chevron-down faq-arrow" :class="{ 'open': faq.isOpen }"></i>
            </div>
            <div class="faq-answer" :class="{ 'open': faq.isOpen }">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Returns',
  data() {
    return {
      faqs: [
        {
          question: "How long do I have to return an item?",
          answer: "You have 7 days from delivery to initiate a return for most items. Some categories like cosmetics have a 3-day return window for hygiene reasons.",
          isOpen: false
        },
        {
          question: "What's the benefit of choosing wallet refund?",
          answer: "Wallet refunds are processed instantly and you get an additional 5% bonus credits. You can use these credits immediately for your next purchase.",
          isOpen: false
        },
        {
          question: "Do I need to return the item for wallet refund?",
          answer: "For certain items like cosmetics and personal care products, you may not need to return the physical item for wallet refunds due to hygiene reasons.",
          isOpen: false
        },
        {
          question: "How long does original payment method refund take?",
          answer: "Refunds to your original payment method typically take 5-7 business days to process and appear in your account.",
          isOpen: false
        },
        {
          question: "Can I return opened beauty products?",
          answer: "Yes, you can return opened beauty products within the return window if they don't meet your expectations or cause allergic reactions.",
          isOpen: false
        },
        {
          question: "What if my item was damaged during delivery?",
          answer: "For damaged items, we process returns immediately and may not require you to ship the item back. Contact our support team for faster resolution.",
          isOpen: false
        }
      ]
    };
  },
  methods: {
    toggleFaq(index) {
      this.faqs[index].isOpen = !this.faqs[index].isOpen;
    },
    initiateReturn(orderId) {
      this.$router.push(`/order-details/${orderId}`);
    }
  }
};
</script>

<style scoped>
.returns-page {
  background: linear-gradient(135deg, #f8faff 0%, #fef7ff 50%, #f0f9ff 100%);
  min-height: 100vh;
}

/* Hero Section */
.returns-hero {
  padding: 80px 0 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.returns-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="80" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="60" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 40px;
  opacity: 0.9;
}

.hero-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-cards {
  position: relative;
  height: 100%;
}

.card-item {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: floatCard 6s ease-in-out infinite;
}

.card-item i {
  font-size: 24px;
  margin-bottom: 8px;
}

.card-1 {
  top: 20px;
  left: 20px;
  animation-delay: 0s;
}

.card-2 {
  top: 80px;
  right: 40px;
  animation-delay: -1.5s;
}

.card-3 {
  bottom: 120px;
  left: 60px;
  animation-delay: -3s;
}

.card-4 {
  bottom: 40px;
  right: 20px;
  animation-delay: -4.5s;
}

@keyframes floatCard {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Section Styling */
.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 16px;
  color: #1f2937;
}

.section-subtitle {
  text-align: center;
  color: #6b7280;
  margin-bottom: 48px;
  font-size: 16px;
}

/* Return Methods */
.return-methods {
  padding: 80px 0;
  background: white;
}

.methods-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin-top: 48px;
}

.method-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #f3f4f6;
  transition: all 0.3s ease;
  position: relative;
}

.method-card.featured {
  border-color: #8b5cf6;
  transform: scale(1.02);
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
}

.method-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.method-badge {
  position: absolute;
  top: -10px;
  right: 24px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.method-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: 20px;
  position: relative;
}

.wallet-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.payment-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  color: white;
}

.icon-sparkle {
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 16px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

.method-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.method-description {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
}

.method-benefits {
  margin-bottom: 24px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 500;
}

.benefit-item i {
  color: #8b5cf6;
  width: 16px;
}

.method-timeline {
  display: flex;
  align-items: center;
  gap: 24px;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #9ca3af;
}

.timeline-item.active {
  color: #8b5cf6;
  font-weight: 600;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
}

.timeline-item.active .timeline-dot {
  background: #8b5cf6;
}

/* Return Process */
.return-process {
  padding: 80px 0;
  background: #f9fafb;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  margin-top: 48px;
}

.step-item {
  text-align: center;
}

.step-number {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 24px;
}

.step-content h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.step-content p {
  color: #6b7280;
  margin-bottom: 20px;
  line-height: 1.6;
}

.step-visual {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-order-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 200px;
}

.order-image {
  width: 32px;
  height: 32px;
  background: #e5e7eb;
  border-radius: 4px;
}

.order-details {
  flex: 1;
  text-align: left;
}

.order-title {
  height: 8px;
  background: #d1d5db;
  border-radius: 2px;
  margin-bottom: 4px;
}

.order-status {
  font-size: 10px;
  color: #15803d;
  font-weight: 600;
}

.return-btn-mini {
  background: #8b5cf6;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
}

.reason-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 180px;
}

.reason-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.reason-option.selected {
  border-color: #8b5cf6;
  background: #f3e8ff;
  color: #8b5cf6;
  font-weight: 600;
}

.refund-options {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.refund-option {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  position: relative;
  min-width: 80px;
}

.refund-option.featured-mini {
  border-color: #8b5cf6;
  background: #f3e8ff;
  color: #8b5cf6;
}

.bonus-tag {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #f59e0b;
  color: white;
  font-size: 8px;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

.success-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.checkmark {
  width: 48px;
  height: 48px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  animation: checkmarkPulse 2s ease-in-out infinite;
}

@keyframes checkmarkPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.success-text {
  font-size: 12px;
  font-weight: 600;
  color: #10b981;
}

/* Recent Orders Section */
.recent-orders-section {
  padding: 80px 0;
  background: white;
}

.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.order-card {
  background: white;
  border: 2px solid #f3f4f6;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.order-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.order-card.returnable {
  border-color: #22c55e;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.order-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-number {
  font-weight: 700;
  color: #1f2937;
}

.order-date {
  font-size: 14px;
  color: #6b7280;
}

.order-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-status.delivered {
  background: #dcfce7;
  color: #15803d;
}

.order-status.shipped {
  background: #dbeafe;
  color: #1d4ed8;
}

.order-items {
  margin-bottom: 20px;
}

.item-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.item-preview img {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
}

.more-items {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
}

.item-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-count {
  color: #6b7280;
  font-size: 14px;
}

.order-total {
  font-weight: 700;
  color: #1f2937;
  font-size: 16px;
}

.order-actions {
  display: flex;
  gap: 12px;
}

.return-button, .view-button, .track-button {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.return-button {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.return-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

.view-button, .track-button {
  background: #f3f4f6;
  color: #6b7280;
}

.view-button:hover, .track-button:hover {
  background: #e5e7eb;
  color: #374151;
}

.return-eligible-badge {
  position: absolute;
  top: -8px;
  right: 16px;
  background: #22c55e;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.return-expired {
  background: #fef2f2;
  color: #dc2626;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.view-all-orders {
  text-align: center;
}

.view-all-btn {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.view-all-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
}

/* FAQ Section */
.faq-section {
  padding: 80px 0;
  background: #f9fafb;
}

.faq-grid {
  display: grid;
  gap: 16px;
  margin-top: 48px;
}

.faq-item {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.faq-header {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-question {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.faq-arrow {
  color: #8b5cf6;
  transition: transform 0.3s ease;
}

.faq-arrow.open {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer.open {
  max-height: 200px;
}

.faq-answer p {
  padding: 0 24px 24px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 40px;
    text-align: center;
  }
  
  .methods-grid {
    grid-template-columns: 1fr;
  }
  
  .process-steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 20px;
  }
  
  .process-steps {
    grid-template-columns: 1fr;
  }
  
  .orders-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .returns-hero {
    padding: 40px 0 60px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .method-card, .order-card {
    padding: 20px;
  }
  
  .faq-header {
    padding: 20px;
  }
}
</style>
