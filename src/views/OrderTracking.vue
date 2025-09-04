<template>
  <div class="order-tracking-page">
    <div class="container">
      <div class="tracking-header">
        <button @click="goBack" class="back-btn">
          <i class="fas fa-arrow-left"></i>
          Back to Orders
        </button>
        <h1>Track Your Order</h1>
        <p>Order #{{ orderId }}</p>
      </div>

      <div class="tracking-content">
        <!-- Live Tracking Map -->
        <div class="tracking-map-section">
          <div class="map-container">
            <div class="live-tracking-map">
              <!-- Simulated Map Display -->
              <div class="map-placeholder">
                <div class="delivery-route">
                  <div class="route-point origin">
                    <i class="fas fa-warehouse"></i>
                    <span>Warehouse</span>
                  </div>
                  <div class="route-line"></div>
                  <div class="route-point current" :class="{ active: currentLocation.moving }">
                    <i class="fas fa-truck"></i>
                    <span>{{ currentLocation.name }}</span>
                  </div>
                  <div class="route-line pending"></div>
                  <div class="route-point destination">
                    <i class="fas fa-home"></i>
                    <span>Your Address</span>
                  </div>
                </div>
                
                <div class="live-status">
                  <div class="status-indicator" :class="deliveryStatus.toLowerCase()">
                    <i :class="getStatusIcon()"></i>
                  </div>
                  <div class="status-text">
                    <h3>{{ deliveryStatus }}</h3>
                    <p>{{ statusMessage }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Live Updates -->
            <div class="live-updates">
              <div class="update-header">
                <h3>Live Updates</h3>
                <div class="auto-refresh">
                  <i class="fas fa-sync-alt" :class="{ spinning: isRefreshing }"></i>
                  <span>Auto-refreshing</span>
                </div>
              </div>
              
              <div class="updates-timeline">
                <div 
                  v-for="update in liveUpdates" 
                  :key="update.id"
                  class="update-item"
                  :class="{ latest: update.isLatest }"
                >
                  <div class="update-time">{{ formatTime(update.timestamp) }}</div>
                  <div class="update-content">
                    <div class="update-icon">
                      <i :class="update.icon"></i>
                    </div>
                    <div class="update-details">
                      <h4>{{ update.title }}</h4>
                      <p>{{ update.description }}</p>
                      <span v-if="update.location" class="update-location">
                        <i class="fas fa-map-marker-alt"></i>
                        {{ update.location }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Progress -->
        <div class="order-progress-section">
          <h2>Order Progress</h2>
          
          <div class="progress-timeline">
            <div 
              v-for="(step, index) in orderSteps" 
              :key="step.id"
              class="progress-step"
              :class="{ 
                completed: step.completed, 
                current: step.current, 
                pending: !step.completed && !step.current 
              }"
            >
              <div class="step-indicator">
                <div class="step-circle">
                  <i v-if="step.completed" class="fas fa-check"></i>
                  <i v-else-if="step.current" :class="step.icon"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <div v-if="index < orderSteps.length - 1" class="step-connector"></div>
              </div>
              
              <div class="step-content">
                <h3>{{ step.title }}</h3>
                <p>{{ step.description }}</p>
                <div class="step-details">
                  <span v-if="step.completedAt" class="completion-time">
                    {{ formatDateTime(step.completedAt) }}
                  </span>
                  <span v-else-if="step.estimatedAt" class="estimated-time">
                    Estimated: {{ formatDateTime(step.estimatedAt) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Details -->
        <div class="delivery-details-section">
          <div class="details-grid">
            <div class="detail-card">
              <div class="card-header">
                <i class="fas fa-truck"></i>
                <h3>Delivery Information</h3>
              </div>
              <div class="card-content">
                <div class="info-row">
                  <span class="label">Estimated Delivery:</span>
                  <span class="value">{{ formatDateTime(order.estimatedDelivery) }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Delivery Method:</span>
                  <span class="value">{{ order.deliveryMethod }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Carrier:</span>
                  <span class="value">{{ order.carrier }}</span>
                </div>
                <div class="info-row">
                  <span class="label">Tracking Number:</span>
                  <span class="value tracking-number">
                    {{ order.trackingNumber }}
                    <button @click="copyTrackingNumber" class="copy-btn">
                      <i class="fas fa-copy"></i>
                    </button>
                  </span>
                </div>
              </div>
            </div>
            
            <div class="detail-card">
              <div class="card-header">
                <i class="fas fa-map-marker-alt"></i>
                <h3>Delivery Address</h3>
              </div>
              <div class="card-content">
                <div class="address-display">
                  <p class="recipient">{{ order.deliveryAddress.name }}</p>
                  <p>{{ order.deliveryAddress.street }}</p>
                  <p>{{ order.deliveryAddress.city }}, {{ order.deliveryAddress.state }} {{ order.deliveryAddress.zipCode }}</p>
                  <p>{{ order.deliveryAddress.phone }}</p>
                </div>
                <button @click="editDeliveryAddress" class="edit-address-btn">
                  <i class="fas fa-edit"></i>
                  Edit Address
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Delivery Options -->
        <div class="delivery-options-section">
          <h3>Delivery Options</h3>
          <div class="options-grid">
            <div class="option-card">
              <div class="option-icon">
                <i class="fas fa-calendar-alt"></i>
              </div>
              <div class="option-content">
                <h4>Reschedule Delivery</h4>
                <p>Change your delivery date and time</p>
                <button @click="rescheduleDelivery" class="option-btn">
                  Reschedule
                </button>
              </div>
            </div>
            
            <div class="option-card">
              <div class="option-icon">
                <i class="fas fa-comment-alt"></i>
              </div>
              <div class="option-content">
                <h4>Delivery Instructions</h4>
                <p>Add special instructions for delivery</p>
                <button @click="addInstructions" class="option-btn">
                  Add Instructions
                </button>
              </div>
            </div>
            
            <div class="option-card">
              <div class="option-icon">
                <i class="fas fa-phone"></i>
              </div>
              <div class="option-content">
                <h4>Contact Driver</h4>
                <p>Call or message your delivery driver</p>
                <button @click="contactDriver" class="option-btn">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Items -->
        <div class="order-items-section">
          <h3>Items in This Order</h3>
          <div class="items-list">
            <div v-for="item in order.items" :key="item.id" class="order-item">
              <img :src="item.image" :alt="item.name" class="item-image">
              <div class="item-details">
                <h4>{{ item.name }}</h4>
                <p class="item-brand">{{ item.brand }}</p>
                <div class="item-meta">
                  <span class="quantity">Qty: {{ item.quantity }}</span>
                  <span class="price">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
              <div class="item-actions">
                <button @click="writeReview(item)" class="review-btn">
                  <i class="fas fa-star"></i>
                  Review
                </button>
                <button @click="buyAgain(item)" class="buy-again-btn">
                  <i class="fas fa-redo"></i>
                  Buy Again
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button v-if="canCancelOrder" @click="cancelOrder" class="btn-danger">
            <i class="fas fa-times"></i>
            Cancel Order
          </button>
          
          <button v-if="canReturnOrder" @click="returnOrder" class="btn-secondary">
            <i class="fas fa-undo"></i>
            Return Items
          </button>
          
          <button @click="downloadInvoice" class="btn-outline">
            <i class="fas fa-download"></i>
            Download Invoice
          </button>
          
          <button @click="needHelp" class="btn-primary">
            <i class="fas fa-headset"></i>
            Need Help?
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'OrderTracking',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isRefreshing: false,
      refreshInterval: null,
      deliveryStatus: 'Out for Delivery',
      statusMessage: 'Your package is on the way and will arrive soon!',
      currentLocation: {
        name: 'Downtown Distribution Center',
        moving: true
      },
      order: {
        id: this.orderId,
        estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000), // +4 hours
        deliveryMethod: 'Standard Delivery',
        carrier: 'Beauty Express',
        trackingNumber: 'BE123456789US',
        deliveryAddress: {
          name: 'Rumpa Samanta',
          street: '123 Beauty Lane, Apt 4B',
          city: 'Los Angeles',
          state: 'California',
          zipCode: '90210',
          phone: '+1 234-567-8900'
        },
        items: [
          {
            id: 1,
            name: 'Luxury Moisturizing Face Cream',
            brand: 'GlowLux',
            price: 89.99,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200'
          },
          {
            id: 2,
            name: 'Vitamin C Brightening Serum',
            brand: 'VitaGlow',
            price: 65.00,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200'
          }
        ]
      },
      orderSteps: [
        {
          id: 1,
          title: 'Order Confirmed',
          description: 'Your order has been received and confirmed',
          icon: 'fas fa-check-circle',
          completed: true,
          current: false,
          completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 2,
          title: 'Processing',
          description: 'Your items are being prepared for shipment',
          icon: 'fas fa-cog',
          completed: true,
          current: false,
          completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 3,
          title: 'Shipped',
          description: 'Your package has left our facility',
          icon: 'fas fa-shipping-fast',
          completed: true,
          current: false,
          completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
        },
        {
          id: 4,
          title: 'Out for Delivery',
          description: 'Your package is on the delivery truck',
          icon: 'fas fa-truck',
          completed: false,
          current: true,
          estimatedAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        },
        {
          id: 5,
          title: 'Delivered',
          description: 'Your package has been delivered',
          icon: 'fas fa-home',
          completed: false,
          current: false,
          estimatedAt: new Date(Date.now() + 4 * 60 * 60 * 1000)
        }
      ],
      liveUpdates: [
        {
          id: 1,
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          title: 'Package loaded for delivery',
          description: 'Your package has been loaded onto the delivery vehicle',
          icon: 'fas fa-truck',
          location: 'Downtown Distribution Center',
          isLatest: true
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          title: 'Arrived at local facility',
          description: 'Package has arrived at the local distribution center',
          icon: 'fas fa-warehouse',
          location: 'Los Angeles Distribution Center'
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          title: 'Package shipped',
          description: 'Your package has departed from our fulfillment center',
          icon: 'fas fa-shipping-fast',
          location: 'Beauty Express Fulfillment Center'
        }
      ]
    };
  },
  computed: {
    canCancelOrder() {
      return this.orderSteps.findIndex(step => step.current) <= 1;
    },
    canReturnOrder() {
      return this.orderSteps.some(step => step.title === 'Delivered' && step.completed);
    }
  },
  methods: {
    ...mapActions('ui', ['showNotification']),
    goBack() {
      this.$router.push('/orders');
    },
    formatTime(date) {
      return new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    formatDateTime(date) {
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    getStatusIcon() {
      const icons = {
        'processing': 'fas fa-cog',
        'shipped': 'fas fa-shipping-fast',
        'out for delivery': 'fas fa-truck',
        'delivered': 'fas fa-check-circle'
      };
      return icons[this.deliveryStatus.toLowerCase()] || 'fas fa-package';
    },
    copyTrackingNumber() {
      navigator.clipboard.writeText(this.order.trackingNumber);
      this.showNotification({
        type: 'success',
        message: 'Tracking number copied to clipboard!'
      });
    },
    editDeliveryAddress() {
      // Implementation for editing delivery address
      console.log('Edit delivery address');
    },
    rescheduleDelivery() {
      // Implementation for rescheduling delivery
      console.log('Reschedule delivery');
    },
    addInstructions() {
      // Implementation for adding delivery instructions
      console.log('Add delivery instructions');
    },
    contactDriver() {
      // Implementation for contacting driver
      console.log('Contact driver');
    },
    writeReview(item) {
      this.$router.push(`/review/${item.id}`);
    },
    buyAgain(item) {
      // Implementation for buying again
      console.log('Buy again:', item.name);
    },
    cancelOrder() {
      // Implementation for canceling order
      console.log('Cancel order');
    },
    returnOrder() {
      this.$router.push(`/return/${this.orderId}`);
    },
    downloadInvoice() {
      // Implementation for downloading invoice
      console.log('Download invoice');
    },
    needHelp() {
      // Implementation for help/support
      console.log('Need help');
    },
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        this.isRefreshing = true;
        // Simulate fetching new updates
        setTimeout(() => {
          this.isRefreshing = false;
          // Add new update occasionally
          if (Math.random() > 0.7) {
            this.addNewUpdate();
          }
        }, 1000);
      }, 30000); // Refresh every 30 seconds
    },
    addNewUpdate() {
      const newUpdate = {
        id: Date.now(),
        timestamp: new Date(),
        title: 'Location update',
        description: 'Package is moving closer to your destination',
        icon: 'fas fa-map-marker-alt',
        location: 'En route to delivery address',
        isLatest: true
      };
      
      // Remove isLatest from previous updates
      this.liveUpdates.forEach(update => {
        update.isLatest = false;
      });
      
      this.liveUpdates.unshift(newUpdate);
      
      // Keep only last 10 updates
      if (this.liveUpdates.length > 10) {
        this.liveUpdates = this.liveUpdates.slice(0, 10);
      }
    }
  },
  mounted() {
    this.startAutoRefresh();
  },
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
};
</script>

<style scoped>
.order-tracking-page {
  padding: 40px 0;
  min-height: 100vh;
  background: var(--gray-50);
}

.tracking-header {
  text-align: center;
  margin-bottom: 40px;
}

.back-btn {
  background: none;
  border: none;
  color: var(--primary-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto 20px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.back-btn:hover {
  background: var(--primary-50);
}

.tracking-header h1 {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 8px;
}

.tracking-header p {
  font-size: 18px;
  color: var(--gray-600);
  font-family: monospace;
}

.tracking-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.tracking-map-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.map-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 32px;
}

.live-tracking-map {
  position: relative;
  min-height: 300px;
  background: var(--gray-100);
  border-radius: 12px;
  overflow: hidden;
}

.map-placeholder {
  position: relative;
  height: 100%;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.delivery-route {
  display: flex;
  align-items: center;
  gap: 40px;
  position: relative;
}

.route-point {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.route-point i {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
}

.route-point.origin i {
  background: var(--gray-500);
}

.route-point.current i {
  background: var(--primary-500);
  animation: pulse 2s infinite;
}

.route-point.current.active i {
  animation: pulse 1s infinite, bounce 2s infinite;
}

.route-point.destination i {
  background: var(--success-500);
}

.route-point span {
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
}

.route-line {
  width: 80px;
  height: 3px;
  background: var(--primary-500);
  position: relative;
}

.route-line.pending {
  background: var(--gray-300);
}

.live-status {
  position: absolute;
  top: 20px;
  left: 20px;
  background: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-indicator {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.status-indicator.processing {
  background: var(--warning-500);
}

.status-indicator.shipped {
  background: var(--primary-500);
}

.status-indicator.out.for.delivery {
  background: var(--success-500);
}

.status-text h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.status-text p {
  font-size: 14px;
  color: var(--gray-600);
}

.live-updates {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
}

.update-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.update-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
}

.auto-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--gray-500);
}

.auto-refresh i.spinning {
  animation: spin 1s linear infinite;
}

.updates-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.update-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.update-item.latest {
  background: var(--primary-50);
  border: 1px solid var(--primary-200);
}

.update-time {
  font-size: 11px;
  color: var(--gray-500);
  font-weight: 500;
  min-width: 50px;
}

.update-content {
  display: flex;
  gap: 12px;
  flex: 1;
}

.update-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--primary-500);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 10px;
  flex-shrink: 0;
}

.update-details h4 {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.update-details p {
  font-size: 12px;
  color: var(--gray-600);
  margin-bottom: 4px;
}

.update-location {
  font-size: 11px;
  color: var(--gray-500);
  display: flex;
  align-items: center;
  gap: 4px;
}

.order-progress-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.order-progress-section h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 32px;
}

.progress-timeline {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.progress-step {
  display: flex;
  gap: 20px;
  position: relative;
}

.step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.completed .step-circle {
  background: var(--success-500);
  color: white;
}

.progress-step.current .step-circle {
  background: var(--primary-500);
  color: white;
  animation: pulse 2s infinite;
}

.progress-step.pending .step-circle {
  background: var(--gray-200);
  color: var(--gray-500);
}

.step-connector {
  width: 2px;
  height: 24px;
  background: var(--gray-300);
  margin-top: 8px;
}

.progress-step.completed .step-connector {
  background: var(--success-500);
}

.step-content {
  flex: 1;
  padding-top: 8px;
}

.step-content h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.step-content p {
  color: var(--gray-600);
  margin-bottom: 8px;
}

.step-details {
  font-size: 14px;
}

.completion-time {
  color: var(--success-600);
  font-weight: 500;
}

.estimated-time {
  color: var(--gray-500);
}

.delivery-details-section {
  margin-bottom: 32px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.detail-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-header i {
  font-size: 20px;
  color: var(--primary-500);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-800);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.label {
  color: var(--gray-600);
}

.value {
  color: var(--gray-800);
  font-weight: 500;
}

.tracking-number {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: monospace;
}

.copy-btn {
  background: none;
  border: none;
  color: var(--primary-500);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.copy-btn:hover {
  background: var(--primary-50);
}

.address-display p {
  margin-bottom: 4px;
  color: var(--gray-600);
}

.recipient {
  font-weight: 600;
  color: var(--gray-800) !important;
}

.edit-address-btn {
  background: var(--primary-100);
  color: var(--primary-600);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  transition: background-color 0.2s ease;
}

.edit-address-btn:hover {
  background: var(--primary-200);
}

.delivery-options-section,
.order-items-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.delivery-options-section h3,
.order-items-section h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 24px;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.option-card {
  background: var(--gray-50);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  transition: all 0.2s ease;
}

.option-card:hover {
  background: var(--gray-100);
}

.option-icon {
  width: 40px;
  height: 40px;
  background: var(--primary-500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  flex-shrink: 0;
}

.option-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.option-content p {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 12px;
}

.option-btn {
  background: var(--primary-500);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.option-btn:hover {
  background: var(--primary-600);
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--gray-50);
  border-radius: 12px;
  align-items: center;
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
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.item-brand {
  font-size: 14px;
  color: var(--gray-600);
  margin-bottom: 8px;
}

.item-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.quantity {
  color: var(--gray-600);
}

.price {
  font-weight: 600;
  color: var(--primary-600);
}

.item-actions {
  display: flex;
  gap: 8px;
}

.review-btn,
.buy-again-btn {
  background: var(--primary-100);
  color: var(--primary-600);
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.2s ease;
}

.review-btn:hover,
.buy-again-btn:hover {
  background: var(--primary-200);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-outline,
.btn-danger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary-500);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-600);
}

.btn-secondary {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
}

.btn-secondary:hover {
  background: var(--gray-200);
}

.btn-outline {
  background: transparent;
  color: var(--primary-600);
  border: 2px solid var(--primary-500);
}

.btn-outline:hover {
  background: var(--primary-50);
}

.btn-danger {
  background: var(--error-500);
  color: white;
}

.btn-danger:hover {
  background: var(--error-600);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .map-container {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .order-tracking-page {
    padding: 20px 0;
  }
  
  .tracking-map-section,
  .order-progress-section,
  .delivery-options-section,
  .order-items-section {
    padding: 20px;
  }
  
  .delivery-route {
    flex-direction: column;
    gap: 20px;
  }
  
  .route-line {
    width: 2px;
    height: 40px;
    transform: rotate(90deg);
  }
  
  .progress-step {
    flex-direction: column;
    text-align: center;
  }
  
  .step-connector {
    width: 24px;
    height: 2px;
    margin-top: 0;
    margin-left: 8px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>
