<template>
  <div class="order-success-page">
    <!-- Success Animation Background -->
    <div class="success-background">
      <div class="floating-particles">
        <div v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></div>
      </div>
    </div>

    <div class="success-container">
      <!-- Success Icon with Animation -->
      <div class="success-icon-section">
        <div class="success-icon-wrapper">
          <div class="success-icon animated">
            <div class="checkmark-circle">
              <div class="checkmark"></div>
            </div>
          </div>
          <div class="success-ripples">
            <div class="ripple"></div>
            <div class="ripple"></div>
            <div class="ripple"></div>
          </div>
        </div>
      </div>

      <!-- Success Content -->
      <div class="success-content">
        <h1 class="success-title">Order Placed Successfully!</h1>
        <p class="success-subtitle">
          Thank you for shopping with us. Your order ID is 
          <span class="order-id">#{{ orderId }}</span>
        </p>

        <!-- Order Summary Card -->
        <div class="order-summary-card">
          <div class="summary-header">
            <div class="order-info">
              <h3 class="order-number">Order #{{ orderId }}</h3>
              <div class="order-date">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(orderDate) }}</span>
              </div>
            </div>
            <div class="order-status">
              <span class="status-badge success">
                <i class="fas fa-check"></i>
                Confirmed
              </span>
            </div>
          </div>

          <!-- Delivery Information -->
          <div class="delivery-section">
            <div class="delivery-card">
              <div class="delivery-icon">
                <i class="fas fa-truck"></i>
              </div>
              <div class="delivery-details">
                <h4>Estimated Delivery</h4>
                <p class="delivery-date">{{ formatDeliveryDate(estimatedDelivery) }}</p>
                <span class="delivery-time">{{ getDeliveryDays() }} business days</span>
              </div>
            </div>
          </div>

          <!-- Order Total -->
          <div class="order-total-section">
            <div class="total-breakdown">
              <div class="total-row">
                <span>Subtotal ({{ orderItems.length }} items)</span>
                <span>₹{{ orderSummary.subtotal.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span v-if="orderSummary.shipping === 0" class="free-badge">FREE</span>
                <span v-else>₹{{ orderSummary.shipping.toFixed(2) }}</span>
              </div>
              <div class="total-row">
                <span>Tax</span>
                <span>₹{{ orderSummary.tax.toFixed(2) }}</span>
              </div>
              <div v-if="orderSummary.discount > 0" class="total-row discount">
                <span>Discount</span>
                <span>-₹{{ orderSummary.discount.toFixed(2) }}</span>
              </div>
              <div class="total-divider"></div>
              <div class="total-row final">
                <span>Total Amount</span>
                <span>₹{{ orderSummary.total.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="payment-method-section">
            <div class="payment-card">
              <div class="payment-icon">
                <img v-if="paymentMethod.type !== 'cod'" :src="getPaymentLogo(paymentMethod.type)" :alt="paymentMethod.name" />
                <div v-else class="cod-icon">
                  <i class="fas fa-money-bill-wave"></i>
                </div>
              </div>
              <div class="payment-details">
                <h4 v-if="paymentMethod.type === 'cod'">Payment on Delivery</h4>
                <h4 v-else>Payment Successful</h4>
                <p>{{ paymentMethod.name }}</p>
                <span class="payment-status">
                  <i v-if="paymentMethod.type === 'cod'" class="fas fa-truck"></i>
                  <i v-else class="fas fa-shield-check"></i>
                  <span v-if="paymentMethod.type === 'cod'">Pay when you receive the order</span>
                  <span v-else>Secure payment processed</span>
                </span>
              </div>
              <div class="payment-badge" :class="{ 'cod-badge': paymentMethod.type === 'cod' }">
                <i v-if="paymentMethod.type === 'cod'" class="fas fa-clock"></i>
                <i v-else class="fas fa-check-circle"></i>
                <span v-if="paymentMethod.type === 'cod'">Pay on Delivery</span>
                <span v-else>Paid</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button @click="trackOrder" class="track-order-btn">
            <div class="btn-content">
              <div class="btn-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="btn-text">
                <span>Track Order</span>
                <small>Real-time updates</small>
              </div>
            </div>
            <i class="fas fa-arrow-right btn-arrow"></i>
          </button>

          <button @click="continueShopping" class="continue-shopping-btn">
            <div class="btn-content">
              <div class="btn-icon">
                <i class="fas fa-shopping-bag"></i>
              </div>
              <div class="btn-text">
                <span>Continue Shopping</span>
                <small>Discover more products</small>
              </div>
            </div>
          </button>
        </div>

        <!-- Additional Features -->
        <div class="additional-features">
          <div class="feature-card" @click="downloadInvoice">
            <div class="feature-icon">
              <i class="fas fa-download"></i>
            </div>
            <div class="feature-content">
              <h4>Download Invoice</h4>
              <p>Get your order receipt</p>
            </div>
          </div>

          <div class="feature-card" @click="shareOrder">
            <div class="feature-icon">
              <i class="fas fa-share-alt"></i>
            </div>
            <div class="feature-content">
              <h4>Share Order</h4>
              <p>Tell your friends</p>
            </div>
          </div>

          <div class="feature-card" @click="contactSupport">
            <div class="feature-icon">
              <i class="fas fa-headset"></i>
            </div>
            <div class="feature-content">
              <h4>Need Help?</h4>
              <p>Contact support</p>
            </div>
          </div>
        </div>

        <!-- Special Offer -->
        <div class="special-offer">
          <div class="offer-content">
            <div class="offer-icon">
              <i class="fas fa-gift"></i>
            </div>
            <div class="offer-text">
              <h4>🎉 Special Offer Just for You!</h4>
              <p>Get 15% off on your next order. Use code: <span class="offer-code">THANKYOU15</span></p>
            </div>
          </div>
          <button @click="claimOffer" class="claim-offer-btn">
            <i class="fas fa-tag"></i>
            Claim Offer
          </button>
        </div>
      </div>
    </div>

    <!-- Order Items Modal (Optional) -->
    <div v-if="showOrderItems" class="order-items-modal" @click="closeOrderItems">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Order Items</h3>
          <button @click="closeOrderItems" class="modal-close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="items-list">
            <div v-for="item in orderItems" :key="item.id" class="order-item">
              <img :src="item.image" :alt="item.name" class="item-image" />
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p>{{ item.brand }}</p>
                <div class="item-meta">
                  <span>Qty: {{ item.quantity }}</span>
                  <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confetti Animation -->
    <div class="confetti-container">
      <div v-for="n in 50" :key="n" class="confetti" :style="getConfettiStyle(n)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderConfirmation',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showOrderItems: false,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      
      // Mock order data - in real app this would come from store/API
      orderItems: [
        {
          id: 1,
          name: 'Luxury Moisturizing Face Cream',
          brand: 'GlowLux',
          price: 1299,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200'
        },
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          price: 899,
          quantity: 2,
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200'
        }
      ],
      
      orderSummary: {
        subtotal: 3097,
        shipping: 0,
        tax: 248,
        discount: 200,
        total: 3145
      },
      
      paymentMethod: {
        type: 'cod',
        name: 'Cash on Delivery'
      },
      
      // Payment logos mapping
      paymentLogos: {
        visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
        mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/200px-Mastercard-logo.svg.png',
        paytm: 'https://logos-world.net/wp-content/uploads/2020/12/Paytm-Logo.png',
        phonepe: 'https://logowik.com/content/uploads/images/phonepe6531.jpg',
        gpay: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Google_Pay_Logo_%282020%29.svg/200px-Google_Pay_Logo_%282020%29.svg.png',
        upi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/200px-UPI-Logo-vector.svg.png',
        card: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
        wallet: 'https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-200px.png',
        netbanking: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/200px-Visa_Inc._logo.svg.png',
        cod: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDIwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiMxMGI5ODEiLz4KPHN2ZyB4PSI0MCIgeT0iMjAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0xLjQxIDEyLjA5TDEwIDEwLjY4VjE3aDJWMTJoNHYtMkg4VjhoOHYyaC00djJoMS40MXoiLz4KPC9zdmc+Cjx0ZXh0IHg9IjExMCIgeT0iNTUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIj5DT0Q8L3RleHQ+Cjwvc3ZnPgo='
      }
    };
  },
  
  methods: {
    formatDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    },
    
    formatDeliveryDate(date) {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    },
    
    getDeliveryDays() {
      const diffTime = this.estimatedDelivery - this.orderDate;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    },
    
    getPaymentLogo(type) {
      return this.paymentLogos[type] || this.paymentLogos.visa;
    },
    
    trackOrder() {
      this.$router.push(`/order-tracking/${this.orderId}`);
    },
    
    continueShopping() {
      this.$router.push('/');
    },
    
    downloadInvoice() {
      // Simulate invoice download
      console.log('Downloading invoice for order:', this.orderId);
      // In real app, trigger download
    },
    
    shareOrder() {
      if (navigator.share) {
        navigator.share({
          title: 'My Order',
          text: `I just placed an order #${this.orderId}!`,
          url: window.location.href
        });
      } else {
        // Fallback for browsers without Web Share API
        navigator.clipboard.writeText(`Order #${this.orderId} - ${window.location.href}`);
        alert('Order link copied to clipboard!');
      }
    },
    
    contactSupport() {
      // Navigate to support or open chat
      console.log('Contacting support for order:', this.orderId);
    },
    
    claimOffer() {
      // Handle offer claim logic
      alert('Offer code THANKYOU15 copied to clipboard!');
      navigator.clipboard.writeText('THANKYOU15');
    },
    
    showOrderItemsModal() {
      this.showOrderItems = true;
    },
    
    closeOrderItems() {
      this.showOrderItems = false;
    },
    
    // Animation helper functions
    getParticleStyle(index) {
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 2;
      const animationDuration = Math.random() * 3 + 2;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDelay: `${animationDelay}s`,
        animationDuration: `${animationDuration}s`
      };
    },
    
    getConfettiStyle(index) {
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];
      const size = Math.random() * 8 + 4;
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const color = colors[Math.floor(Math.random() * colors.length)];

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        backgroundColor: color,
        animationDelay: `${animationDelay}s`
      };
    },

    getPaymentMethodFromCheckout() {
      // Check route query params or stored checkout data
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');
      return checkoutData.paymentMethod || 'cod';
    },

    getPaymentMethodName(paymentMethod = null) {
      const method = paymentMethod || this.getPaymentMethodFromCheckout();
      const methodNames = {
        'card': 'Credit/Debit Card',
        'upi': 'UPI Payment',
        'wallet': 'Digital Wallet',
        'netbanking': 'Net Banking',
        'cod': 'Cash on Delivery'
      };
      return methodNames[method] || 'Cash on Delivery';
    }
  },
  
  mounted() {
    // Set payment method from stored checkout data
    const checkoutData = JSON.parse(localStorage.getItem('checkoutData') || '{}');
    if (checkoutData.paymentMethod) {
      this.paymentMethod = {
        type: checkoutData.paymentMethod,
        name: this.getPaymentMethodName(checkoutData.paymentMethod)
      };
    }

    // Start animations after component mounts
    setTimeout(() => {
      const successIcon = document.querySelector('.success-icon');
      if (successIcon) {
        successIcon.classList.add('animate');
      }
    }, 500);

    // Trigger confetti after success animation
    setTimeout(() => {
      const confettiContainer = document.querySelector('.confetti-container');
      if (confettiContainer) {
        confettiContainer.classList.add('active');
      }
    }, 1500);
  }
};
</script>

<style scoped>
.order-success-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

/* Animated Background */
.success-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.floating-particles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float infinite ease-in-out;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.8;
  }
}

/* Main Container */
.success-container {
  background: white;
  border-radius: 24px;
  padding: 3rem 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Success Icon Section */
.success-icon-section {
  margin-bottom: 2rem;
}

.success-icon-wrapper {
  position: relative;
  display: inline-block;
}

.success-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  position: relative;
  opacity: 0;
  transform: scale(0);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.success-icon.animate {
  opacity: 1;
  transform: scale(1);
}

.checkmark-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.checkmark {
  width: 60px;
  height: 30px;
  border: 4px solid white;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  animation: checkmarkDraw 0.8s ease-in-out 0.5s forwards;
  opacity: 0;
}

@keyframes checkmarkDraw {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  50% {
    width: 30px;
    height: 0;
  }
  100% {
    width: 60px;
    height: 30px;
    opacity: 1;
  }
}

.success-ripples {
  position: absolute;
  inset: -20px;
}

.ripple {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: rippleEffect 2s infinite;
}

.ripple:nth-child(2) {
  animation-delay: 0.5s;
}

.ripple:nth-child(3) {
  animation-delay: 1s;
}

@keyframes rippleEffect {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Success Content */
.success-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.success-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.order-id {
  font-weight: 700;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-family: 'Monaco', 'Menlo', monospace;
}

/* Order Summary Card */
.order-summary-card {
  background: #f8fafc;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: left;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.order-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.order-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.875rem;
}

.status-badge.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

/* Delivery Section */
.delivery-section {
  margin-bottom: 2rem;
}

.delivery-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
}

.delivery-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.delivery-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.delivery-date {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.25rem;
}

.delivery-time {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
}

/* Order Total Section */
.order-total-section {
  margin-bottom: 2rem;
}

.total-breakdown {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.total-row:last-child {
  margin-bottom: 0;
}

.total-row span:first-child {
  color: #6b7280;
}

.total-row span:last-child {
  font-weight: 500;
  color: #374151;
}

.total-row.discount span:last-child {
  color: #10b981;
}

.total-row.final {
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
  padding-top: 1rem;
  margin-top: 1rem;
}

.total-divider {
  height: 2px;
  background: #e5e7eb;
  margin: 1rem 0;
}

.free-badge {
  background: #10b981;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Payment Method Section */
.payment-method-section {
  margin-bottom: 2rem;
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
}

.payment-icon {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.payment-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.payment-details {
  flex: 1;
}

.payment-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.payment-details p {
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.payment-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-size: 0.875rem;
  font-weight: 500;
}

.payment-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #ecfdf5;
  color: #059669;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
}

.payment-badge.cod-badge {
  background: #fef3c7;
  color: #d97706;
}

.cod-icon {
  width: 60px;
  height: 40px;
  background: linear-gradient(135deg, #059669, #34D399);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

/* Action Buttons */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 3rem;
}

.track-order-btn,
.continue-shopping-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 16px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.track-order-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.track-order-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.continue-shopping-btn {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.continue-shopping-btn:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
}

.continue-shopping-btn .btn-icon {
  background: #f8fafc;
  color: #667eea;
}

.btn-text span {
  font-weight: 600;
  font-size: 1rem;
  display: block;
  margin-bottom: 0.25rem;
}

.btn-text small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.btn-arrow {
  font-size: 1rem;
  opacity: 0.8;
}

/* Additional Features */
.additional-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.feature-card {
  padding: 1.5rem 1rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin: 0 auto 1rem;
}

.feature-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.feature-content p {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Special Offer */
.special-offer {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 20px;
  padding: 2rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.offer-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.offer-icon {
  font-size: 2rem;
}

.offer-text h4 {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.offer-text p {
  margin: 0;
  opacity: 0.9;
  font-size: 0.875rem;
}

.offer-code {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-family: 'Monaco', 'Menlo', monospace;
}

.claim-offer-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: white;
  color: #f59e0b;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.claim-offer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* Confetti Animation */
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti {
  position: absolute;
  top: -10px;
  opacity: 0;
  border-radius: 2px;
}

.confetti-container.active .confetti {
  animation: confettiFall 3s ease-out forwards;
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    transform: translateY(-100vh) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(100vh) rotate(720deg);
  }
}

/* Order Items Modal */
.order-items-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.modal-close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 2rem;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
}

.item-details {
  flex: 1;
}

.item-details h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.25rem;
}

.item-details p {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.item-price {
  font-weight: 600;
  color: #667eea;
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-success-page {
    padding: 1rem;
  }
  
  .success-container {
    padding: 2rem 1.5rem;
  }
  
  .success-title {
    font-size: 2rem;
  }
  
  .success-subtitle {
    font-size: 1rem;
  }
  
  .checkmark-circle {
    width: 100px;
    height: 100px;
  }
  
  .success-icon {
    width: 100px;
    height: 100px;
  }
  
  .checkmark {
    width: 50px;
    height: 25px;
  }
  
  .action-buttons {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .additional-features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .special-offer {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .summary-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .delivery-card,
  .payment-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .success-container {
    padding: 1.5rem 1rem;
  }
  
  .success-title {
    font-size: 1.75rem;
  }
  
  .order-summary-card {
    padding: 1.5rem;
  }
  
  .delivery-card,
  .payment-card {
    padding: 1rem;
  }
  
  .btn-content {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
  
  .track-order-btn,
  .continue-shopping-btn {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .btn-arrow {
    display: none;
  }
}
</style>
