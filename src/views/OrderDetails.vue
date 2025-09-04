<template>
  <div class="order-details-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="market-container">
        <div class="header-content">
          <button @click="goBackToOrders" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <div class="header-main">
            <h1 class="page-title">Order Details</h1>
            <p class="page-subtitle">Track your order and manage details</p>
          </div>
          <div class="header-spacer"></div>
        </div>
      </div>
    </div>

    <!-- Order Summary Section -->
    <div class="order-summary-section">
      <div class="market-container">
        <div class="summary-card">
          <div class="summary-header">
            <div class="order-meta">
              <h2 class="order-id">Order #{{ orderDetails.orderId }}</h2>
              <p class="order-date">{{ formatDate(orderDetails.orderDate) }}</p>
            </div>
            <div class="order-status-container">
              <span :class="['order-status-badge', getStatusClass(orderDetails.status)]">
                <i :class="getStatusIcon(orderDetails.status)"></i>
                {{ orderDetails.status }}
              </span>
              <button 
                v-if="canRequestRefund" 
                @click="showRefundModal = true"
                class="refund-button"
              >
                Request Refund
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Real-Time Tracking Section -->
    <div class="tracking-section" id="tracking-section">
      <div class="market-container">
        <div class="tracking-card">
          <h3 class="section-title">Order Tracking</h3>
          
          <!-- Map View (if order is in transit) -->
          <div v-if="orderDetails.status === 'Out for Delivery'" class="map-container">
            <div class="delivery-map">
              <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Live tracking map</p>
                <div class="delivery-agent">
                  <div class="agent-marker pulse">
                    <i class="fas fa-motorcycle"></i>
                  </div>
                  <span class="agent-info">Delivery Agent: {{ orderDetails.deliveryAgent }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Step-based Tracking Bar -->
          <div class="tracking-timeline">
            <div class="timeline-container">
              <div 
                v-for="(step, index) in trackingSteps" 
                :key="index"
                :class="['timeline-step', { 
                  active: step.status === 'completed',
                  current: step.status === 'current',
                  pending: step.status === 'pending'
                }]"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                  <div v-if="step.status === 'current'" class="pulse-ring"></div>
                </div>
                <div class="step-content">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p v-if="step.timestamp" class="step-timestamp">{{ step.timestamp }}</p>
                  <p v-else-if="step.status === 'current'" class="step-estimated">
                    {{ step.estimated }}
                  </p>
                </div>
                <div v-if="index < trackingSteps.length - 1" class="step-connector"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Items List -->
    <div class="order-items-section">
      <div class="market-container">
        <div class="items-card">
          <h3 class="section-title">Order Items</h3>
          <div class="items-list">
            <div 
              v-for="item in orderDetails.items" 
              :key="item.id"
              class="item-row"
            >
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-details">
                <h4 class="item-name">{{ item.name }}</h4>
                <p class="item-variant">{{ item.variant }}</p>
                <div class="item-meta">
                  <span class="item-quantity">Qty: {{ item.quantity }}</span>
                  <span class="item-price">₹{{ item.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address Section -->
    <div class="address-section">
      <div class="market-container">
        <div class="address-card">
          <div class="address-header">
            <h3 class="section-title">Delivery Address</h3>
            <button 
              v-if="canChangeAddress" 
              @click="changeAddress"
              class="change-address-button"
            >
              Change
            </button>
          </div>
          <div class="address-content">
            <div class="address-info">
              <h4 class="recipient-name">{{ orderDetails.deliveryAddress.name }}</h4>
              <p class="recipient-phone">+91 {{ orderDetails.deliveryAddress.phone }}</p>
              <p class="recipient-address">
                {{ orderDetails.deliveryAddress.street }}, 
                {{ orderDetails.deliveryAddress.city }}, 
                {{ orderDetails.deliveryAddress.state }} - {{ orderDetails.deliveryAddress.pincode }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Price Breakdown Section -->
    <div class="price-breakdown-section">
      <div class="market-container">
        <div class="breakdown-card">
          <h3 class="section-title">Price Breakdown</h3>
          <div class="breakdown-list">
            <div class="breakdown-item">
              <span class="breakdown-label">Item Subtotal</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.subtotal }}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Tax</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.tax }}</span>
            </div>
            <div v-if="orderDetails.pricing.discount > 0" class="breakdown-item discount">
              <span class="breakdown-label">Discount</span>
              <span class="breakdown-value">-₹{{ orderDetails.pricing.discount }}</span>
            </div>
            <div class="breakdown-item">
              <span class="breakdown-label">Shipping Fee</span>
              <span class="breakdown-value">
                {{ orderDetails.pricing.shipping === 0 ? 'FREE' : '₹' + orderDetails.pricing.shipping }}
              </span>
            </div>
            <div class="breakdown-divider"></div>
            <div class="breakdown-item total">
              <span class="breakdown-label">Total Amount Paid</span>
              <span class="breakdown-value">₹{{ orderDetails.pricing.total }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Action Buttons -->
    <div class="action-buttons">
      <div class="market-container">
        <div class="buttons-row">
          <button @click="scrollToTracking" class="action-button secondary">
            <i class="fas fa-map-marker-alt"></i>
            Track Order
          </button>
          <button @click="downloadInvoice" class="action-button primary">
            <i class="fas fa-download"></i>
            Download Invoice
          </button>
        </div>
      </div>
    </div>

    <!-- Refund Request Modal -->
    <div v-if="showRefundModal" class="modal-overlay" @click="closeRefundModal">
      <div class="refund-modal" @click.stop>
        <div class="modal-header">
          <h3>Request Refund</h3>
          <button @click="closeRefundModal" class="close-button">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitRefundRequest">
            <div class="form-group">
              <label for="refund-reason">Reason for Refund</label>
              <select id="refund-reason" v-model="refundForm.reason" required>
                <option value="">Select a reason</option>
                <option value="defective">Product is defective</option>
                <option value="damaged">Product arrived damaged</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="not-as-described">Not as described</option>
                <option value="late-delivery">Late delivery</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label for="refund-description">Additional Details</label>
              <textarea 
                id="refund-description" 
                v-model="refundForm.description"
                placeholder="Please provide more details about your refund request"
                rows="4"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Upload Photos (Optional)</label>
              <div class="photo-upload">
                <input 
                  type="file" 
                  ref="photoInput"
                  @change="handlePhotoUpload"
                  accept="image/*"
                  multiple
                  style="display: none"
                >
                <button 
                  type="button" 
                  @click="$refs.photoInput.click()"
                  class="upload-button"
                >
                  <i class="fas fa-camera"></i>
                  Add Photos
                </button>
                <div v-if="refundForm.photos.length > 0" class="uploaded-photos">
                  <div 
                    v-for="(photo, index) in refundForm.photos" 
                    :key="index"
                    class="photo-preview"
                  >
                    <img :src="photo.preview" :alt="photo.name" />
                    <button @click="removePhoto(index)" class="remove-photo">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeRefundModal" class="cancel-button">
                Cancel
              </button>
              <button type="submit" class="submit-button" :disabled="!refundForm.reason">
                Submit Refund Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="showToast" :class="['toast', toastType]">
      <i :class="toastIcon"></i>
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderDetails',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showRefundModal: false,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      refundForm: {
        reason: '',
        description: '',
        photos: []
      },
      orderDetails: {
        orderId: '12345',
        orderDate: '2024-01-15',
        status: 'Out for Delivery',
        deliveryAgent: 'Raj Kumar',
        items: [
          {
            id: 1,
            name: 'Lakme Absolute Perfect Radiance Serum',
            variant: 'Size: 30ml',
            quantity: 1,
            price: 1299,
            image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=150&h=150&fit=crop&crop=center'
          },
          {
            id: 2,
            name: 'Nykaa Matte to Last Liquid Lipstick',
            variant: 'Shade: Ruby Red',
            quantity: 2,
            price: 599,
            image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=150&h=150&fit=crop&crop=center'
          }
        ],
        deliveryAddress: {
          name: 'Rumpa Samanta',
          phone: '9876543210',
          street: '123 MG Road, Sector 14',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700001'
        },
        pricing: {
          subtotal: 2497,
          tax: 224,
          discount: 250,
          shipping: 0,
          total: 2471
        }
      }
    };
  },
  computed: {
    canRequestRefund() {
      return ['Delivered', 'Shipped'].includes(this.orderDetails.status);
    },
    canChangeAddress() {
      return !['Shipped', 'Out for Delivery', 'Delivered'].includes(this.orderDetails.status);
    },
    trackingSteps() {
      const allSteps = [
        {
          title: 'Order Placed',
          icon: 'fas fa-check-circle',
          timestamp: 'Jan 15, 2024 at 2:30 PM'
        },
        {
          title: 'Confirmed',
          icon: 'fas fa-clipboard-check',
          timestamp: 'Jan 15, 2024 at 3:15 PM'
        },
        {
          title: 'Shipped',
          icon: 'fas fa-shipping-fast',
          timestamp: 'Jan 16, 2024 at 10:00 AM'
        },
        {
          title: 'Out for Delivery',
          icon: 'fas fa-truck',
          estimated: 'Expected by 6:00 PM today'
        },
        {
          title: 'Delivered',
          icon: 'fas fa-home',
          estimated: null
        }
      ];

      const statusIndex = {
        'Processing': 0,
        'Confirmed': 1,
        'Shipped': 2,
        'Out for Delivery': 3,
        'Delivered': 4
      };

      const currentIndex = statusIndex[this.orderDetails.status] || 0;

      return allSteps.map((step, index) => ({
        ...step,
        status: index < currentIndex ? 'completed' : 
                index === currentIndex ? 'current' : 'pending'
      }));
    },
    toastIcon() {
      return this.toastType === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    }
  },
  mounted() {
    // Set the orderId from props when component is mounted
    if (this.orderId) {
      this.orderDetails.orderId = this.orderId;
    }
  },
  methods: {
    goBackToOrders() {
      this.$router.push('/orders');
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      const classes = {
        'Processing': 'processing',
        'Confirmed': 'confirmed',
        'Shipped': 'shipped',
        'Out for Delivery': 'out-for-delivery',
        'Delivered': 'delivered',
        'Cancelled': 'cancelled'
      };
      return classes[status] || 'processing';
    },
    getStatusIcon(status) {
      const icons = {
        'Processing': 'fas fa-clock',
        'Confirmed': 'fas fa-check',
        'Shipped': 'fas fa-shipping-fast',
        'Out for Delivery': 'fas fa-truck',
        'Delivered': 'fas fa-check-circle',
        'Cancelled': 'fas fa-times-circle'
      };
      return icons[status] || 'fas fa-clock';
    },
    scrollToTracking() {
      const element = document.getElementById('tracking-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },
    downloadInvoice() {
      // Simulate PDF download
      this.showToastMessage('Invoice downloaded successfully', 'success');
    },
    changeAddress() {
      this.$router.push('/select-address');
    },
    closeRefundModal() {
      this.showRefundModal = false;
      this.refundForm = {
        reason: '',
        description: '',
        photos: []
      };
    },
    handlePhotoUpload(event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.refundForm.photos.push({
              name: file.name,
              preview: e.target.result,
              file: file
            });
          };
          reader.readAsDataURL(file);
        }
      });
    },
    removePhoto(index) {
      this.refundForm.photos.splice(index, 1);
    },
    submitRefundRequest() {
      // Simulate refund request submission
      this.closeRefundModal();
      this.showToastMessage('Refund request submitted successfully', 'success');
      
      // Update order status if needed
      setTimeout(() => {
        this.orderDetails.status = 'Refund Requested';
      }, 1000);
    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      
      setTimeout(() => {
        this.showToast = false;
      }, 4000);
    }
  }
};
</script>

<style scoped>
.order-details-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf8f6 0%, #f8f4f6 100%);
  padding-top: 150px;
  padding-bottom: 100px;
}

/* Header Styles */
.page-header {
  background: linear-gradient(135deg, #fff 0%, #fef8f6 100%);
  border-bottom: 1px solid #f0e6e6;
  padding: 24px 0;
  margin-top: -150px;
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 2px solid #f0e6e6;
  border-radius: 12px;
  padding: 12px 16px;
  color: #8b4e9f;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.back-button:hover {
  background: #f8f4f6;
  border-color: #e0d0e0;
  transform: translateX(-2px);
}

.header-main {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0;
  background: linear-gradient(135deg, #8b4e9f 0%, #d946b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  color: #64748b;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.header-spacer {
  width: 120px;
}

/* Market Container */
.market-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Section Styles */
.order-summary-section,
.tracking-section,
.order-items-section,
.address-section,
.price-breakdown-section {
  padding: 24px 0;
}

.summary-card,
.tracking-card,
.items-card,
.address-card,
.breakdown-card {
  background: #fff;
  border-radius: 20px;
  border: 1px solid #f0e6e6;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(139, 78, 159, 0.1);
  transition: all 0.3s ease;
}

.summary-card:hover,
.tracking-card:hover,
.items-card:hover,
.address-card:hover,
.breakdown-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 48px rgba(139, 78, 159, 0.15);
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 24px 0;
}

/* Order Summary */
.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.order-id {
  font-size: 24px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 8px 0;
}

.order-date {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.order-status-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.order-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 25px;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-status-badge.processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.order-status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.order-status-badge.shipped {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.order-status-badge.out-for-delivery {
  background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%);
  color: #c2410c;
  border: 1px solid #f97316;
}

.order-status-badge.delivered {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 1px solid #22c55e;
}

.order-status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #ef4444;
}

.refund-button {
  background: #fff;
  border: 2px solid #8b4e9f;
  color: #8b4e9f;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refund-button:hover {
  background: #8b4e9f;
  color: #fff;
  transform: translateY(-2px);
}

/* Tracking Section */
.map-container {
  margin-bottom: 32px;
}

.delivery-map {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  border: 2px solid #bae6fd;
  overflow: hidden;
}

.map-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #0369a1;
  font-size: 18px;
  position: relative;
}

.map-placeholder i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.delivery-agent {
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.agent-marker {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
}

.agent-marker i {
  font-size: 16px;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.agent-info {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* Timeline Styles */
.timeline-container {
  display: flex;
  position: relative;
  gap: 0;
}

.timeline-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.timeline-step.completed .step-icon {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  border: 4px solid #dcfce7;
}

.timeline-step.current .step-icon {
  background: linear-gradient(135deg, #8b4e9f 0%, #7c3aed 100%);
  color: #fff;
  border: 4px solid #e9d5ff;
  animation: pulse-icon 2s infinite;
}

.timeline-step.pending .step-icon {
  background: #f8fafc;
  color: #94a3b8;
  border: 4px solid #e2e8f0;
}

@keyframes pulse-icon {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-ring {
  position: absolute;
  top: -8px;
  left: -8px;
  right: -8px;
  bottom: -8px;
  border: 2px solid #8b4e9f;
  border-radius: 50%;
  opacity: 0.7;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.step-content {
  text-align: center;
  max-width: 120px;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  color: #2d1b3d;
  margin: 0 0 8px 0;
}

.step-timestamp {
  font-size: 12px;
  color: #22c55e;
  margin: 0;
  font-weight: 500;
}

.step-estimated {
  font-size: 12px;
  color: #8b4e9f;
  margin: 0;
  font-weight: 500;
}

.timeline-step.pending .step-title {
  color: #94a3b8;
}

.step-connector {
  position: absolute;
  top: 32px;
  left: 50%;
  right: -50%;
  height: 4px;
  background: #e2e8f0;
  z-index: 1;
}

.timeline-step.completed .step-connector {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.timeline-step:last-child .step-connector {
  display: none;
}

/* Order Items */
.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-row {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.item-row:hover {
  background: #f8f4f6;
  border-color: #e9d5ff;
  transform: translateX(4px);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-name {
  font-size: 16px;
  font-weight: 600;
  color: #2d1b3d;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-variant {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-quantity {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #8b4e9f;
}

/* Address Section */
.address-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.change-address-button {
  background: #fff;
  border: 2px solid #8b4e9f;
  color: #8b4e9f;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.change-address-button:hover {
  background: #8b4e9f;
  color: #fff;
  transform: translateY(-2px);
}

.address-content {
  background: #fafafa;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.recipient-name {
  font-size: 18px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0 0 8px 0;
}

.recipient-phone {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.recipient-address {
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Price Breakdown */
.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.breakdown-label {
  color: #64748b;
  font-weight: 500;
}

.breakdown-value {
  font-weight: 600;
  color: #2d1b3d;
}

.breakdown-item.discount .breakdown-value {
  color: #22c55e;
}

.breakdown-divider {
  height: 2px;
  background: linear-gradient(90deg, #f0e6e6 0%, #e9d5ff 50%, #f0e6e6 100%);
  margin: 8px 0;
  border-radius: 1px;
}

.breakdown-item.total {
  font-size: 18px;
  font-weight: 700;
}

.breakdown-item.total .breakdown-label {
  color: #2d1b3d;
}

.breakdown-item.total .breakdown-value {
  color: #8b4e9f;
  font-size: 20px;
}

/* Action Buttons */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1px solid #f0e6e6;
  padding: 20px 0;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.buttons-row {
  display: flex;
  gap: 16px;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.secondary {
  background: #fff;
  border: 2px solid #8b4e9f;
  color: #8b4e9f;
}

.action-button.secondary:hover {
  background: #f8f4f6;
  transform: translateY(-2px);
}

.action-button.primary {
  background: linear-gradient(135deg, #8b4e9f 0%, #7c3aed 100%);
  border: 2px solid transparent;
  color: #fff;
}

.action-button.primary:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 78, 159, 0.3);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  padding: 20px;
}

.refund-modal {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32px 32px 0 32px;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 24px;
  font-weight: 700;
  color: #2d1b3d;
  margin: 0;
}

.close-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-content {
  padding: 0 32px 32px 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2d1b3d;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 16px;
  color: #374151;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b4e9f;
  box-shadow: 0 0 0 3px rgba(139, 78, 159, 0.1);
}

.photo-upload {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.upload-button:hover {
  border-color: #8b4e9f;
  color: #8b4e9f;
  background: #f8f4f6;
}

.uploaded-photos {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.photo-preview {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
}

.remove-photo:hover {
  background: rgba(0, 0, 0, 0.9);
}

.modal-actions {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.cancel-button {
  flex: 1;
  padding: 16px 24px;
  border: 2px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.submit-button {
  flex: 2;
  padding: 16px 24px;
  background: linear-gradient(135deg, #8b4e9f 0%, #7c3aed 100%);
  color: #fff;
  border: 2px solid transparent;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 78, 159, 0.3);
}

.submit-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Toast Notification */
.toast {
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 8px 32px rgba(34, 197, 94, 0.3);
  z-index: 1001;
  animation: toastSlideIn 0.3s ease;
}

.toast.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 8px 32px rgba(239, 68, 68, 0.3);
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .order-details-page {
    padding-top: 120px;
  }

  .page-header {
    margin-top: -120px;
  }

  .market-container {
    padding: 0 16px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .order-status-container {
    width: 100%;
    justify-content: space-between;
  }

  .timeline-container {
    flex-direction: column;
    gap: 20px;
  }

  .timeline-step {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }

  .step-icon {
    margin-bottom: 0;
    margin-right: 16px;
    flex-shrink: 0;
  }

  .step-content {
    text-align: left;
    max-width: none;
    flex: 1;
  }

  .step-connector {
    display: none;
  }

  .item-row {
    gap: 12px;
    padding: 16px;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .item-name {
    font-size: 14px;
  }

  .breakdown-item {
    font-size: 14px;
  }

  .breakdown-item.total {
    font-size: 16px;
  }

  .breakdown-item.total .breakdown-value {
    font-size: 18px;
  }

  .buttons-row {
    flex-direction: column;
  }

  .action-button {
    font-size: 14px;
    padding: 14px 20px;
  }

  .modal-overlay {
    padding: 16px;
  }

  .modal-header,
  .modal-content {
    padding-left: 24px;
    padding-right: 24px;
  }

  .modal-header {
    padding-top: 24px;
  }

  .modal-content {
    padding-bottom: 24px;
  }

  .uploaded-photos {
    gap: 8px;
  }

  .photo-preview {
    width: 60px;
    height: 60px;
  }

  .toast {
    right: 16px;
    left: 16px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .order-id {
    font-size: 20px;
  }

  .summary-card,
  .tracking-card,
  .items-card,
  .address-card,
  .breakdown-card {
    padding: 20px;
    border-radius: 16px;
  }

  .section-title {
    font-size: 18px;
    margin-bottom: 20px;
  }

  .step-icon {
    width: 48px;
    height: 48px;
  }

  .order-status-badge {
    padding: 10px 16px;
    font-size: 13px;
  }

  .delivery-map {
    height: 160px;
  }

  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .change-address-button,
  .refund-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
