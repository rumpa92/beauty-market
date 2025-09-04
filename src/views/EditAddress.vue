<template>
  <div class="edit-address-page">
    <!-- Header -->
    <div class="page-header">
      <div class="market-container">
        <div class="header-content">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>
          <h1 class="page-title">Edit Address</h1>
          <div class="header-spacer"></div>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div class="form-section">
      <div class="market-container">
        <div class="form-container">
          <form @submit.prevent="saveAddress" class="address-form">
            <!-- Personal Information -->
            <div class="form-section-header">
              <h2 class="section-title">
                <i class="fas fa-user"></i>
                Personal Information
              </h2>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Full Name *</label>
                <div class="input-wrapper">
                  <i class="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    placeholder="Enter your full name"
                    class="form-input"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address *</label>
                <div class="input-wrapper">
                  <i class="fas fa-envelope input-icon"></i>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    placeholder="Enter your email"
                    class="form-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone Number *</label>
              <div class="input-wrapper">
                <i class="fas fa-phone input-icon"></i>
                <input 
                  type="tel" 
                  v-model="form.phone" 
                  placeholder="+91 9876543210"
                  class="form-input"
                  required
                />
              </div>
            </div>

            <!-- Address Information -->
            <div class="form-section-header">
              <h2 class="section-title">
                <i class="fas fa-map-marker-alt"></i>
                Address Details
              </h2>
            </div>
            
            <div class="form-row">
              <div class="form-group pincode-group">
                <label class="form-label">Pincode *</label>
                <div class="input-wrapper">
                  <i class="fas fa-map-pin input-icon"></i>
                  <input 
                    type="text" 
                    v-model="form.pincode" 
                    placeholder="123456"
                    class="form-input"
                    pattern="[0-9]{6}"
                    maxlength="6"
                    required
                    @input="validatePincode"
                  />
                </div>
                <div v-if="pincodeValidation.show" :class="['pincode-feedback', pincodeValidation.type]">
                  <i :class="pincodeValidation.icon"></i>
                  <span>{{ pincodeValidation.message }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Building Name/Number *</label>
                <div class="input-wrapper">
                  <i class="fas fa-building input-icon"></i>
                  <input 
                    type="text" 
                    v-model="form.building" 
                    placeholder="Apartment 4B, Tower A"
                    class="form-input"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Address Line *</label>
              <div class="input-wrapper">
                <i class="fas fa-road input-icon"></i>
                <textarea 
                  v-model="form.street" 
                  placeholder="Street name, area, locality"
                  class="form-textarea"
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">City *</label>
                <div class="input-wrapper">
                  <i class="fas fa-city input-icon"></i>
                  <input 
                    type="text" 
                    v-model="form.city" 
                    placeholder="Enter city"
                    class="form-input"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">State *</label>
                <div class="input-wrapper">
                  <i class="fas fa-map input-icon"></i>
                  <select v-model="form.state" class="form-select" required>
                    <option value="">Select State</option>
                    <option v-for="state in states" :key="state" :value="state">{{ state }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Address Type Selection -->
            <div class="form-section-header">
              <h2 class="section-title">
                <i class="fas fa-tags"></i>
                Address Type
              </h2>
            </div>
            
            <div class="address-type-section">
              <div class="type-options">
                <label 
                  v-for="type in addressTypes" 
                  :key="type.value"
                  :class="['type-option', { selected: form.type === type.value }]"
                  @click="form.type = type.value"
                >
                  <div class="type-icon">
                    <i :class="type.icon"></i>
                  </div>
                  <div class="type-content">
                    <h3>{{ type.label }}</h3>
                    <p>{{ type.description }}</p>
                  </div>
                  <div class="type-radio">
                    <div :class="['radio-dot', { active: form.type === type.value }]"></div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Default Address Toggle -->
            <div class="form-group">
              <label class="toggle-label">
                <input type="checkbox" v-model="form.isDefault" class="toggle-input" />
                <span class="toggle-slider"></span>
                <span class="toggle-text">
                  <i class="fas fa-star"></i>
                  Set as default address
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="action-buttons">
      <div class="market-container">
        <div class="button-group">
          <button @click="cancelEdit" class="cancel-btn">
            <i class="fas fa-times"></i>
            Cancel
          </button>
          <button 
            @click="saveAddress" 
            :disabled="!isFormValid || isSaving"
            :class="['save-btn', { loading: isSaving }]"
          >
            <div v-if="isSaving" class="loading-spinner">
              <i class="fas fa-spinner fa-spin"></i>
            </div>
            <div v-else class="btn-icon">
              <i class="fas fa-save"></i>
            </div>
            <span>{{ isSaving ? 'Saving...' : 'Save Address' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast-notification success">
        <div class="toast-content">
          <div class="toast-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <span class="toast-message">Address updated successfully</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'EditAddress',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        pincode: '',
        building: '',
        street: '',
        city: '',
        state: '',
        type: 'home',
        isDefault: false
      },
      
      isSaving: false,
      showToast: false,
      
      pincodeValidation: {
        show: false,
        type: '', // 'success' or 'error'
        message: '',
        icon: ''
      },
      
      addressTypes: [
        {
          value: 'home',
          label: 'Home',
          description: 'Personal residential address',
          icon: 'fas fa-home'
        },
        {
          value: 'work',
          label: 'Work',
          description: 'Office or workplace address',
          icon: 'fas fa-briefcase'
        },
        {
          value: 'other',
          label: 'Other',
          description: 'Friend, family or other location',
          icon: 'fas fa-map-marker-alt'
        }
      ],
      
      states: [
        'Andhra Pradesh', 'Assam', 'Bihar', 'Delhi', 'Gujarat', 'Haryana',
        'Karnataka', 'Kerala', 'Maharashtra', 'Punjab', 'Rajasthan',
        'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'
      ],
      
      // Mock address data - in real app this would come from API
      mockAddresses: [
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
          type: 'home',
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
          type: 'work',
          isDefault: false
        }
      ]
    };
  },
  
  computed: {
    addressId() {
      return parseInt(this.$route.query.addressId);
    },
    
    fromPage() {
      return this.$route.query.from || 'select-address';
    },
    
    isFormValid() {
      return this.form.name && 
             this.form.email && 
             this.form.phone && 
             this.form.pincode && 
             this.form.building && 
             this.form.street && 
             this.form.city && 
             this.form.state &&
             this.form.pincode.length === 6;
    }
  },
  
  methods: {
    goBack() {
      if (this.fromPage === 'checkout') {
        this.$router.push('/checkout');
      } else {
        this.$router.push('/select-address');
      }
    },
    
    loadAddress() {
      // In real app, this would fetch from API
      const address = this.mockAddresses.find(addr => addr.id === this.addressId);
      if (address) {
        this.form = { ...address };
      }
    },
    
    validatePincode() {
      const pincode = this.form.pincode;
      
      if (pincode.length === 0) {
        this.pincodeValidation.show = false;
        return;
      }
      
      if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        this.pincodeValidation = {
          show: true,
          type: 'error',
          message: 'Please enter a valid 6-digit pincode',
          icon: 'fas fa-exclamation-circle'
        };
        return;
      }
      
      // Mock validation success
      this.pincodeValidation = {
        show: true,
        type: 'success',
        message: 'Pincode verified',
        icon: 'fas fa-check-circle'
      };
    },
    
    async saveAddress() {
      if (!this.isFormValid) return;
      
      this.isSaving = true;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update mock data
        const addressIndex = this.mockAddresses.findIndex(addr => addr.id === this.addressId);
        if (addressIndex !== -1) {
          this.mockAddresses[addressIndex] = { ...this.form, id: this.addressId };
        }
        
        this.showToast = true;
        
        setTimeout(() => {
          this.showToast = false;
          
          // Navigate back with success message
          const returnPath = this.fromPage === 'checkout' ? '/checkout' : '/select-address';
          this.$router.push({
            path: returnPath,
            query: {
              success: 'true',
              message: 'Address updated successfully',
              from: this.fromPage === 'checkout' ? 'checkout' : undefined
            }
          });
        }, 2000);
        
      } catch (error) {
        console.error('Failed to save address:', error);
      } finally {
        this.isSaving = false;
      }
    },
    
    cancelEdit() {
      this.goBack();
    }
  },
  
  mounted() {
    this.loadAddress();
  }
};
</script>

<style scoped>
.edit-address-page {
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
  width: 80px;
}

/* Form Section */
.form-section {
  padding: 2rem 0;
}

.form-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.form-section-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.section-title i {
  color: #667eea;
  font-size: 1.125rem;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.pincode-group {
  position: relative;
}

.form-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1rem;
  z-index: 1;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  line-height: 1.5;
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 1rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 3rem;
}

.pincode-feedback {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.pincode-feedback.success {
  color: #059669;
}

.pincode-feedback.error {
  color: #dc2626;
}

/* Address Type Selection */
.address-type-section {
  margin: 1rem 0;
}

.type-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.type-option:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.type-option.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.type-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.type-content {
  flex: 1;
}

.type-content h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.type-content p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.type-radio {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.type-option.selected .type-radio {
  border-color: #667eea;
}

.radio-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: transparent;
  transition: all 0.2s ease;
}

.radio-dot.active {
  background: #667eea;
}

/* Toggle Switch */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.2s ease;
}

.toggle-label:hover {
  border-color: #d1d5db;
}

.toggle-input {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background: #d1d5db;
  border-radius: 24px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.toggle-slider::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-slider {
  background: #667eea;
}

.toggle-input:checked + .toggle-slider::after {
  transform: translateX(24px);
}

.toggle-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.toggle-text i {
  color: #fbbf24;
}

/* Action Buttons */
.action-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
}

.button-group {
  display: flex;
  gap: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.cancel-btn,
.save-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.cancel-btn {
  background: #f8fafc;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(16, 185, 129, 0.4);
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.save-btn.loading {
  pointer-events: none;
}

.loading-spinner {
  font-size: 1.25rem;
}

.btn-icon {
  font-size: 1.125rem;
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

.toast-notification.success {
  border-left: 4px solid #10b981;
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
  .form-container {
    padding: 2rem;
    margin: 0 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .type-options {
    grid-template-columns: 1fr;
  }
  
  .button-group {
    margin: 0 1rem;
  }
  
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 1rem 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .form-container {
    padding: 1.5rem;
  }
  
  .section-title {
    font-size: 1.125rem;
  }
  
  .type-option {
    padding: 1rem;
  }
  
  .type-icon {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }
  
  .action-buttons {
    padding: 1rem 0;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
