<template>
  <div class="order-details-container">
    
    <!-- Header -->
    <div class="header-section">
      <button @click="goBack" class="back-btn">
        <i class="fas fa-arrow-left"></i> Back
      </button>
      <div>
        <h1>Order Details</h1>
        <p>Track your order and manage details</p>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="summary-header">
        <div>
          <h2>Order #{{ orderData.id }}</h2>
          <p>{{ formatDate(orderData.date) }}</p>
        </div>
        <div class="status-section">
          <span :class="['status-badge', getStatusClass(orderData.status)]">
            <i :class="getStatusIcon(orderData.status)"></i>
            {{ orderData.status }}
          </span>
          <!-- Refund Button - Only for delivered orders -->
          <button 
            v-if="orderData.status === 'Delivered'" 
            @click="requestRefund"
            class="refund-btn"
          >
            <i class="fas fa-undo"></i>
            Request Refund
          </button>
        </div>
      </div>
    </div>

    <!-- Order Items -->
    <div class="order-items">
      <h3>Order Items</h3>
      <div class="items-list">
        <div 
          v-for="item in orderData.items" 
          :key="item.id"
          class="item-card"
        >
          <div class="item-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p class="item-brand">{{ item.brand }}</p>
            <div class="item-meta">
              <span>Qty: {{ item.quantity }}</span>
              <span class="item-price">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="delivery-address">
      <h3>Delivery Address</h3>
      <div class="address-content">
        <h4>{{ orderData.deliveryAddress.name }}</h4>
        <p>+91 {{ orderData.deliveryAddress.phone }}</p>
        <p>
          {{ orderData.deliveryAddress.street }}, 
          {{ orderData.deliveryAddress.city }}, 
          {{ orderData.deliveryAddress.state }} - {{ orderData.deliveryAddress.pincode }}
        </p>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="price-breakdown">
      <h3>Price Breakdown</h3>
      <div class="breakdown-list">
        <div class="breakdown-item">
          <span>Item Subtotal</span>
          <span>₹{{ orderData.pricing.subtotal.toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>Tax</span>
          <span>₹{{ orderData.pricing.tax.toFixed(2) }}</span>
        </div>
        <div v-if="orderData.pricing.discount > 0" class="breakdown-item">
          <span>Discount</span>
          <span class="discount">-₹{{ orderData.pricing.discount.toFixed(2) }}</span>
        </div>
        <div class="breakdown-item">
          <span>Shipping Fee</span>
          <span>{{ orderData.pricing.shipping === 0 ? 'FREE' : '₹' + orderData.pricing.shipping.toFixed(2) }}</span>
        </div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total">
          <span>Total Amount Paid</span>
          <span>₹{{ orderData.pricing.total.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- Refund Request Modal -->
    <div v-if="showRefundModal" class="modal-overlay" @click="closeRefundModal">
      <div class="refund-modal" @click.stop>
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-section">
            <h2 class="modal-title">Refund Request</h2>
            <p class="modal-subtitle">Only eligible delivered items can be refunded.</p>
          </div>
          <button @click="closeRefundModal" class="modal-close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <!-- Order Information -->
          <div class="order-info-section">
            <div class="order-meta">
              <div class="order-detail">
                <span class="label">Order ID:</span>
                <span class="value">#{{ orderData.id }}</span>
              </div>
              <div class="order-detail">
                <span class="label">Delivery Date:</span>
                <span class="value">{{ formatDate(orderData.date) }}</span>
              </div>
            </div>
          </div>

          <!-- Refundable Items -->
          <div class="refundable-items-section">
            <h3 class="section-title">Select Items to Refund</h3>
            <div class="refundable-items">
              <div
                v-for="item in orderData.items"
                :key="item.id"
                class="refund-item"
                :class="{ selected: refundForm.selectedItems.includes(item.id) }"
                @click="toggleItemSelection(item.id)"
              >
                <div class="item-checkbox">
                  <input
                    type="checkbox"
                    :checked="refundForm.selectedItems.includes(item.id)"
                    @change="toggleItemSelection(item.id)"
                  >
                </div>
                <div class="item-image-small">
                  <img :src="item.image" :alt="item.name">
                </div>
                <div class="item-info">
                  <h4 class="item-name">{{ item.name }}</h4>
                  <p class="item-brand">{{ item.brand }}</p>
                  <div class="item-details-row">
                    <span class="item-qty">Qty: {{ item.quantity }}</span>
                    <span class="item-price-bold">₹{{ (item.price * item.quantity).toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Refund Form -->
          <div class="refund-form-section">
            <div class="form-group">
              <label for="refund-reason" class="form-label">Reason for Refund *</label>
              <select
                id="refund-reason"
                v-model="refundForm.reason"
                class="form-select"
                required
              >
                <option value="">Select a reason</option>
                <option value="defective">Product is defective</option>
                <option value="damaged">Product arrived damaged</option>
                <option value="wrong-item">Wrong item received</option>
                <option value="not-as-described">Not as described</option>
                <option value="allergic-reaction">Allergic reaction</option>
                <option value="changed-mind">Changed my mind</option>
                <option value="quality-issues">Quality issues</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="form-group">
              <label for="refund-note" class="form-label">Additional Notes (Optional)</label>
              <textarea
                id="refund-note"
                v-model="refundForm.note"
                class="form-textarea"
                placeholder="Please provide more details about your refund request..."
                rows="4"
              ></textarea>
            </div>
          </div>

          <!-- Refund Amount Summary -->
          <div class="refund-summary-section">
            <div class="refund-summary-card">
              <h3 class="summary-title">Refund Amount</h3>
              <div class="amount-breakdown">
                <div class="amount-row">
                  <span>Items Subtotal:</span>
                  <span>₹{{ calculateRefundAmount().subtotal.toFixed(2) }}</span>
                </div>
                <div class="amount-row">
                  <span>Tax (refundable):</span>
                  <span>₹{{ calculateRefundAmount().tax.toFixed(2) }}</span>
                </div>
                <div class="amount-divider"></div>
                <div class="amount-row total-amount">
                  <span>Total Refund Amount:</span>
                  <span class="refund-total">���{{ calculateRefundAmount().total.toFixed(2) }}</span>
                </div>
              </div>
              <p class="refund-notice">
                <i class="fas fa-info-circle"></i>
                Refund will be processed to your original payment method within 5-7 business days.
              </p>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <button @click="closeRefundModal" class="btn-secondary">
              Cancel
            </button>
            <button
              @click="submitRefundRequest"
              :disabled="!canSubmitRefund"
              class="btn-primary"
              :class="{ disabled: !canSubmitRefund }"
            >
              <i class="fas fa-paper-plane"></i>
              Submit Refund Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay success-modal-overlay" @click="closeSuccessModal">
      <div class="success-modal" @click.stop>
        <div class="success-content">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h2 class="success-title">Refund Request Submitted!</h2>
          <p class="success-message">
            Your refund request has been submitted. We'll notify you once it's processed.
          </p>
          <div class="success-details">
            <div class="detail-row">
              <span class="detail-label">Request ID:</span>
              <span class="detail-value">#{{ refundRequestId }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Expected Processing:</span>
              <span class="detail-value">5-7 business days</span>
            </div>
          </div>
          <button @click="closeSuccessModal" class="btn-primary success-btn">
            Got it
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'OrderDetailsWorking',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      orderData: null,
      showRefundModal: false,
      showSuccessModal: false,
      refundRequestId: '',
      refundForm: {
        selectedItems: [],
        reason: '',
        note: ''
      },
      // Mock orders data - same as in Orders page
      orders: [
        {
          id: '10234',
          date: new Date('2024-01-15'),
          status: 'Delivered',
          total: 2499,
          items: [
            {
              id: 1,
              name: 'Luxury Moisturizing Face Cream',
              brand: 'GlowLux',
              image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300',
              price: 1299,
              quantity: 1
            },
            {
              id: 2,
              name: 'Vitamin C Brightening Serum',
              brand: 'VitaGlow',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 899,
              quantity: 1
            },
            {
              id: 3,
              name: 'Gentle Foaming Cleanser',
              brand: 'PureClean',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 599,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 2797,
            tax: 252,
            discount: 300,
            shipping: 0,
            total: 2499
          }
        },
        {
          id: '10233',
          date: new Date('2024-01-12'),
          status: 'Processing',
          total: 1899,
          items: [
            {
              id: 4,
              name: 'Hyaluronic Acid Moisturizer',
              brand: 'HydraLux',
              image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=300',
              price: 999,
              quantity: 1
            },
            {
              id: 5,
              name: 'SPF 50 Daily Sunscreen',
              brand: 'SunGuard',
              image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300',
              price: 899,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1898,
            tax: 171,
            discount: 170,
            shipping: 0,
            total: 1899
          }
        },
        {
          id: '10232',
          date: new Date('2024-01-10'),
          status: 'Confirmed',
          total: 1299,
          items: [
            {
              id: 6,
              name: 'Niacinamide Pore Refining Serum',
              brand: 'ClearSkin',
              image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300',
              price: 1299,
              quantity: 1
            }
          ],
          deliveryAddress: {
            name: 'Rumpa Samanta',
            phone: '9876543210',
            street: '123 Beauty Lane, Bandra West',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001'
          },
          pricing: {
            subtotal: 1299,
            tax: 117,
            discount: 117,
            shipping: 0,
            total: 1299
          }
        }
      ]
    };
  },
  mounted() {
    this.loadOrder();
  },
  methods: {
    loadOrder() {
      this.orderData = this.orders.find(order => order.id === this.orderId);
      if (!this.orderData) {
        this.$router.push('/orders');
      }
    },
    goBack() {
      this.$router.push('/orders');
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    getStatusClass(status) {
      return status.toLowerCase().replace(' ', '-');
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
    requestRefund() {
      this.showRefundModal = true;
      // Pre-select all items by default
      this.refundForm.selectedItems = this.orderData.items.map(item => item.id);
    },
    closeRefundModal() {
      this.showRefundModal = false;
      this.refundForm = {
        selectedItems: [],
        reason: '',
        note: ''
      };
    },
    closeSuccessModal() {
      this.showSuccessModal = false;
      this.refundRequestId = '';
    },
    toggleItemSelection(itemId) {
      const index = this.refundForm.selectedItems.indexOf(itemId);
      if (index > -1) {
        this.refundForm.selectedItems.splice(index, 1);
      } else {
        this.refundForm.selectedItems.push(itemId);
      }
    },
    calculateRefundAmount() {
      const selectedItems = this.orderData.items.filter(item =>
        this.refundForm.selectedItems.includes(item.id)
      );

      const subtotal = selectedItems.reduce((total, item) =>
        total + (item.price * item.quantity), 0
      );

      // Calculate proportional tax
      const taxRate = this.orderData.pricing.tax / this.orderData.pricing.subtotal;
      const tax = subtotal * taxRate;

      return {
        subtotal,
        tax,
        total: subtotal + tax
      };
    },
    submitRefundRequest() {
      if (!this.canSubmitRefund) return;

      // Generate a mock refund request ID
      this.refundRequestId = 'REF' + Date.now().toString().slice(-6);

      // Close refund modal and show success modal
      this.showRefundModal = false;
      this.showSuccessModal = true;

      // Reset form
      this.refundForm = {
        selectedItems: [],
        reason: '',
        note: ''
      };
    }
  },
  computed: {
    canSubmitRefund() {
      return this.refundForm.selectedItems.length > 0 && this.refundForm.reason;
    }
  }
};
</script>

<style scoped>
.order-details-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-btn {
  background: #fff;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  color: #6b7280;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #f9fafb;
}

.header-section h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.header-section p {
  color: #6b7280;
  margin: 4px 0 0 0;
  font-size: 14px;
}

.order-summary,
.order-items,
.delivery-address,
.price-breakdown {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
}

.summary-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.summary-header p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.status-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
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

.status-badge.processing {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 1px solid #f59e0b;
}

.status-badge.confirmed {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #3b82f6;
}

.status-badge.shipped {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #5b21b6;
  border: 1px solid #8b5cf6;
}

.status-badge.out-for-delivery {
  background: linear-gradient(135deg, #fef3e2 0%, #fed7aa 100%);
  color: #c2410c;
  border: 1px solid #f97316;
}

.status-badge.delivered {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #15803d;
  border: 1px solid #22c55e;
}

.status-badge.cancelled {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #dc2626;
  border: 1px solid #ef4444;
}

.refund-btn {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.refund-btn:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
}

h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 24px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.item-card {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
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

.item-details h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.item-brand {
  font-size: 14px;
  color: #8b4e9f;
  margin: 0 0 12px 0;
  font-weight: 500;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-meta span:first-child {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.item-price {
  font-size: 16px;
  font-weight: 700;
  color: #8b4e9f;
}

.address-content {
  background: #f9fafb;
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.address-content h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.address-content p {
  color: #6b7280;
  margin: 0 0 8px 0;
  line-height: 1.6;
}

.address-content p:last-child {
  color: #374151;
  font-size: 16px;
  margin: 0;
}

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

.breakdown-item span:first-child {
  color: #6b7280;
  font-weight: 500;
}

.breakdown-item span:last-child {
  font-weight: 600;
  color: #1f2937;
}

.breakdown-item .discount {
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

.breakdown-item.total span:first-child {
  color: #1f2937;
}

.breakdown-item.total span:last-child {
  color: #8b4e9f;
  font-size: 20px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 32px 32px 0 32px;
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 24px;
}

.modal-title-section {
  flex: 1;
}

.modal-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #8b4e9f 0%, #d946b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.modal-subtitle {
  color: #6b7280;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.modal-close-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f8fafc;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.modal-close-btn:hover {
  background: #f1f5f9;
  border-color: #d1d5db;
  color: #374151;
  transform: scale(1.05);
}

.modal-content {
  padding: 0 32px 32px 32px;
}

/* Order Info Section */
.order-info-section {
  background: linear-gradient(135deg, #f8f4f6 0%, #fef8f6 100%);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #f0e6e6;
}

.order-meta {
  display: flex;
  gap: 32px;
}

.order-detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-detail .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.order-detail .value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 700;
}

/* Refundable Items Section */
.refundable-items-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.refundable-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.refund-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border: 2px solid #f0f0f0;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refund-item:hover {
  border-color: #e9d5ff;
  background: #fefbff;
  transform: translateX(2px);
}

.refund-item.selected {
  border-color: #8b4e9f;
  background: linear-gradient(135deg, #f8f4f6 0%, #fef8f6 100%);
  box-shadow: 0 4px 20px rgba(139, 78, 159, 0.15);
}

.item-checkbox {
  flex-shrink: 0;
}

.item-checkbox input[type="checkbox"] {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.item-checkbox input[type="checkbox"]:checked {
  background: #8b4e9f;
  border-color: #8b4e9f;
}

.item-image-small {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info .item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.item-info .item-brand {
  font-size: 14px;
  color: #8b4e9f;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.item-details-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-qty {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.item-price-bold {
  font-size: 16px;
  font-weight: 700;
  color: #8b4e9f;
}

/* Form Section */
.refund-form-section {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
  font-size: 16px;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  color: #374151;
  transition: all 0.3s ease;
  box-sizing: border-box;
  font-family: inherit;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #8b4e9f;
  box-shadow: 0 0 0 3px rgba(139, 78, 159, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Refund Summary Section */
.refund-summary-section {
  margin-bottom: 32px;
}

.refund-summary-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 2px solid #bbf7d0;
  border-radius: 20px;
  padding: 24px;
}

.summary-title {
  font-size: 20px;
  font-weight: 700;
  color: #15803d;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.summary-title:before {
  content: '💰';
  font-size: 24px;
}

.amount-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.amount-row span:first-child {
  color: #374151;
  font-weight: 500;
}

.amount-row span:last-child {
  color: #1f2937;
  font-weight: 600;
}

.amount-divider {
  height: 2px;
  background: linear-gradient(90deg, #bbf7d0 0%, #86efac 50%, #bbf7d0 100%);
  margin: 8px 0;
  border-radius: 1px;
}

.total-amount {
  font-size: 18px;
  font-weight: 700;
  padding: 12px 0;
}

.total-amount span:first-child {
  color: #15803d;
}

.refund-total {
  color: #15803d;
  font-size: 24px;
}

.refund-notice {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
  color: #0369a1;
  font-size: 14px;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.refund-notice i {
  margin-top: 2px;
  flex-shrink: 0;
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 56px;
}

.btn-secondary {
  background: #fff;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
}

.btn-primary {
  background: linear-gradient(135deg, #8b4e9f 0%, #7c3aed 100%);
  border: 2px solid transparent;
  color: #fff;
}

.btn-primary:hover:not(.disabled) {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 78, 159, 0.3);
}

.btn-primary.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Success Modal Styles */
.success-modal-overlay {
  background: rgba(0, 0, 0, 0.8);
}

.success-modal {
  background: #fff;
  border-radius: 24px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  animation: successSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes successSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.success-content {
  padding: 48px 32px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px auto;
  animation: successPulse 2s infinite;
}

@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(34, 197, 94, 0);
  }
}

.success-icon i {
  font-size: 36px;
  color: #fff;
}

.success-title {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.success-message {
  font-size: 16px;
  color: #6b7280;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.success-details {
  background: #f9fafb;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  text-align: left;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 700;
}

.success-btn {
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .order-details-container {
    padding: 20px 16px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .status-section {
    width: 100%;
    justify-content: space-between;
  }

  .item-card {
    gap: 12px;
    padding: 16px;
  }

  .item-image {
    width: 60px;
    height: 60px;
  }

  .modal-overlay {
    padding: 10px;
  }

  .refund-modal {
    max-height: 95vh;
  }

  .modal-header,
  .modal-content {
    padding-left: 20px;
    padding-right: 20px;
  }

  .modal-title {
    font-size: 24px;
  }

  .order-meta {
    flex-direction: column;
    gap: 16px;
  }

  .refund-item {
    gap: 12px;
    padding: 12px;
  }

  .item-image-small {
    width: 50px;
    height: 50px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .success-content {
    padding: 32px 24px;
  }

  .success-icon {
    width: 60px;
    height: 60px;
  }

  .success-icon i {
    font-size: 28px;
  }

  .success-title {
    font-size: 24px;
  }
}
</style>
