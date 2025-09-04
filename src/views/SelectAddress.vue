<template>
  <div class="select-address-page">
    <!-- Header -->
    <div class="page-header">
      <div class="market-container">
        <div class="header-content">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <h1 class="page-title">Select Address</h1>
          <div class="header-spacer"></div>
        </div>
      </div>
    </div>

    <!-- Address List -->
    <div class="addresses-section">
      <div class="market-container">
        <div class="addresses-grid">
          <div 
            v-for="address in savedAddresses" 
            :key="address.id"
            :class="['address-card', { selected: selectedAddressId === address.id }]"
          >
            <!-- Edit Button -->
            <button @click="editAddress(address)" class="edit-address-btn">
              <i class="fas fa-edit"></i>
            </button>

            <!-- Address Type Badge -->
            <div class="address-type-badge" :class="address.type.toLowerCase()">
              <i :class="getAddressIcon(address.type)"></i>
              <span>{{ address.type }}</span>
            </div>

            <!-- Address Content -->
            <div class="address-content">
              <h3 class="recipient-name">{{ address.name }}</h3>
              <p class="phone-number">
                <i class="fas fa-phone"></i>
                {{ address.phone }}
              </p>
              <div class="address-details">
                <p class="address-line">{{ address.street }}</p>
                <p class="address-line">{{ address.city }}, {{ address.state }}</p>
                <p class="address-line">Pincode: {{ address.pincode }}</p>
              </div>
            </div>

            <!-- Deliver Here Button -->
            <div class="address-actions">
              <button 
                @click="selectAddress(address)"
                :class="['deliver-btn', { selected: selectedAddressId === address.id }]"
              >
                <i v-if="selectedAddressId === address.id" class="fas fa-check"></i>
                <span>{{ selectedAddressId === address.id ? 'Selected' : 'Deliver Here' }}</span>
              </button>
            </div>

            <!-- Default Badge -->
            <div v-if="address.isDefault" class="default-badge">
              <i class="fas fa-star"></i>
              <span>Default</span>
            </div>
          </div>
        </div>

        <!-- Add New Address Button -->
        <div class="add-address-section">
          <button @click="addNewAddress" class="add-address-btn">
            <div class="add-btn-content">
              <div class="add-icon">
                <i class="fas fa-plus"></i>
              </div>
              <div class="add-text">
                <h3>Add New Address</h3>
                <p>Deliver to a different location</p>
              </div>
            </div>
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>

        <!-- No Addresses State -->
        <div v-if="savedAddresses.length === 0" class="no-addresses">
          <div class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>No saved addresses</h3>
            <p>Add your first delivery address to continue</p>
            <button @click="addNewAddress" class="add-first-address-btn">
              <i class="fas fa-plus"></i>
              Add Address
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Action Button (Mobile) -->
    <div class="floating-action">
      <button @click="proceedWithSelectedAddress" :disabled="!selectedAddressId" class="proceed-btn">
        <i class="fas fa-check"></i>
        <span>Continue with Selected Address</span>
      </button>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification">
        <div class="toast-content">
          <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <span class="toast-message">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'SelectAddress',
  data() {
    return {
      selectedAddressId: null,
      showToast: false,
      toastMessage: '',
      
      // Mock saved addresses - in real app this would come from store/API
      savedAddresses: [
        {
          id: 1,
          name: 'Rumpa Samanta',
          email: 'rumpa@example.com',
          phone: '+91 9876543210',
          pincode: '400001',
          building: 'Apartment 4B',
          street: '123 Beauty Lane, Bandra West',
          city: 'Mumbai',
          state: 'Maharashtra',
          type: 'Home',
          isDefault: true
        },
        {
          id: 2,
          name: 'Rumpa Samanta',
          email: 'rumpa.work@example.com',
          phone: '+91 9876543210',
          pincode: '400002',
          building: 'Suite 200',
          street: '456 Corporate Plaza, Andheri East',
          city: 'Mumbai',
          state: 'Maharashtra',
          type: 'Work',
          isDefault: false
        },
        {
          id: 3,
          name: 'Mrs. Samanta',
          email: 'mother@example.com',
          phone: '+91 9876543211',
          pincode: '700001',
          building: 'Flat 3A',
          street: '789 Heritage Street, Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          type: 'Other',
          isDefault: false
        }
      ]
    };
  },
  
  computed: {
    fromCheckout() {
      return this.$route.query.from === 'checkout';
    }
  },
  
  methods: {
    ...mapActions('ui', ['showNotification']),
    
    goBack() {
      if (this.fromCheckout) {
        this.$router.push('/checkout');
      } else {
        this.$router.go(-1);
      }
    },
    
    selectAddress(address) {
      this.selectedAddressId = address.id;
      
      // If coming from checkout, immediately return to checkout with selected address
      if (this.fromCheckout) {
        setTimeout(() => {
          this.$router.push({
            path: '/checkout',
            query: { selectedAddressId: address.id }
          });
        }, 300);
      }
    },
    
    editAddress(address) {
      this.$router.push({
        path: '/edit-address',
        query: { 
          addressId: address.id,
          from: this.$route.query.from || 'select-address'
        }
      });
    },
    
    addNewAddress() {
      this.$router.push({
        path: '/add-address',
        query: { 
          from: this.$route.query.from || 'select-address'
        }
      });
    },
    
    proceedWithSelectedAddress() {
      if (!this.selectedAddressId) return;
      
      const selectedAddress = this.savedAddresses.find(addr => addr.id === this.selectedAddressId);
      if (selectedAddress) {
        this.showToastMessage('Address selected successfully');
        
        setTimeout(() => {
          if (this.fromCheckout) {
            this.$router.push({
              path: '/checkout',
              query: { selectedAddressId: this.selectedAddressId }
            });
          } else {
            this.$router.go(-1);
          }
        }, 1000);
      }
    },
    
    getAddressIcon(type) {
      const icons = {
        home: 'fas fa-home',
        work: 'fas fa-briefcase',
        other: 'fas fa-map-marker-alt'
      };
      return icons[type.toLowerCase()] || icons.other;
    },
    
    showToastMessage(message) {
      this.toastMessage = message;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    }
  },
  
  mounted() {
    // Auto-select default address if available
    const defaultAddress = this.savedAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      this.selectedAddressId = defaultAddress.id;
    }
    
    // Check for success message from route params
    if (this.$route.query.success) {
      this.showToastMessage(this.$route.query.message || 'Operation completed successfully');
      
      // Clean up URL
      this.$router.replace({ 
        path: this.$route.path,
        query: { from: this.$route.query.from }
      });
    }
  }
};
</script>

<style scoped>
.select-address-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding-bottom: 120px;
}

/* Header */
.page-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.back-button:hover {
  background: #e2e8f0;
  transform: translateX(-2px);
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
  flex: 1;
  text-align: center;
}

.header-spacer {
  width: 80px; /* Balance the back button */
}

/* Addresses Section */
.addresses-section {
  padding: 2rem 0;
}

.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.address-card {
  position: relative;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.address-card:hover {
  border-color: #667eea;
  transform: translateY(-4px);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.15);
}

.address-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.2);
}

.edit-address-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 2;
}

.edit-address-btn:hover {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.address-type-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.address-type-badge.home {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
}

.address-type-badge.work {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
}

.address-type-badge.other {
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
  color: #7c3aed;
}

.address-content {
  margin-bottom: 2rem;
}

.recipient-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.phone-number {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.phone-number i {
  color: #667eea;
}

.address-details {
  color: #6b7280;
  line-height: 1.6;
}

.address-line {
  margin-bottom: 0.25rem;
}

.address-actions {
  margin-bottom: 1rem;
}

.deliver-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.deliver-btn:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.deliver-btn.selected {
  border-color: #10b981;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.default-badge {
  position: absolute;
  top: -2px;
  left: -2px;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 18px 0 18px 0;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Add Address Section */
.add-address-section {
  margin-top: 2rem;
}

.add-address-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-address-btn:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transform: translateY(-2px);
}

.add-btn-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.add-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.add-text h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.add-text p {
  color: #6b7280;
  margin: 0;
}

.add-address-btn i:last-child {
  color: #9ca3af;
  font-size: 1.25rem;
}

/* No Addresses State */
.no-addresses {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-state {
  max-width: 400px;
  margin: 0 auto;
}

.empty-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  margin: 0 auto 2rem;
}

.empty-state h3 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 2rem;
}

.add-first-address-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-first-address-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

/* Floating Action Button */
.floating-action {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.proceed-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.proceed-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.5);
}

.proceed-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  z-index: 1000;
  min-width: 300px;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toast-icon {
  color: #10b981;
  font-size: 1.25rem;
}

.toast-message {
  color: #374151;
  font-weight: 500;
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Responsive Design */
@media (max-width: 768px) {
  .page-header {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .addresses-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .address-card {
    padding: 1.5rem;
  }
  
  .add-address-btn {
    padding: 1.5rem;
  }
  
  .add-btn-content {
    gap: 1rem;
  }
  
  .add-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
  
  .add-text h3 {
    font-size: 1.125rem;
  }
  
  .floating-action {
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }
  
  .proceed-btn {
    width: 100%;
    justify-content: center;
  }
  
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .addresses-section {
    padding: 1rem 0;
  }
  
  .address-card {
    padding: 1rem;
  }
  
  .recipient-name {
    font-size: 1.125rem;
  }
  
  .empty-icon {
    width: 100px;
    height: 100px;
    font-size: 2.5rem;
  }
  
  .empty-state h3 {
    font-size: 1.5rem;
  }
  
  .empty-state p {
    font-size: 1rem;
  }
  
  .header-content {
    gap: 0.5rem;
  }
  
  .header-spacer {
    width: 60px;
  }
}
</style>
