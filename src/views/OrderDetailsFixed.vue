<template>
  <div class="order-page">
    
    <!-- Header -->
    <div class="page-header">
      <button @click="goBack" class="back-button">
        ← Back
      </button>
      <h1>Order Details</h1>
    </div>

    <!-- Order Summary -->
    <div class="order-summary">
      <div class="order-info">
        <h2>Order #{{ orderId }}</h2>
        <p>Delivered on January 15, 2024</p>
      </div>
      <div class="order-actions">
        <span class="status-delivered">
          ✓ Delivered
        </span>
        <button @click="openRefundModal" class="refund-button">
          Request Refund
        </button>
      </div>
    </div>

    <!-- Order Items -->
    <div class="order-items">
      <h3>Order Items</h3>
      <div class="items-list">
        <div v-for="item in mockItems" :key="item.id" class="item">
          <div class="item-image">
            <img :src="item.image" :alt="item.name">
          </div>
          <div class="item-details">
            <h4>{{ item.name }}</h4>
            <p>{{ item.brand }}</p>
            <div class="item-price">
              <span>Qty: {{ item.quantity }}</span>
              <span>₹{{ item.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delivery Address -->
    <div class="delivery-section">
      <h3>Delivery Address</h3>
      <div class="address-card">
        <h4>Rumpa Samanta</h4>
        <p>+91 9876543210</p>
        <p>123 Beauty Lane, Bandra West, Mumbai, Maharashtra - 400001</p>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="price-section">
      <h3>Price Breakdown</h3>
      <div class="price-details">
        <div class="price-row">
          <span>Item Subtotal</span>
          <span>₹2,797.00</span>
        </div>
        <div class="price-row">
          <span>Tax</span>
          <span>₹252.00</span>
        </div>
        <div class="price-row discount">
          <span>Discount</span>
          <span>-₹300.00</span>
        </div>
        <div class="price-row">
          <span>Shipping Fee</span>
          <span>FREE</span>
        </div>
        <div class="price-divider"></div>
        <div class="price-row total">
          <span>Total Amount Paid</span>
          <span>₹2,499.00</span>
        </div>
      </div>
    </div>

    <!-- Refund Modal -->
    <div v-if="showModal" class="modal-backdrop" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <div>
            <h2>Refund Request</h2>
            <p>Only eligible delivered items can be refunded.</p>
          </div>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-content">
          <!-- Order Info -->
          <div class="order-info-box">
            <div class="info-item">
              <span class="label">Order ID:</span>
              <span class="value">#{{ orderId }}</span>
            </div>
            <div class="info-item">
              <span class="label">Delivery Date:</span>
              <span class="value">January 15, 2024</span>
            </div>
          </div>

          <!-- Items Selection -->
          <div class="items-section">
            <h3>Select Items to Refund</h3>
            <div class="refund-items">
              <div v-for="item in mockItems" :key="item.id" class="refund-item" 
                   :class="{ selected: selectedItems.includes(item.id) }"
                   @click="toggleItem(item.id)">
                <input type="checkbox" :checked="selectedItems.includes(item.id)">
                <img :src="item.image" :alt="item.name">
                <div class="item-info">
                  <h4>{{ item.name }}</h4>
                  <p>{{ item.brand }}</p>
                  <div class="item-meta">
                    <span>Qty: {{ item.quantity }}</span>
                    <span>₹{{ item.price }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Refund Form -->
          <div class="form-section">
            <div class="form-group">
              <label>Reason for Refund *</label>
              <select v-model="refundReason">
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
              <label>Additional Notes (Optional)</label>
              <textarea v-model="refundNotes" placeholder="Please provide more details about your refund request..."></textarea>
            </div>
          </div>

          <!-- Refund Amount -->
          <div class="refund-amount-section">
            <div class="amount-card">
              <h3>💰 Refund Amount</h3>
              <div class="amount-breakdown">
                <div class="amount-row">
                  <span>Items Subtotal:</span>
                  <span>₹{{ calculateSubtotal() }}</span>
                </div>
                <div class="amount-row">
                  <span>Tax (refundable):</span>
                  <span>₹{{ calculateTax() }}</span>
                </div>
                <div class="amount-divider"></div>
                <div class="amount-row total">
                  <span>Total Refund Amount:</span>
                  <span class="total-amount">₹{{ calculateTotal() }}</span>
                </div>
              </div>
              <p class="refund-info">
                ℹ️ Refund will be processed to your original payment method within 5-7 business days.
              </p>
            </div>
          </div>

          <!-- Modal Actions -->
          <div class="modal-actions">
            <button @click="closeModal" class="btn-cancel">Cancel</button>
            <button @click="submitRefund" :disabled="!canSubmit" class="btn-submit">
              ✈️ Submit Refund Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccess" class="modal-backdrop" @click="closeSuccess">
      <div class="success-modal" @click.stop>
        <div class="success-content">
          <div class="success-icon">✅</div>
          <h2>Refund Request Submitted!</h2>
          <p>Your refund request has been submitted. We'll notify you once it's processed.</p>
          <div class="success-details">
            <div class="detail">
              <span>Request ID:</span>
              <span>#{{ requestId }}</span>
            </div>
            <div class="detail">
              <span>Expected Processing:</span>
              <span>5-7 business days</span>
            </div>
          </div>
          <button @click="closeSuccess" class="btn-success">Got it</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'OrderDetailsFixed',
  props: {
    orderId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      showModal: false,
      showSuccess: false,
      selectedItems: [1, 2, 3],
      refundReason: '',
      refundNotes: '',
      requestId: '',
      mockItems: [
        {
          id: 1,
          name: 'Luxury Moisturizing Face Cream',
          brand: 'GlowLux',
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=150',
          price: 1299,
          quantity: 1
        },
        {
          id: 2,
          name: 'Vitamin C Brightening Serum',
          brand: 'VitaGlow',
          image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=150',
          price: 899,
          quantity: 1
        },
        {
          id: 3,
          name: 'Gentle Foaming Cleanser',
          brand: 'PureClean',
          image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=150',
          price: 599,
          quantity: 1
        }
      ]
    };
  },
  computed: {
    canSubmit() {
      return this.selectedItems.length > 0 && this.refundReason;
    }
  },
  methods: {
    goBack() {
      this.$router.push('/orders');
    },
    openRefundModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.refundReason = '';
      this.refundNotes = '';
      this.selectedItems = [1, 2, 3];
    },
    closeSuccess() {
      this.showSuccess = false;
      this.requestId = '';
    },
    toggleItem(id) {
      const index = this.selectedItems.indexOf(id);
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      } else {
        this.selectedItems.push(id);
      }
    },
    calculateSubtotal() {
      return this.selectedItems.reduce((total, id) => {
        const item = this.mockItems.find(item => item.id === id);
        return total + (item ? item.price : 0);
      }, 0);
    },
    calculateTax() {
      return Math.round(this.calculateSubtotal() * 0.09);
    },
    calculateTotal() {
      return this.calculateSubtotal() + this.calculateTax();
    },
    submitRefund() {
      if (!this.canSubmit) return;
      
      this.requestId = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
      this.showModal = false;
      this.showSuccess = true;
      
      this.refundReason = '';
      this.refundNotes = '';
      this.selectedItems = [1, 2, 3];
    }
  }
};
</script>

<style scoped>
.order-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.back-button {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 600;
  color: #6b7280;
}

.back-button:hover {
  background: #f9fafb;
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.order-summary,
.order-items,
.delivery-section,
.price-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.order-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.order-info h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.order-info p {
  color: #6b7280;
  margin: 0;
}

.order-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-delivered {
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #15803d;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  border: 1px solid #22c55e;
}

.refund-button {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.refund-button:hover {
  background: linear-gradient(135deg, #d97706, #b45309);
}

h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
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
  margin: 0 0 4px 0;
}

.item-details p {
  font-size: 14px;
  color: #8b4e9f;
  margin: 0 0 8px 0;
  font-weight: 500;
}

.item-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.item-price span:first-child {
  color: #6b7280;
}

.item-price span:last-child {
  color: #8b4e9f;
  font-weight: 700;
}

.address-card {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.address-card h4 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.address-card p {
  color: #6b7280;
  margin: 0 0 4px 0;
}

.price-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
}

.price-row span:first-child {
  color: #6b7280;
}

.price-row span:last-child {
  color: #1f2937;
  font-weight: 600;
}

.price-row.discount span:last-child {
  color: #22c55e;
}

.price-divider {
  height: 2px;
  background: linear-gradient(90deg, #f0e6e6, #e9d5ff, #f0e6e6);
  margin: 8px 0;
  border-radius: 1px;
}

.price-row.total {
  font-size: 18px;
  font-weight: 700;
}

.price-row.total span:first-child {
  color: #1f2937;
}

.price-row.total span:last-child {
  color: #8b4e9f;
  font-size: 20px;
}

/* Modal Styles */
.modal-backdrop {
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
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
  background: linear-gradient(135deg, #8b4e9f, #d946b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.modal-header p {
  color: #6b7280;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #6b7280;
}

.close-btn:hover {
  background: #f1f5f9;
}

.modal-content {
  padding: 0 24px 24px 24px;
}

.order-info-box {
  background: linear-gradient(135deg, #f8f4f6, #fef8f6);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  border: 1px solid #f0e6e6;
  display: flex;
  gap: 24px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-item .value {
  font-size: 16px;
  color: #1f2937;
  font-weight: 700;
}

.items-section {
  margin-bottom: 20px;
}

.items-section h3 {
  font-size: 18px;
  margin-bottom: 12px;
}

.refund-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.refund-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border: 2px solid #f0f0f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refund-item:hover {
  border-color: #e9d5ff;
}

.refund-item.selected {
  border-color: #8b4e9f;
  background: linear-gradient(135deg, #f8f4f6, #fef8f6);
}

.refund-item input {
  width: 16px;
  height: 16px;
}

.refund-item img {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 2px 0;
}

.item-info p {
  font-size: 12px;
  color: #8b4e9f;
  margin: 0 0 4px 0;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.item-meta span:first-child {
  color: #6b7280;
}

.item-meta span:last-child {
  color: #8b4e9f;
  font-weight: 700;
}

.form-section {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
  font-size: 14px;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  box-sizing: border-box;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b4e9f;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.refund-amount-section {
  margin-bottom: 24px;
}

.amount-card {
  background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
  border: 2px solid #bbf7d0;
  border-radius: 16px;
  padding: 20px;
}

.amount-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #15803d;
  margin: 0 0 12px 0;
}

.amount-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.amount-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.amount-row span:first-child {
  color: #374151;
}

.amount-row span:last-child {
  color: #1f2937;
  font-weight: 600;
}

.amount-divider {
  height: 2px;
  background: linear-gradient(90deg, #bbf7d0, #86efac, #bbf7d0);
  margin: 6px 0;
  border-radius: 1px;
}

.amount-row.total {
  font-size: 16px;
  font-weight: 700;
  padding-top: 6px;
}

.amount-row.total span:first-child {
  color: #15803d;
}

.total-amount {
  color: #15803d;
  font-size: 20px;
}

.refund-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
  color: #0369a1;
  font-size: 12px;
  line-height: 1.4;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
}

.btn-cancel:hover {
  background: #f9fafb;
}

.btn-submit {
  background: linear-gradient(135deg, #8b4e9f, #7c3aed);
  border: none;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Success Modal */
.success-modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.success-content {
  padding: 40px 24px;
  text-align: center;
}

.success-icon {
  font-size: 60px;
  margin-bottom: 20px;
}

.success-content h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.success-content p {
  color: #6b7280;
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.success-details {
  background: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: left;
}

.detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.detail:last-child {
  margin-bottom: 0;
}

.detail span:first-child {
  color: #6b7280;
}

.detail span:last-child {
  color: #1f2937;
  font-weight: 600;
}

.btn-success {
  background: linear-gradient(135deg, #8b4e9f, #7c3aed);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
}

.btn-success:hover {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .order-page {
    padding: 20px 16px;
  }
  
  .order-summary {
    flex-direction: column;
    gap: 16px;
  }
  
  .order-actions {
    justify-content: space-between;
    width: 100%;
  }
  
  .modal {
    margin: 10px;
    max-width: none;
  }
  
  .modal-header,
  .modal-content {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .order-info-box {
    flex-direction: column;
    gap: 12px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style>
